'use client';

import React from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/tolmin-logo.png'
import PlayerCarousel from '../components/PlayerCarousel';

export default function Page() {
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
        <div className="flex items-center justify-center">
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
      <main className='w-full h-fit max-w-[95rem] bg-gray-50'>

        {/* Match Section */}
          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                Tekme <span className='font-semibold'>NK tolmin</span>
              </h1>
            </div>

            {/* Card Container */}
            <div className='w-full h-fit max-h-[800px] mt-4 flex gap-4 overflow-visible'>

              {Array.from({ length: 3 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className='flex-1 bg-gray-800 p-4 shadow-md flex flex-col md:min-h-[400px] gap-2 matches-card'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: .6, ease: "easeOut", delay: idx * 0.1 }}
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
          </section>

          {/* News Section */}
          <section className='flex flex-col min-h-[400px] p-2 px-5 gap-4 overflow-hidden border-b-3 border-gray-200 pb-12 '>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-2 uppercase">
                Tekme <span className='font-semibold'>nedavne novice</span>
              </h1>
            </div>
            
            <div className='grid [grid-template-columns:1.8fr_1.2fr] h-full gap-3'>
              {/* Main News */}
              <motion.div 
                className='relative p-5 h-full'
                initial={{  opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: .9, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src='/news.png'
                  alt="News Image"
                  fill
                  className='object-cover'
                />
                <div className='absolute w-full px-6 left-0 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50'>
                  <h1 className='text-4xl font-bold poppins max-w-[80%] leading-snug'>NOVICE SPREMLJAJTE NA NAŠI FB IN IG STRANI</h1>
                  <p className='text-right py-2'>May 22, 2025 </p>
                </div>
              </motion.div>

              {/* Additional News */}
              <div className='flex gap-3 flex-col'>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className='flex-1 min-h-[100px] max-h-[135px] border-t-4 border-gray-200 pt-3 flex gap-4 text-black hover:border-red-500 hover:text-red-600 transition-all duration-500'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1}}
                    transition={{ duration: 0.6, ease: "easeIn", delay: idx * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Image
                      src='/news.png'
                      alt='Thumb'
                      width={230}
                      height={800}
                      className='object-cover'
                    />
                    <div className='flex gap-1 flex-col'>
                      <p className='text-right text-xs text-gray-500'>May 22, 2025</p>
                      <h1 className='font-semibold text-lg'>TKK TOLMIN 0:4 TRIGLAV KRANJ</h1>
                    </div>
                  </motion.div>
                ))}

                <div className='border-t-4 border-gray-200 pt-3'>
                    <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#b91c1c" }}
                    whileTap={{ scale: 1 }}
                    className='w-full bg-red-700 text-white p-2 poppins uppercase cursor-pointer hover:bg-red-700'
                    >
                    See more
                    </motion.button>
                </div>

              </div>
            </div>
          </section>

          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                zgodovina
              </h1>
            </div>

            <div className='w-full h-fit max-h-[800px] mt-4 flex gap-6 overflow-visible'>
              
              <div className="flex-1 bg-white border-b-4 border-red-600 shadow-lg">
                <a>
                  <Image
                    width={400}
                    height={100}
                    src="/history1.png"
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                      1921 - 1971
                    </h5>
                  </a>
                  <p className="mb-3 text-3xl text-black poppins">
                    The History of Nk Tolmin
                  </p>
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        Read more
                        <svg
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </a>
                    </div>
                </div>
              </div>

              <div className="flex-1 bg-white border-b-4 border-red-600 shadow-lg">
                <a>
                  <Image
                    width={400}
                    height={100}
                    src="/history2.png"
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                      1971 – 1995
                    </h5>
                  </a>
                  <p className="mb-3 text-3xl text-black poppins">
                    The History of Nk Tolmin
                  </p>
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        Read more
                        <svg
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </a>
                    </div>
                </div>
              </div>
            </div>
          </section>


          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div className='mb-4'>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                Igralci
              </h1>
            </div>
            <PlayerCarousel />
          </section>
          
      </main>
    </div>
  );
}