'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import MainNav from '@/components/layout/MainNav';
import Tab1 from '@/components/Zgodovina/Tab1';
import Tab2 from '@/components/Zgodovina/Tab2';
import Tab3 from '@/components/Zgodovina/Tab3';


export default function Page() {
  const [activeTab, setActiveTab] = useState("1921 – 1971");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [tabs] = useState(["1921 – 1971", "1971 – 1995", "1995 – today", "Photo history"]);
  const [tabContent] = useState([Tab1, Tab2, Tab3, Tab3]);


  const currentTab = hoveredTab || activeTab;

  // Handle scroll to toggle the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            Člansko moštvo - tekme
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible'>
          <div className='relative w-full p-3 flex flex-row items-center justify-between'>
            <ul className='flex flex-row gap-6 text-lg font-semibold text-gray-800 select-none justify-center items-center w-full'>
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  className={`relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 uppercase ${
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
              <div className="absolute left-0 right-0 bottom-2 h-[3px] bg-gray-300" />
            </ul>
          </div>
        </section>

        <section className='w-full min-h-content p-2 px-5 pb-9 flex items-center justify-center'>
          {React.createElement(tabContent[tabs.findIndex(tab => tab === activeTab)])}
        </section>
      </main>

      {/* Scroll to top floating button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 50 }}
        animate={showScrollTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5 cursor-pointer" />
      </motion.button>
    </div>
  );
}
