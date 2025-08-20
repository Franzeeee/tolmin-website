import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const contactCollection = await getCollection('contact');

    if (!contactCollection) {
      return NextResponse.json({ message: 'Error fetching contacts', error: 'Collection not found' }, { status: 500 });
    }

    const members = await contactCollection.find().toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contacts', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { contact_number, email } = body;

        if (!contact_number || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const contactCollection = await getCollection('contact');
        if (!contactCollection) {
            return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 });
        }

        // Delete all existing records
        await contactCollection.deleteMany({});

        // Insert the new record
        const newMember = await contactCollection.insertOne({
            contact_number,
            email
        });

        return NextResponse.json(
            {
                message: 'Replaced contacts with new entry',
                deletedAll: true,
                memberId: newMember.insertedId
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('❌ Error in POST /api/contact:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
