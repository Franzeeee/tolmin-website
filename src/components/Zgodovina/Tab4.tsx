import React from 'react'
import Image from 'next/image'
import { useFetchPhotoHistory } from '@/app/hooks/useFetchPhotoHistory';

interface PhotoHistoryItem {
    year: string;
    description: string;
    imagePreviews: string[];
    images: string[];
    sequence: number;
    _id: string;
}

export default function Tab4() {


    const { photoHistory, isLoading, isError } = useFetchPhotoHistory();

    console.log('Photo History Data:', photoHistory);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center text-black">
            <i className="fas fa-futbol fa-spin fa-2x mb-2" aria-label="Loading" />
            Loading...
        </div>
    );
    if (isError) return <div>Error loading photo history.</div>;

    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">
        
        { photoHistory.length === 0 ? (
            <div className='text-black'>No photo history available.</div>
        ) : (
            <>
            { photoHistory.map((item: PhotoHistoryItem) => {
                return (
                    <React.Fragment key={item._id}>
                        {/* Text: Content */}
                        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
                            <h2 className="text-3xl font-bold mb-4">{item.year}</h2>
                            <div
                                className='text-lg text-gray-800 mb-4 text-justify'
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        </div>

                        {/* Image: Content */}
                        <div className="flex items-center justify-start w-full gap-4 flex-wrap -mt-10">
                            {item.imagePreviews.map((image, index) => (
                                <div
                                    key={image + index}
                                    className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                                >
                                    <Image
                                        src={image}
                                        alt={`Photo from ${item.year}`}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        width={300}
                                        height={200}
                                        className="w-full h-auto object-cover rounded-lg shadow-md min-h-[150px] min-w-[80px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </React.Fragment>
                );
            })}
            </>
        )}

    </div>

    </>)
}