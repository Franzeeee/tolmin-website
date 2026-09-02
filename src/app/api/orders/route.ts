import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { sendEmailJs, ORDER_NOTIFICATION_TO } from '@/lib/emailjs';

type OrderItem = {
  name: string;
  size?: string | null;
  quantity: number;
  price: number | string;
};

type OrderCustomer = {
  name?: string;
  email: string;
  phone?: string;
  address?: string | null;
};

function buildOrderEmailParams(params: {
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  paymentMethod: string;
  deliveryMethod: string;
}) {
  const { orderId, customer, items, totalItems, totalPrice, paymentMethod, deliveryMethod } = params;

  const itemsText = items
    .map(
      (item) =>
        `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} — ${Number(item.price).toFixed(2)} €`
    )
    .join('\n');

  return {
    to_email: ORDER_NOTIFICATION_TO,
    order_id: orderId,
    items_text: itemsText,
    total_items: totalItems,
    total_price: `${Number(totalPrice).toFixed(2)} €`,
    payment_method: paymentMethod,
    delivery_method: deliveryMethod,
    customer_name: customer.name || 'N/A',
    customer_email: customer.email,
    customer_phone: customer.phone || 'N/A',
    customer_address: customer.address || 'Ni vnesenega naslova',
  };
}

export async function GET() {
  try {
    const ordersCollection = await getCollection('orders');
    if (!ordersCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const orders = await ordersCollection.find().toArray();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('❌ Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer,           // { name, email, address }
      items,              // [ { product, name, size, quantity, price } ]
      totalItems,
      totalPrice,
      paymentMethod,
      paymentStatus,
      deliveryMethod,
      status
    } = body;

    if (!customer || !items || !paymentMethod || !deliveryMethod || totalItems == null || totalPrice == null || paymentStatus == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ordersCollection = await getCollection('orders');
    if (!ordersCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newOrder = await ordersCollection.insertOne({
      customer,
      items,
      totalItems,
      totalPrice,
      paymentMethod,
      paymentStatus,
      deliveryMethod,
      status,
      orderedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await sendEmailJs(
        buildOrderEmailParams({
          orderId: newOrder.insertedId.toString(),
          customer,
          items,
          totalItems,
          totalPrice,
          paymentMethod,
          deliveryMethod,
        })
      );
    } catch (emailError) {
      // Never fail order creation because the notification email didn't send.
      console.error('❌ Failed to send order notification email:', emailError);
    }

    return NextResponse.json(
      { message: 'Order created!', orderId: newOrder.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
