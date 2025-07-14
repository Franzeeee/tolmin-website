import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // parse request body
    const body = await request.json()
    const { email, password } = body
    const hashedPassword = await bcrypt.hash(password, 10)

    // connect to collection
    const usersCollection = await getCollection('users')
    if (!usersCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    // check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // insert new user
    const newUser = await usersCollection.insertOne({
      email,
      password: hashedPassword
    })

    return NextResponse.json({ message: 'User created!', userId: newUser.insertedId }, {status: 201})
  } catch (error) {
    console.error('❌ Error in POST /api/users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
