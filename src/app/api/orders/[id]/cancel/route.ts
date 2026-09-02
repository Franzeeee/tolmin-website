import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').filter(Boolean).at(-2); // 'orders/[id]/cancel'
  const body = await request.json();

  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Order ID not found in URL' }, { status: 400 });
  }

  const ordersCollection = await getCollection('orders');
  if (!ordersCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
  }

  const updateFields: Record<string, unknown> = {
    ...body,
    updatedAt: new Date(),
  };

  const result = await ordersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Order Status Changed To Cancelled',
    updatedCount: result.modifiedCount,
  });
}
