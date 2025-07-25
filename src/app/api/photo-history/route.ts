import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const photoHistoryCollection = await getCollection('photo_history');
    if (!photoHistoryCollection) {
      return NextResponse.json({ message: 'Error fetching photo history', error: 'Collection not found' }, { status: 500 });
    }
    const photos = await photoHistoryCollection.find().sort({ sequence: 1 }).toArray(); // or `createdAt`
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching photo history', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
    type PhotoHistoryItem = {
        year: number;
        // add other fields as needed
        [key: string]: unknown;
    };

    try {
        const data: PhotoHistoryItem[] = await request.json();

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const photoHistoryCollection = await getCollection('photo_history');

        if (!photoHistoryCollection) {
            return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
        }

        // Delete all existing documents
        await photoHistoryCollection.deleteMany({});

        // Insert the new data
        const result = await photoHistoryCollection.insertMany(data);

        return NextResponse.json({
            message: 'Photo history replaced successfully',
            insertedCount: result.insertedCount,
        });
    } catch (error) {
        console.error('❌ Error replacing photo history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
