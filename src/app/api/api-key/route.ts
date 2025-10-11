import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET /api/api-key
export async function GET() {
  try {
    const col = await getCollection('api_key'); // ✅ correct collection
    if (!col) {
      return NextResponse.json({ message: 'Error fetching API key', error: 'Collection not found' }, { status: 500 });
    }

    const latest = await col.find().sort({ createdAt: -1 }).limit(1).toArray();
    if (latest.length === 0) {
      return NextResponse.json({ message: 'No API key found' }, { status: 404 });
    }

    // Return a consistent shape with api_key
    return NextResponse.json({
      _id: latest[0]._id,
      api_key: latest[0].api_key,
      createdAt: latest[0].createdAt,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching API key', error }, { status: 500 });
  }
}

// POST /api/api-key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key || typeof api_key !== 'string' || !api_key.trim()) {
      return NextResponse.json({ error: 'Missing or invalid api_key' }, { status: 400 });
    }

    const col = await getCollection('api_key');
    if (!col) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    // Replace all existing keys to ensure only one active key
    await col.deleteMany({});

    const newDoc = await col.insertOne({
      api_key: api_key.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Replaced API keys with new entry',
        deletedAll: true,
        id: newDoc.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/api-key:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
