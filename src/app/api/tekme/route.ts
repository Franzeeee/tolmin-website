import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const tekmeCollection = await getCollection('tekme');

    if (!tekmeCollection) {
      return NextResponse.json({ message: 'Error fetching tekme', error: 'Collection not found' }, { status: 500 });
    }

    const members = await tekmeCollection.find().sort({ datetime: -1 }).toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tekme', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      league,
      season,
      round,
      datetime,
      venue,
      place,
      opponent,
      opponentLogo,
      status,
      tolminScore,
      opponentScore,
    } = body;

    if (!league || !season || !datetime || !venue || !place || !opponent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (venue !== 'HOME' && venue !== 'AWAY') {
      return NextResponse.json({ error: 'Invalid venue' }, { status: 400 });
    }

    const resolvedStatus = status === 'FINISHED' ? 'FINISHED' : 'SCHEDULED';

    const tekmeCollection = await getCollection('tekme');
    if (!tekmeCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newTekma = await tekmeCollection.insertOne({
      league,
      season,
      round: round || '',
      datetime,
      venue,
      place,
      opponent,
      opponentLogo: opponentLogo || '',
      status: resolvedStatus,
      tolminScore: resolvedStatus === 'FINISHED' ? Number(tolminScore) : null,
      opponentScore: resolvedStatus === 'FINISHED' ? Number(opponentScore) : null,
    });

    return NextResponse.json(
      { message: 'Tekma created!', tekmaId: newTekma.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/tekme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
