'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import axios from 'axios';
import Image from 'next/image';
import Loading from '@/components/Loading';

type PageProps = {
    name: string;
    content: string;
    img: string;
};

export default function Page() {

    const id = '6884cbeef71ec698fd833ebb';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<PageProps | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/football-school/${id}`);
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
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* <header className="w-screen h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[900px]"
        >
          <source src="/tolmin-header.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[900px]" />
        <div className="flex items-end pb-2 justify-center h-screen max-h-[900px] z-20 relative overflow-hidden">
          <motion.h1
            initial={{ x: '110vw' }}
            animate={{ x: '-120vw' }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 16,
              ease: "linear"
            }}
            className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins"
          >
            Nogometna šola Hidria Tolmin
          </motion.h1>
        </div>
      </header> */}

      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-60 pointer-events-none" />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
            <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg"
            >
            Nogometna šola - Nogometni Kamp 1. - 7. razred
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[70rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 lg:pb-5 pb-2 overflow-visible'>
            <div className='relative w-full p-3 pl-0 pt-5 flex flex-row items-center justify-between border-b-2 border-gray-300'>
                <h1 className='text-3xl font-bold text-red-600'>Nogometni Kamp - 1. - 7. razred</h1>      
            </div>
        </section>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
            { loading ? (
                <Loading />
            ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg text-red-600">{error}</p>
                </div>
            ) : (
                <div className="flex flex-col items-start">
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
                                className="text-gray-700"
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
                        </>
                    )}
                </div>
            )}
        </section>
      </main>
    </div>
  );
}
