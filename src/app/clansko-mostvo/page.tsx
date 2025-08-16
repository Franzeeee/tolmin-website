'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Epika");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const [tabs] = useState<{ name: string; link: string }[]>([
    { name: "Epika", link: "/clansko-mostvo" },
    { name: "Tekme", link: "/clansko-mostvo/tekme" },
    { name: "Lestvica", link: "/clansko-mostvo/lestvica" }
  ]);

  useEffect(() => {
    const foundTab = tabs.find((tab) => tab.link === pathname);
    if (foundTab) {
      setActiveTab(foundTab.name);
    }
  }, [pathname, tabs]);

  // Determine which tab to show the underline under
  const currentTab = hoveredTab || activeTab;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
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
            Člansko moštvo - ekipa
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible'>
            <div className='relative w-full p-3 flex flex-row items-center justify-between'>
            <ul className=' flex flex-row gap-6 text-lg font-semibold text-gray-800 select-none'>
              {tabs.map((tab) => (
              <li
                key={tab.name}
                className={`relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 ${
                currentTab === tab.name ? 'text-red-600' : 'hover:text-red-600'
                }`}
                onClick={() => setActiveTab(tab.name)}
                onMouseEnter={() => setHoveredTab(tab.name)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Link href={activeTab === tab.name ? '#' : tab.link} className=''>
                {tab.name}
                </Link>
                {currentTab === tab.name && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 -bottom-1 h-[3px] bg-red-600 rounded"
                  transition={{ type: "spring", stiffness: 500, damping: 60 }}
                />
                )}
              </li>
              ))}
              <div className="absolute left-0 right-0 bottom-2 h-[3px] w-100% bg-gray-300">
              </div>
            </ul>
              <Dropdown items={[
              "2020-2021",
              "2019-2020",
              "2018-2019",
              "2017-2018",
              "2016-2017",
              "2015-2016",
              "2014-2015"
              ]} 
              onSelect={() => {}}
              />
            </div>
        </section>

        {/* GoalKeeper Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Goalkeeper
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Defenders Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Defenders
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Midfields Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Midfields
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Forwards Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Forwards
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Coach Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Coach
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Staff Section */}
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
        {/* Header Title */}
          <div className='border-b-2 border-gray-300 mb-4 pb-2'>
            <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
              Staff
            </h1>
          </div>
        {/* Player Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className='relative p-5 h-[430px] w-full'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true, amount: .3 }}
                >
                  <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                    01
                  </h1>
                  <Image
                    src='/player1.png'
                    alt="News Image"
                    fill
                    className='object-cover'
                  />
                  <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                    <p className='-mb-2 uppercase'>Altin</p>
                    <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
                  </div>
                </motion.div>
            ))}
          </div>
        </section>


      </main>
    </div>
  );
}


