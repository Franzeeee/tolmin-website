import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      console.error('❌ Failed to connect to DB')
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const result = await sponsorsCollection.deleteOne({ _id: new ObjectId(params.id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Sponsor deleted' })
  } catch (error) {
    console.error('❌ Error in DELETE /api/sponsors/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// UPDATE sponsor by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, logoUrl } = body

    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      console.error('❌ Failed to connect to DB')
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const result = await sponsorsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { name, logoUrl } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Sponsor updated', 
      updatedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('❌ Error in PUT /api/sponsors/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
