'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Tab1 from '@/components/Zgodovina/Tab1';
import Tab2 from '@/components/Zgodovina/Tab2';
import Tab3 from '@/components/Zgodovina/Tab3';
import Tab4 from '@/components/Zgodovina/Tab4';
import { useSearchParams } from "next/navigation";

const TABS = ["1921 – 1971", "1971 – 1995", "1995 – today", "Photo History"] as const;

const TAB_COMPONENTS = {
  "1921 – 1971": Tab1,
  "1971 – 1995": Tab2,
  "1995 – today": Tab3,
  "Photo History": Tab4, // You can replace with actual PhotoTab component
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("1921 – 1971");
  const [hoveredTab, setHoveredTab] = useState<typeof TABS[number] | null>(null);

  const currentTab = hoveredTab || activeTab;
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  const searchParams = useSearchParams();
  const data = searchParams.get("tab");

  useEffect(() => {
    if (data && TABS.includes(data as typeof TABS[number])) {
      setActiveTab(data as typeof TABS[number]);
    }
  }, [data]);
  
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <header className="w-screen max-h-[500px] h-screen grid grid-rows-[auto_1fr] bg-white landing-header md:max-h-[700px]  lg:max-h-[900px]">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[500px] md:max-h-[700px]  lg:max-h-[900px]"
        >
          <source src="/video/history.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10 max-h-[500px] md:max-h-[700px] lg:max-h-[900px]" />
        <div className="flex items-end pb-2 justify-center h-screen max-h-[500px] lg:max-h-[900px] md:max-h-[700px]  z-20 relative overflow-hidden">
            <motion.h1
            initial={{ x: typeof window !== "undefined" && window.innerWidth < 640 ? '200vw' : '100vw' }}
            animate={{ x: typeof window !== "undefined" && window.innerWidth < 640 ? '-120vw' : '-60vw' }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 16,
              ease: "linear"
            }}
            className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins"
            >
            Zgodovina
            </motion.h1>
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600">
        {/* TABS */}
        <section className="w-full max-h-[930px] px-4 py-6">
          <div className="relative w-full flex justify-between items-center">
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-base sm:text-lg font-semibold text-gray-800 select-none w-full relative">
              {TABS.map((tab) => (
                <li
                  key={tab}
                  className={`relative px-2 pb-2 cursor-pointer transition-colors duration-200 uppercase ${
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
                      className="absolute left-0 right-0 -bottom-1 h-[3px] bg-red-600 rounded z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 60 }}
                    />
                  )}
                </li>
              ))}
              <div className="absolute left-0 right-0 -bottom-1 z-0 h-[3px] bg-gray-300" />
            </ul>
          </div>
        </section>

        {/* TAB CONTENT */}
        <section className="w-full px-4 pb-12 flex items-center justify-center">
          <ActiveTabComponent />
        </section>
      </main>
    </div>
  );
}
