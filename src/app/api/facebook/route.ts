import { NextResponse } from 'next/server';
import { fetchFacebookNews } from '@/lib/facebook';

export async function GET() {
  const posts = await fetchFacebookNews();
  return NextResponse.json(posts);
}
