import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Loading from '../Loading'

interface PhotoHistoryItem {
  id: number
  year?: string
  description?: string
  imagePreviews?: string | string[]
}

export default function Tab4() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<PhotoHistoryItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/photo-history')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="w-full p-4 flex flex-col gap-12 items-center max-w-5xl mx-auto">
      {loading && <Loading />}

      {error && <div className="text-red-500">{error}</div>}

      {!loading && data.length > 0 ? (
        data.map((item, index) => {
          // Normalize images
          const images: string[] = Array.isArray(item.imagePreviews)
            ? item.imagePreviews
            : item.imagePreviews
            ? [item.imagePreviews]
            : []

          return (
            <div
              key={item.id ?? index}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* TEXT */}
              <div className="max-w-3xl text-center poppins text-black">
                {item.year && (
                  <h1 className="font-bold text-xl mb-2 underline">
                    {item.year}
                  </h1>
                )}

                {item.description && (
                  <div
                    className="text-lg text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  />
                )}
              </div>

              {/* ONE IMAGE PER ROW */}
              {images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className="relative w-full h-[250px] md:h-[400px] xl:h-[600px] max-w-4xl bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${item.year ?? 'Photo'} ${imgIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority={index === 0 && imgIndex === 0}
                  />
                </div>
              ))}
            </div>
          )
        })
      ) : (
        !loading && <div className="text-gray-500">No photos available</div>
      )}
    </div>
  )
}
