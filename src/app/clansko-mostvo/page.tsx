'use client'

import React from 'react'
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav'

export default function page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
        <MainNav />
          {/* Background video */}
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
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[900px]"/>
        <div className="flex items-center justify-center h-screen max-h-[900px] z-20 relative">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: .6 }}
            transition={{ duration: .6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-9xl z-20 font-bold text-white opacity-60 header-text select-none"
          >
            NK TOLMIN
          </motion.h1>
        </div>
      </header>
      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
        
        </section>
      </main>
    </div>
  )
}
