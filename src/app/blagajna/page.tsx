'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';


export default function Page() {
 
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 text-black poppins">
      {/* === Header with Video Background === */}
      {/* <header className="w-screen h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px] relative overflow-hidden">
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
        <div className="flex items-end pb-2 justify-center h-full z-20 relative">
          <motion.h1
            initial={{ x: '110vw' }}
            animate={{ x: '-120vw' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 16,
              ease: 'linear',
            }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase"
          >
            Sponzorji in donatorji
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
            Blagajna
            </motion.h1>
        </div>
      </header>

      {/* === Main Section === */}
      <main className="w-full h-fit max-w-[60rem] bg-gray-50 border-t-4 border-red-600">
        <section className="w-full min-h-content flex flex-col lg:items-center p-4 sm:px-6 lg:px-12 pb-9">
 
        </section>
      </main>
    </div>
  );
}
