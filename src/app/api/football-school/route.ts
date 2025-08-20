import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const teamCollection = await getCollection('football_school');

    if (!teamCollection) {
      return NextResponse.json({ message: 'Error fetching football school', error: 'Collection not found' }, { status: 500 });
    }

    const members = await teamCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching football school', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, img, content, coaches } = body;

    if (!name || !content ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teamCollection = await getCollection('football_school');
    if (!teamCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    // Optional: check if name already exists
    const existing = await teamCollection.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: `Football School ${name} already exists` }, { status: 409 });
    }

    const newMember = await teamCollection.insertOne({
      name,
      img,
      content,
      coaches
    });

    return NextResponse.json(
      { message: 'Football School created!', memberId: newMember.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/football-school:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
