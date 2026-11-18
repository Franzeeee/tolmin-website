import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { sendEmailJs } from '@/lib/emailjs';

export type CustomerEmailKind = 'confirmation' | 'shipped' | 'delivered' | 'cancelled';

type OrderItem = {
  name: string;
  size?: string | null;
  quantity: number;
  price: number | string;
};

type OrderLike = {
  _id?: unknown;
  customer?: { name?: string; email?: string; address?: string | null };
  items?: OrderItem[];
  totalPrice?: number | string;
  deliveryMethod?: string;
};

// One generic EmailJS template serves all four customer emails (the free plan
// only allows 2 templates). Only the text variables below change per kind.
const COPY: Record<CustomerEmailKind, { subject: string; heading: string; message: string }> = {
  confirmation: {
    subject: 'Potrditev naročila - NK Tolmin',
    heading: 'Hvala za vaše naročilo!',
    message: 'Prejeli smo vaše naročilo in ga pripravljamo. O nadaljnjih korakih vas bomo obvestili po e-pošti.',
  },
  shipped: {
    subject: 'Vaše naročilo je poslano - NK Tolmin',
    heading: 'Vaše naročilo je poslano',
    message: 'Vaše naročilo je bilo oddano v pošiljanje oziroma je pripravljeno za prevzem.',
  },
  delivered: {
    subject: 'Vaše naročilo je dostavljeno - NK Tolmin',
    heading: 'Naročilo je dostavljeno',
    message: 'Vaše naročilo je bilo uspešno dostavljeno. Hvala, ker podpirate NK Tolmin!',
  },
  cancelled: {
    subject: 'Vaše naročilo je preklicano - NK Tolmin',
    heading: 'Naročilo je preklicano',
    message: 'Vaše naročilo je bilo preklicano. Če imate vprašanja, nam odgovorite na to sporočilo.',
  },
};

export function buildCustomerEmailParams(order: OrderLike, kind: CustomerEmailKind) {
  const copy = COPY[kind];
  const items = order.items ?? [];
  const itemsText = items
    .map(
      (item) =>
        `${item.quantity}x ${item.name}${item.size && item.size !== 'N/A' ? ` (${item.size})` : ''} — ${Number(item.price).toFixed(2)} €`
    )
    .join('\n');

  return {
    to_email: order.customer?.email ?? '',
    customer_name: order.customer?.name || 'kupec',
    subject: copy.subject,
    heading: copy.heading,
    message: copy.message,
    order_id: String(order._id ?? ''),
    items_text: itemsText,
    total_price: `${Number(order.totalPrice ?? 0).toFixed(2)} €`,
    delivery_method: order.deliveryMethod || '',
    customer_address: order.customer?.address || '',
  };
}

// Never throws: a failed email must not break order creation or status changes.
export async function sendCustomerEmail(order: OrderLike, kind: CustomerEmailKind) {
  try {
    if (!order.customer?.email) return;
    await sendEmailJs(
      buildCustomerEmailParams(order, kind),
      process.env.EMAILJS_TEMPLATE_CUSTOMER
    );
  } catch (error) {
    console.error(`❌ Failed to send customer "${kind}" email:`, error);
  }
}

export async function sendCustomerEmailById(orderId: string, kind: CustomerEmailKind) {
  try {
    const orders = await getCollection('orders');
    if (!orders) return;
    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (order) await sendCustomerEmail(order as OrderLike, kind);
  } catch (error) {
    console.error(`❌ Failed to load order for "${kind}" email:`, error);
  }
}
