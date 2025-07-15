import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function GET() {
  try {
    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const sponsors = await sponsorsCollection.find().toArray()
    return NextResponse.json(sponsors)
  } catch (error) {
    console.error('❌ Error in GET /api/sponsors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category, logoUrl } = body

    const sponsorsCollection = await getCollection('sponsors')
    if (!sponsorsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const newSponsor = await sponsorsCollection.insertOne({
      name,
      category,         // e.g., 'Main', 'Partner', 'Support'
      logoUrl,          // optional: URL/path of uploaded logo
      createdAt: new Date(),
    })

    return NextResponse.json({ message: 'Sponsor created!', sponsorId: newSponsor.insertedId }, { status: 201 })
  } catch (error) {
    console.error('❌ Error in POST /api/sponsors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
