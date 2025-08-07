import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  const body = await request.json();

  const {
    customer,
    items,
    totalItems,
    totalPrice,
    paymentMethod,
    paymentStatus,
    deliveryMethod,
  } = body;

  if (!customer || !items || !paymentMethod || !deliveryMethod || totalItems == null || totalPrice == null || paymentStatus == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ordersCollection = await getCollection('orders');
  if (!ordersCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
  }

  const result = await ordersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        customer,
        items,
        totalItems,
        totalPrice,
        paymentMethod,
        paymentStatus,
        deliveryMethod,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Order updated', updatedCount: result.modifiedCount });
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const ordersCollection = await getCollection('orders');
  if (!ordersCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
  }

  const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Order deleted' });
}



export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  const ordersCollection = await getCollection('orders');
  if (!ordersCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
  }

  try {
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error('❌ Error in GET /api/orders/[id]:', err);
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }
}