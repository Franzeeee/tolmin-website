import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const oldTeamCollection = await getCollection('old_team');

    if (!oldTeamCollection) {
      return NextResponse.json({ message: 'Error fetching old teams', error: 'Collection not found' }, { status: 500 });
    }

    const members = await oldTeamCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching old teams', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { season, image } = body;

    if (!season || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const oldTeamCollection = await getCollection('old_team');
    if (!oldTeamCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newMember = await oldTeamCollection.insertOne({
      season,
      image
    });

    return NextResponse.json(
      { message: 'Old team created!', memberId: newMember.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/old-team:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
