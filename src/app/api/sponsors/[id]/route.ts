import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    await sponsorsCollection.deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ message: 'Sponsor deleted' })
  } catch (error) {
    console.error('❌ Error in DELETE /api/sponsors/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, logoUrl } = body

    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const updated = await sponsorsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { name, logoUrl } }
    )

    return NextResponse.json({ message: 'Sponsor updated', updatedCount: updated.modifiedCount })
  } catch (error) {
    console.error('❌ Error in PUT /api/sponsors/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
