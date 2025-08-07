import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  // Ensure we have something to update
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
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
    message: 'Order Status Changed To Shipped',
    updatedCount: result.modifiedCount,
  });
}
