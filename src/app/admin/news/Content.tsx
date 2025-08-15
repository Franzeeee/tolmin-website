'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
import Loading from '@/components/Loading'

interface News {
  id: number
  _id: string
  title: string
  description: string
  content: string
  image: string
}

export default function ShopPage() {
    const [news, setNews] = useState<News[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/news')
            setNews(
              response.data.map((item: News & { _id?: number }) => ({
                id: item.id ?? item._id,
                _id: item._id,
                title: item.title,
                description: item.description,
                content: item.content,
                image: item.image,
              }))
            )
        } catch (error) {
            console.error('Error fetching news:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        })

        if (confirmed.isConfirmed) {
            try {
                await axios.delete(`/api/news/${id}`)
                setNews(news.filter(item => item._id !== id))
                Swal.fire('Deleted!', 'Your news article has been deleted.', 'success')
            } catch (error) {
                console.error('Error deleting news:', error)
                Swal.fire('Error!', 'There was an error deleting the news article.', 'error')
            }
        }
    }

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to News Page! 👋</h1>
        <p className="text-gray-600 mt-1">
          This is the admin section where you can manage your club&#39;s news articles.
        </p>
      </div>
      {/* Products Grid */}
      <div className="flex items-center justify-between lg:mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">Novice</h2>
        <a
          href="/admin/news/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
        >
          Add News
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        { news.length > 0 ? (
          news.map(item => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-100 hover:shadow-xl"
            >
                <div className="relative w-full h-40 mb-4">
                  <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain rounded-lg shado"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  priority
                  />
                </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1 text-center">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4 text-center">{item.description || <span className="italic">No description available</span>}</p>
              <a
                href={`/admin/news/edit/${item.id}`}
                className="mt-auto bg-red-600 text-center text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition w-full cursor-pointer"
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-2 bg-gray-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-700 transition w-full cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
            <div className="col-span-3 text-center text-gray-500">
                {isLoading ? <Loading /> : 'No products available.'}
            </div>
        )}
      </div>

    </div>
  )
}
