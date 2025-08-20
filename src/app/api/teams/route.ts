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

    const errors: string[] = [];

    if (!firstName) errors.push('firstName is required');
    if (!lastName) errors.push('lastName is required');

    if (number === undefined || number === null || number === '') {
      errors.push('number is required');
    } else if (typeof number !== 'number') {
      // allow numeric strings like "10" but reject other types
      if (typeof number === 'string') {
      if (!/^\d+$/.test(number.trim())) {
        errors.push('number must be a numeric value (e.g. "10" or 10)');
      }
      } else {
      errors.push('number must be a numeric value');
      }
    }

    if (!position) errors.push('position is required');

    if (errors.length > 0) {
      return NextResponse.json(
      { error: 'Invalid request', details: errors },
      { status: 400 }
      );
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
