import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const productsCollection = await getCollection('products')
  if (!productsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Product deleted' })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, price } = body

  if (!name || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const productsCollection = await getCollection('products')
  if (!productsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, price } }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Product updated', updatedCount: result.modifiedCount })
}
