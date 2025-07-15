import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const coll = await getCollection('sponsors')
    if (!coll) throw new Error('DB connection failed')

    const result = await coll.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Sponsor deleted' })
  } catch (err) {
    console.error('❌ DELETE /api/sponsors/[id]:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// UPDATE sponsor by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, logoUrl } = body
    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const coll = await getCollection('sponsors')
    if (!coll) throw new Error('DB connection failed')

    const result = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, logoUrl } }
    )
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Sponsor updated',
      updatedCount: result.modifiedCount,
    })
  } catch (err) {
    console.error('❌ PUT /api/sponsors/[id]:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
