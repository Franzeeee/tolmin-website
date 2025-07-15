'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';


export default function Page() {

 const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ["8 let", "10 let", "12 let", "S", "M", "L", "XL"];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 text-black poppins">
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

        <section className='w-full min-h-content lg:h-[900px] lg:flex lg:items-center lg:flex-col p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='border-b-2 border-gray-300 pb-3 w-full'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
                Trgovina
              </h1>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 lg:mt-5">
                {/* Left: Product Image */}
                <div className="flex-1 border p-4 flex items-center justify-center">
                    <Image
                        src={'/Merch/item1.png'}
                        alt={"Item Image"}
                        className='object-cover'
                        height={300}
                        width={300}
                    />
                </div>

                {/* Right: Product Info */}
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold">Dres NK TKK Tolmin</h1>
                    <p className="text-gray-500">Na zalogi</p>
                    <p className="text-2xl font-bold">3,00 €</p>
                    <p className="text-sm text-gray-500">Cena vključuje DDV (22%) 2,70 €</p>

                    <div>
                    <p className="mb-2">Izberite velikost:</p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`border px-3 py-1 rounded ${
                            selectedSize === size ? "bg-black text-white" : "bg-white"
                            }`}
                        >
                            {size}
                        </button>
                        ))}
                    </div>
                    </div>

                    <button className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
                    Dodajte v nakupovalno košarico
                    </button>

                    <p className="text-xs text-red-600">Navedite možnosti</p>

                    <div className="flex items-start gap-4 mt-4 flex-col">
                    <span className="text-sm">Delite ta izdelek s prijatelji</span>
                    <div className="flex gap-2">
                        <a href="#" aria-label="Instagram">
                        <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="Facebook">
                        <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="LinkedIn">
                        <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
                        </a>
                    </div>
                    </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
