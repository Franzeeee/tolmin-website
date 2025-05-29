'use client';

import React from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/tolmin-logo.png'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
        <MainNav />
        <div className="flex items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: .6 }}
            transition={{ duration: .8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-9xl font-bold text-gray-100 opacity-60 header-text select-none"
          >
            NK TOLMIN
          </motion.h1>
        </div>
      </header>
      <main className='w-full h-fit max-w-[95rem]'>
          <div className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden'>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-bold text-left text-black mt-8 uppercase">
                Tekme <span className='font-normal'>NK tolmin</span>
              </h1>
            </div>

            {/* Card Container */}
            <div className='w-full h-fit max-h-[800px] mt-8 flex gap-4 overflow-visible'>

              {Array.from({ length: 3 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className='flex-1 bg-gray-800 p-4 shadow-md flex flex-col md:min-h-[400px] gap-2 matches-card'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: .6, ease: "easeOut", delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Title text */}
                  <div className='flex items-center flex-col justify-center p-2 font-semibold text-white uppercase'>
                    <h1 className='text-3xl font-poppins'>PreJSJA</h1>
                    <h2>SNL</h2>
                  </div>

                  {/* Logo and VS or Score */}
                  <div className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                    <Image
                      src={logo}
                      alt="Team Logo"
                      width={110}
                      height={110}
                      className='w-36 h-36 object-contain'
                    />
                    <div className='min-w-[50px] flex items-center justify-center text-4xl font-bebas'>
                      <p>VS</p>
                    </div>
                    <Image
                      src={logo}
                      alt="Team Logo"
                      width={110}
                      height={110}
                      className='w-36 h-36 object-contain'
                    />
                  </div>

                  {/* Date and Location */}
                  <div className='flex items-center flex-col justify-center p-2 font-semibold text-white'>
                    <p className='font-semibold'>Monday, May 19, 12:00</p>
                    <p className='text-sm font-thin'>Športni park Brajda</p>
                  </div>

                  <div className='min-h-16'>

                  </div>
                </motion.div>
              ))}

            </div>
          </div>
      </main>
    </div>
  );
}