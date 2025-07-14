import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import bcrypt from 'bcryptjs';

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

    // ✅ Success
    return NextResponse.json({ message: 'Login successful', userId: user._id })
  } catch (error) {
    console.error('❌ Error in login:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
