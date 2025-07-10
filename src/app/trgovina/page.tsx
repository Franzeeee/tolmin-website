'use client'

import React, {  } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';

export default function Page() {

    const items = [
        { id: 1, title: "Dres NK TKK Tolmin", price: "5,00 €", image: "/Merch/item1.png" },
        { id: 2, title: "Dres NK TKK Tolmin", price: "5,00 €", image: "/Merch/item1.png" },
        { id: 3, title: "Dres NK TKK Tolmin", price: "3,00 €", image: "/Merch/item1.png" },
        { id: 4, title: "Dres NK TKK Tolmin", price: "15,00 €", image: "/Merch/item1.png" },
        { id: 5, title: "Dres NK TKK Tolmin", price: "40,00 €", image: "/Merch/item1.png" },
        { id: 6, title: "Dres NK TKK Tolmin", price: "40,00 €", image: "/Merch/item1.png" },
    ];

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
                Trgovina
              </h1>
            </div>

             <div className="w-full py-8 px-4 flex flex-wrap justify-center gap-6 md:gap-8 text-black">
                {items.map((item) => (
                    <div
                    key={item.id}
                    className="flex flex-col items-center bg-white shadow hover:shadow-lg rounded p-4 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[320px]"
                    >
                    <Image
                        src={item.image}
                        alt={item.title}
                        className='object-cover'
                        height={250}
                        width={250}
                    />
                    <h3 className="text-center text-sm md:text-base">{item.title}</h3>
                    <p className="text-center font-semibold mt-1">{item.price}</p>
                    <button className="mt-2 cursor-pointer bg-black text-white text-xs w-full md:text-sm px-4 py-2 rounded hover:bg-red-700">
                        BUY NOW
                    </button>
                    </div>
                ))}
            </div>
        </section>

      </main>
    </div>
  );
}
