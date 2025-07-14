import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const usersCollection = await getCollection('users')
    if (!usersCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    // Find user by email
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // ✅ Issue JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },  // payload
      process.env.JWT_SECRET as string,         // secret key from env
      { expiresIn: '7d' }                       // token expiry
    )

    // Set httpOnly cookie
    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('❌ Error in login:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
