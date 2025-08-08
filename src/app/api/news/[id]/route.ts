import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// DELETE sponsor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const newsCollection = await getCollection('news')
  if (!newsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await newsCollection.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'News article not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'News article deleted' })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { title, description, image, content } = body

if (!title) {
    return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
}
if (!description) {
    return NextResponse.json({ error: 'Missing required field: description' }, { status: 400 })
}
if (!image) {
    return NextResponse.json({ error: 'Missing required field: image' }, { status: 400 })
}
if (!content) {
    return NextResponse.json({ error: 'Missing required field: content' }, { status: 400 })
}

  const newsCollection = await getCollection('news')
  if (!newsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const result = await newsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, content, image, description } }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'News article not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'News article updated', updatedCount: result.modifiedCount })
}


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const newsCollection = await getCollection('news')
  if (!newsCollection) {
    return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
  }

  const newsArticle = await newsCollection.findOne({ _id: new ObjectId(id) })
  if (!newsArticle) {
    return NextResponse.json({ error: 'News article not found' }, { status: 404 })
  }

  return NextResponse.json(newsArticle)
}