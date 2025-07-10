'use client'

import React, {  } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';

export default function Page() {

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-screen h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
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
            Sponzorji in donatorji
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='border-b-2 border-gray-300 pb-3'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
                Glavni in zlati sponzorji
              </h1>
            </div>

            <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
                    {[
                    '/sponsor/hidria-logo-300x108-1.png',
                    '/sponsor/coronini.png',
                    '/sponsor/Zidgrad.png',
                    '/sponsor/herz-500x185.png',
                    '/sponsor/hidria-logo-300x108-1.png',
                    ].map((src, idx) => (
                    <div 
                        key={idx}
                        className='p-2 border-2 rounded-md border-gray-200 shadow h-40 w-56 flex items-center justify-center'
                    >
                        <Image

                            src={src}
                            alt={`Main sponsor ${idx + 1}`}
                            width={160}
                            height={160}
                            className="object-contain"
                        />
                    </div>
                    ))}
            </div>

        </section>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='border-b-2 border-gray-300 pb-3'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
                Srebrni sponzorji in donatorji
              </h1>
            </div>

            <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
                    {[
                    '/sponsor/hidria-logo-300x108-1.png',
                    '/sponsor/coronini.png',
                    '/sponsor/Zidgrad.png',
                    '/sponsor/herz-500x185.png',
                    '/sponsor/hidria-logo-300x108-1.png',
                    ].map((src, idx) => (
                    <div 
                        key={idx}
                        className='p-2 border-2  rounded-md shadow h-36 w-50 flex items-center justify-center'
                    >
                        <Image

                            src={src}
                            alt={`Main sponsor ${idx + 1}`}
                            width={140}
                            height={140}
                            className="object-contain"
                        />
                    </div>
                    ))}
            </div>

        </section>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='border-b-2 border-gray-300 pb-3'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
                Bronasti sponzorji in donatorji
              </h1>
            </div>

            <div className="w-full py-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
                    {[
                    '/sponsor/hidria-logo-300x108-1.png',
                    '/sponsor/coronini.png',
                    '/sponsor/Zidgrad.png',
                    '/sponsor/herz-500x185.png',
                    '/sponsor/hidria-logo-300x108-1.png',
                    ].map((src, idx) => (
                    <div 
                        key={idx}
                        className='p-2 border-2  rounded-md shadow h-36 w-50 flex items-center justify-center'
                    >
                        <Image

                            src={src}
                            alt={`Main sponsor ${idx + 1}`}
                            width={140}
                            height={140}
                            className="object-contain"
                        />
                    </div>
                    ))}
            </div>

        </section>


        <section className='w-full min-h-content p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='border-b-2 border-gray-300 pb-3'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
                Prijatelji kluba
              </h1>
            </div>
                
           <div className="w-full py-4 flex flex-wrap justify-around poppins text-lg items-start gap-10 md:gap-12 px-4 text-black">
                {/* First column */}
                <div className="flex flex-col gap-2 max-w-xs">
                    <span>E-Zavarovanja d.o.o.</span>
                    <span>GR Grafika d.o.o.</span>
                    <span>Zavarovalnica Triglav d.d.</span>
                    <span>Atum d.o.o.</span>
                    <span>Murovec Transport d.o.o.</span>
                    <span>Emok d.o.o.</span>
                    <span>Explora d.o.o.</span>
                    <span>Geotmina d.o.o.</span>
                    <span>El-Krm d.o.o.</span>
                    <span>T-Net d.o.o.</span>
                    <span>Nazrob d.o.o.</span>
                    <span>Tadej Mavri s.p.</span>
                    <span>Luamed INT d.o.o.</span>
                    <span>C4, Žejko Kobal s.p.</span>
                    <span>IP Posočje</span>
                    <span>Varspoj d.o.o.</span>
                    <span>Iskra ISD Strugarstvo d.o.o.</span>
                    <span>ROR Karlo Močnik s.p.</span>
                    <span>Parametal d.o.o.</span>
                    <span>Rotasklop d.o.o.</span>
                    <span>Grafika Art d.o.o.</span>
                    <span>Kovinoplastika Carli d.o.o.</span>
                    <span>Kovinski izdelki Hrast d.o.o.</span>
                </div>

                {/* Second column */}
                <div className="flex flex-col gap-2 max-w-xs">
                    <span>Gozdarstvo Tadej Šturm s.p.</span>
                    <span>Eltona d.o.o.</span>
                    <span>Kukč d.o.o.</span>
                    <span>Apia d.o.o.</span>
                    <span>Soča Rafting d.o.o.</span>
                    <span>Kovinoplastika Bremec d.o.o.</span>
                    <span>Elektrodom Tolmin d.o.o.</span>
                    <span>Ingrax d.o.o.</span>
                    <span>Gining d.o.o.</span>
                    <span>Ginex d.o.o.</span>
                    <span>TERA d.o.o.</span>
                    <span>Elpromont, Danijel Tomažinčič s.p.</span>
                    <span>Numm Mojmir Skočir s.p.</span>
                    <span>Adis Hrovat s.p.</span>
                    <span>Grafika Soča d.o.o.</span>
                    <span>Ismailj Ajvazi s.p.</span>
                    <span>Rinor Darko A Berginc s.p.</span>
                    <span>Športno društvo Šentviška Gora</span>
                    <span>Rona Kranj d.o.o.</span>
                    <span>Knaap d.o.o.</span>
                    <span>Zdenko Vončina s.p.</span>
                    <span>Sleme Ozebek d.o.o.</span>
                    <span>Ekosal d.o.o.</span>
                </div>
                </div>


        </section>

      </main>
    </div>
  );
}
