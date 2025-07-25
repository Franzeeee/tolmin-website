import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function GET() {
  try {
    const productsCollection = await getCollection('products')
    if (!productsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const products = await productsCollection.find().toArray()
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error('❌ Error in GET /api/products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, img, price } = body

    const productsCollection = await getCollection('products')
    if (!productsCollection) {
      return NextResponse.json({ error: 'Failed to connect to DB' }, { status: 500 })
    }

    const newProduct = await productsCollection.insertOne({
        name,
        img: img,
        price: price,
        createdAt: new Date(),
    })

    return NextResponse.json({ message: 'Product created!', productId: newProduct.insertedId }, { status: 201 })
  } catch (error) {
    console.error('❌ Error in POST /api/products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
