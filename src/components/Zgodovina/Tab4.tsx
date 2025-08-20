import React, { useEffect } from 'react'
import Image from 'next/image'
import Loading from '../Loading';

export default function Tab4() {

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  interface PhotoHistoryItem {
    id: number;
    year?: string;
    description?: string;
    imagePreviews?: string;
    // Add other fields as needed based on your API response
  }

  const [data, setData] = React.useState<PhotoHistoryItem[]>([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const fetchData = async () => {
      try {
        const response = await fetch('/api/photo-history');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">

    {loading && <Loading />}
    {error && <div className="text-red-500">{error}</div>}

    {!loading && data && data.length > 0 ? (
      data.map((item: PhotoHistoryItem, index: number) => (
        <React.Fragment key={index}>
          {/* Text: Content */}
          <div className="flex items-center justify-center w-full max-w-3xl p-4 py-0 flex-col poppins text-black max">
              <h1 className='font-bold text-xl mb-2 underline'>{item.year}</h1>
                <div
                className='text-lg text-gray-800 text-center'
                dangerouslySetInnerHTML={{ __html: item.description || '' }}
                />
          </div>

          {/* Image: Image */}
          <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px] flex items-center justify-center">
            <Image
              src={item.imagePreviews?.[0] || '/zgodovina/t1.png'}
              alt={item.year ? `Photo ${item.year}` : 'Photo'}
              className="object-contain object-center"
              fill
              sizes="(max-width: 1280px) 100vw, 650px"
              priority
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>
        </React.Fragment>
      ))
    ) : (
      !loading ? <div className="text-gray-500">No photos available</div> : null
    )}

    </div>

    </>)
}