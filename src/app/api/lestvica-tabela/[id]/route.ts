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
      team,
      teamLogo,
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      points,
    } = body;

    if (!league || !team) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const collection = await getCollection('lestvica_tabela');
    if (!collection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          league,
          team,
          teamLogo: teamLogo || '',
          played: Number(played) || 0,
          wins: Number(wins) || 0,
          draws: Number(draws) || 0,
          losses: Number(losses) || 0,
          goalsFor: Number(goalsFor) || 0,
          goalsAgainst: Number(goalsAgainst) || 0,
          points: Number(points) || 0,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Row not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Row updated!' });
  } catch (error) {
    console.error('❌ Error in PUT /api/lestvica-tabela/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const collection = await getCollection('lestvica_tabela');
    if (!collection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Row not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Row deleted' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/lestvica-tabela/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
