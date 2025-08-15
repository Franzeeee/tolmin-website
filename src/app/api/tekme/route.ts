import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const tekmeCollection = await getCollection('tekme');

    if (!tekmeCollection) {
      return NextResponse.json({ message: 'Error fetching tekme', error: 'Collection not found' }, { status: 500 });
    }

    const members = await tekmeCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tekme', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { league, season, datetime, place, enemy, enemyLogo, score } = body;

    if (!league || !season || !datetime || !place || !enemy || !enemyLogo || !score) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tekmeCollection = await getCollection('tekme');
    if (!tekmeCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newTekma = await tekmeCollection.insertOne({
      league,
      season,
      datetime,
      place,
      enemy,
      enemyLogo,
      score,
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
