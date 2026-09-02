import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('lestvica_tabela');

    if (!collection) {
      return NextResponse.json({ message: 'Error fetching lestvica_tabela', error: 'Collection not found' }, { status: 500 });
    }

    const rows = await collection.find().toArray();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching lestvica_tabela', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const newRow = await collection.insertOne({
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
    });

    return NextResponse.json(
      { message: 'Row created!', rowId: newRow.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/lestvica-tabela:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
