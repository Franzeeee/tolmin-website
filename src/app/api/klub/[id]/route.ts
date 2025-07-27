import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const productsCollection = await getCollection('klub')
  if (!productsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Klub not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Klub deleted' })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { img, content } = body

  if (!content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const productsCollection = await getCollection('klub')
  if (!productsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { img, content } }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Klub not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Klub updated', updatedCount: result.modifiedCount })
}


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const productsCollection = await getCollection('klub')
  if (!productsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const product = await productsCollection.findOne({ _id: new ObjectId(id) })
  if (!product) {
    return NextResponse.json({ error: 'Klub not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}