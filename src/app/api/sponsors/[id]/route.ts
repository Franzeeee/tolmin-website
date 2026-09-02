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
  const { name, logoUrl, categories } = body

  const update: Record<string, unknown> = {}
  if (name !== undefined) update.name = name
  if (logoUrl !== undefined) update.logoUrl = logoUrl
  if (categories !== undefined) {
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'categories must be a non-empty array' }, { status: 400 })
    }
    update.categories = categories
    // Clear the legacy singular field once a sponsor is migrated to the array shape.
    update.category = null
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const sponsorsCollection = await getCollection('sponsors')
  if (!sponsorsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await sponsorsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Sponsor updated', updatedCount: result.modifiedCount })
}
