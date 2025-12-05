import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const resultCollection = await getCollection('result');

    if (!resultCollection) {
      return NextResponse.json({ message: 'Error fetching results', error: 'Collection not found' }, { status: 500 });
    }

    const members = await resultCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching results', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { season, image } = body;

    if (!season || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resultCollection = await getCollection('result');
    if (!resultCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newMember = await resultCollection.insertOne({
      season,
      image
    });

    return NextResponse.json(
      { message: 'Result created!', memberId: newMember.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
