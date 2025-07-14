import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const decoded = verifyAuthToken(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // ✅ User is authenticated
  return NextResponse.json({ message: 'Protected data', user: decoded })
}
