'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import U7 from '@/components/Nogometna-Sola/U7';
import U9 from '@/components/Nogometna-Sola/U9';
import U11 from '@/components/Nogometna-Sola/U11';
import U13 from '@/components/Nogometna-Sola/U13';
import U15 from '@/components/Nogometna-Sola/U15';
import U17 from '@/components/Nogometna-Sola/U17';
import U19 from '@/components/Nogometna-Sola/U19';

export default function Page() {
  const [activeTab, setActiveTab] = useState("U7");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = ["U7", "U9", "U11", "U13", "U15", "U17", "U19"];
  const tabContent = [U7, U9, U11, U13, U15, U17, U19]; // Store component references

  // Determine which tab to show the underline under
  const currentTab = hoveredTab || activeTab;

  // Find the component for the active tab
  const activeIndex = tabs.findIndex(tab => tab === activeTab);
  const ActiveComponent = tabContent[activeIndex];

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
            Mladinske-ekipe
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible'>
          <div className='relative w-full p-3 flex flex-row items-center justify-between'>
            <ul className=' flex flex-row gap-6 text-lg font-semibold text-gray-800 select-none justify-center items-center w-full'>
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  className={`relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 ${
                    currentTab === tab ? 'text-red-600' : 'hover:text-red-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  onMouseEnter={() => setHoveredTab(tab)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  {tab}
                  {currentTab === tab && (
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
          </div>
        </section>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
          {ActiveComponent ? <ActiveComponent /> : null}
        </section>
      </main>
    </div>
  );
}
