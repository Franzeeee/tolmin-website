import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const teamCollection = await getCollection('teams');

    if (!teamCollection) {
      return NextResponse.json({ message: 'Error fetching teams', error: 'Collection not found' }, { status: 500 });
    }

    const members = await teamCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching teams', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, number, img, position } = body;

    if (!firstName || !lastName || number === undefined || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teamCollection = await getCollection('teams');
    if (!teamCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    // Optional: check if number already exists
    const existing = await teamCollection.findOne({ number });
    if (existing) {
      return NextResponse.json({ error: `Player #${number} already exists` }, { status: 409 });
    }

    const newMember = await teamCollection.insertOne({
      firstName,
      lastName,
      number,
      img,
      position,
    });

    return NextResponse.json(
      { message: 'Team member created!', memberId: newMember.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/teams:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
