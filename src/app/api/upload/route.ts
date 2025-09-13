import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'sponsors' }, (error, result) => {
        if (error) return reject(error);
        resolve(result as Record<string, unknown>);
      }).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: unknown) {
    console.error('Upload error:', error);

    // Safely extract the error message
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'object' && error && 'message' in error) {
      message = String((error as { message: unknown }).message);
    } else if (typeof error === 'string') {
      message = error;
    }

    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
