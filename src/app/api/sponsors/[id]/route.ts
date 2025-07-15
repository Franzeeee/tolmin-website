import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const sponsorsCollection = await getCollection('sponsors')
  if (!sponsorsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await sponsorsCollection.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Sponsor deleted' })
}

// UPDATE sponsor by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, logoUrl } = body

  if (!name || !logoUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const sponsorsCollection = await getCollection('sponsors')
  if (!sponsorsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await sponsorsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, logoUrl } }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Sponsor updated', updatedCount: result.modifiedCount })
}
