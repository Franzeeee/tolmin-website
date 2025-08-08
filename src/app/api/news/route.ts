import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const teamCollection = await getCollection('news');

    if (!teamCollection) {
      return NextResponse.json({ message: 'Error fetching news', error: 'Collection not found' }, { status: 500 });
    }

    const members = await teamCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching news', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, image, content } = body;
    const publishedAt = new Date();

    if (!title || !description || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teamCollection = await getCollection('news');
    if (!teamCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
    }

    const newMember = await teamCollection.insertOne({
      title,
      description,
      image,
      content,
      publishedAt
    });

    return NextResponse.json(
      { message: 'News article created!', memberId: newMember.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST /api/news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
