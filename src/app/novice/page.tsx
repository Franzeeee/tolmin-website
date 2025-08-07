'use client'

import React from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';
// import Loading from '@/components/Loading';

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
            NK Tolmin Novice
          </motion.h1>
        </div>
      </header>

      <main className="w-full h-fit max-w-[70rem] bg-gray-50 border-t-4 border-red-600 mx-auto">
        {/* Featured Article */}
        <section className="w-full px-5 py-6 border-b border-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="w-full aspect-[16/9] relative">
                    <Image
                        src="/news.png"
                        alt="Featured"
                        fill
                        className="object-cover rounded-md"
                        style={{ borderRadius: '0.375rem' }}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <div className="flex flex-col justify-start items-start">
                    <span className="text-sm text-red-500 font-medium mb-1">Netflix • 12 minutes ago</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Where To Watch &apos;John Wick: Chapter 4&apos; (2023) Online Free: Is John Wick 4 Streaming on Netflix, HBO Max, Hulu, or Amazon Prime?
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Here&apos;s how to stream the action-packed John Wick Chapter 4 on your favorite platform.
                    </p>
                    <a href="#" className="text-sm text-red-600 mt-3 hover:underline">Read More</a>
                </div>
            </div>
        </section>

    {/* Latest News Grid */}
    <section className="w-full px-5 pt-6 pb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-5">Latest News</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden border border-gray-200">
            <Image
                src={`/news.png`}
                alt={`News ${i + 1}`}
                className="w-full h-40 object-cover"
                width={400}
                height={300}
            />
            <div className="p-3">
                <span className="text-xs text-gray-500 block mb-1">Category • Aug 8, 2025</span>
                <h4 className="text-md font-semibold text-gray-700 leading-snug mb-1">
                News headline sample title number {i + 1}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                Short description or excerpt for the news article goes here to give readers an idea.
                </p>
            </div>
            </div>
        ))}
        </div>
    </section>

    {/* Pagination */}
    <div className="flex justify-center pb-10">
        <nav className="inline-flex items-center space-x-1 text-sm">
        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">&laquo;</button>
        <button className="px-3 py-1 border border-gray-300 rounded bg-red-600 text-white">1</button>
        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">2</button>
        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">3</button>
        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">&raquo;</button>
        </nav>
    </div>
    </main>

    </div>
  );
}
