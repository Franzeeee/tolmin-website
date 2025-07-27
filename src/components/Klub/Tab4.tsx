'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Loading from '@/components/Loading';

type PageProps = {
    name: string;
    content: string;
    img: string;
};

export default function Tab2() {

    const id = '6885bbf68718432e43975734';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<PageProps | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/klub/${id}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

  return (
    <div className="flex flex-col items-center justify-start h-fit pb-9 bg-gray-50 w-full max-w-4xl">
            { loading ? (
                <Loading />
            ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg text-red-600">{error}</p>
                </div>
            ) : (
                <div className="flex flex-col items-start w-full">
                    {data && (
                        <>
                            {data.img && (
                                <div className="w-full flex items-center justify-center max-w-lg mt-4 m-auto">
                                    <Image
                                        src={data.img}
                                        alt={data.name}
                                        width={600}
                                        height={400}
                                        className="rounded-lg shadow-lg w-full h-auto object-cover m-auto lg:mb-10 mb-5"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        priority
                                    />
                                </div>
                            )}
                            <div
                                className="text-gray-700 w-full flex-row items-start"
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
                        </>
                    )}
                </div>
            )}
    </div>
  );
}
