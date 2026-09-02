import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const result = await tekmeCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
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
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tekma not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tekma updated!' });
  } catch (error) {
    console.error('❌ Error in PUT /api/tekme/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tekmeCollection = await getCollection('tekme');
    if (!tekmeCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const result = await tekmeCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Tekma not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tekma deleted' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/tekme/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
