import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

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

    return NextResponse.json(
      { message: 'Order created!', orderId: newOrder.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
