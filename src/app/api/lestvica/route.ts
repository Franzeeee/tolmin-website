import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

/* ---------------- ENV VALIDATION ---------------- */
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('❌ Cloudinary environment variables are missing');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/* ---------------- TYPES ---------------- */
type ResultDocument = {
  season_start: string;
  season_end: string;
  image: string;
  createdAt: Date;
};

/* ---------------- HELPERS ---------------- */
function isValidSeason(season: string): { start: string; end: string } | null {
  const match = season.match(/^(\d{4})-(\d{4})$/);
  if (!match) return null;

  const start = Number(match[1]);
  const end = Number(match[2]);

  if (end !== start + 1) return null;

  return { start: match[1], end: match[2] };
}

function isValidImage(file: File): boolean {
  return (
    file.type.startsWith('image/') &&
    file.size > 0 &&
    file.size <= 5 * 1024 * 1024 // 5MB
  );
}

/* ---------------- GET ---------------- */
export async function GET(): Promise<NextResponse> {
  try {
    const collection = await getCollection('results');

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 500 }
      );
    }

    const results = await collection
      .find()
      .sort({ season_start: -1 })
      .toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error('❌ GET /results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

/* ---------------- POST ---------------- */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const collection = await getCollection('results');

    if (!collection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const season = formData.get('season');
    const image = formData.get('image');

    /* ---- Validation ---- */
    if (typeof season !== 'string') {
      return NextResponse.json(
        { error: 'Season is required' },
        { status: 400 }
      );
    }

    const parsedSeason = isValidSeason(season);
    if (!parsedSeason) {
      return NextResponse.json(
        { error: 'Invalid season format (use YYYY-YYYY)' },
        { status: 400 }
      );
    }

    if (!(image instanceof File) || !isValidImage(image)) {
      return NextResponse.json(
        { error: 'Invalid image file' },
        { status: 400 }
      );
    }

    /* ---- Upload to Cloudinary ---- */
    const buffer = Buffer.from(await image.arrayBuffer());

    const upload = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'season-results' },
          (error, result) => {
            if (error || !result?.secure_url) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      }
    );

    /* ---- Insert document ---- */
    const doc: ResultDocument = {
      season_start: parsedSeason.start,
      season_end: parsedSeason.end,
      image: upload.secure_url,
      createdAt: new Date(),
    };

    await collection.insertOne(doc);

    return NextResponse.json(
      { message: 'Season result saved successfully', data: doc },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ POST /results error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


/* ---------------- DELETE ---------------- */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const collection = await getCollection('results');

    if (!collection) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    await collection.deleteOne({
      _id: new (require('mongodb').ObjectId)(id),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /lestvica error', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}