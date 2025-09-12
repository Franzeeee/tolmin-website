'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MainNav from '@/components/layout/MainNav'
import Image from 'next/image'
import axios from 'axios'

type Sponsor = {
  _id: string;
  name: string;
  logoUrl?: string;
  category: 'main' | 'partner' | 'support' | 'bronze';
};

export default function Page() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get('/api/sponsors');
        setSponsors(res.data);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
      }
    };
    fetchSponsors();
  }, []);

  const mainSponsors = sponsors.filter(s => s.category === 'main');
  const partnerSponsors = sponsors.filter(s => s.category === 'partner');
  const supportSponsors = sponsors.filter(s => s.category === 'support');
  const bronzeSponsors = sponsors.filter(s => s.category === 'bronze');

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="w-screen h-screen max-h-[500px] lg:max-h-[900px] grid grid-rows-[auto_1fr] bg-white landing-header">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[500px] lg:max-h-[900px]"
        >
          {/* <source src="/tolmin-header.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[500px] lg:max-h-[900px]" />
        <div className="flex items-end pb-2 justify-center h-screen max-h-[500px] lg:max-h-[900px] z-20 relative overflow-hidden">
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
            Sponzorji in donatorji
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>

        {/* MAIN SPONSORS */}
        <section className='w-full min-h-content p-2 px-5 pb-9'>
          <div className='border-b-2 border-gray-300 pb-3'>
            <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
              Glavni in zlati sponzorji
            </h1>
          </div>
          <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
            {mainSponsors.length === 0 ? (
              <p className="text-gray-500"></p>
            ) : mainSponsors.map(s => (
              <div
                key={s._id}
                className='p-2 border-2 rounded-md border-gray-200 shadow h-40 w-56 flex items-center justify-center'
              >
                <Image
                  src={s.logoUrl || ''}
                  alt={s.name}
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* PARTNER SPONSORS */}
        <section className='w-full min-h-content p-2 px-5 pb-9'>
          <div className='border-b-2 border-gray-300 pb-3'>
            <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
              Srebrni sponzorji in donatorji
            </h1>
          </div>
          <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
            {partnerSponsors.length === 0 ? (
              <p className="text-gray-500"></p>
            ) : partnerSponsors.map(s => (
              <div
                key={s._id}
                className='p-2 border-2 rounded-md shadow h-36 w-50 flex items-center justify-center'
              >
                <Image
                  src={s.logoUrl || ''}
                  alt={s.name}
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* SILVER SPONSORS */}
        <section className='w-full min-h-content p-2 px-5 pb-9'>
          <div className='border-b-2 border-gray-300 pb-3'>
            <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
              Bronasti sponzorji in donatorji
            </h1>
          </div>
          <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
            {bronzeSponsors.length === 0 ? (
              <p className="text-gray-500"></p>
            ) : bronzeSponsors.map(s => (
              <div
                key={s._id}
                className='p-2 border-2 rounded-md shadow h-36 w-50 flex items-center justify-center'
              >
                <Image
                  src={s.logoUrl || ''}
                  alt={s.name}
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORT SPONSORS - only text names */}
        <section className='w-full min-h-content p-2 px-5 pb-9'>
          <div className='border-b-2 border-gray-300 pb-3'>
            <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
              Prijatelji kluba
            </h1>
          </div>
          <div className="w-full py-4 flex flex-wrap justify-around poppins text-lg items-start gap-10 md:gap-12 px-4 text-black">
            {supportSponsors.length === 0 ? (
              <p className="text-gray-500"></p>
            ) : (
              <>
                {/* Split into two columns for balance */}
                <div className="flex flex-col gap-2 max-w-xs">
                  {supportSponsors
                    .filter((_, idx) => idx % 2 === 0)
                    .map(s => (
                      <span key={s._id}>{s.name}</span>
                    ))}
                </div>
                <div className="flex flex-col gap-2 max-w-xs">
                  {supportSponsors
                    .filter((_, idx) => idx % 2 !== 0)
                    .map(s => (
                      <span key={s._id}>{s.name}</span>
                    ))}
                </div>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
