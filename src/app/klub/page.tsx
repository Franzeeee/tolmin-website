'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import MainNav from '@/components/layout/MainNav';
import Tab1 from '@/components/Klub/Tab1';
import Tab2 from '@/components/Klub/Tab2';
import Tab3 from '@/components/Klub/Tab3';
import Tab4 from '@/components/Klub/Tab4';

export default function Page() {
  const [activeTab, setActiveTab] = useState("Osnovni podatki");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const tabs = ["Osnovni podatki", "Članstvo", "Pravilniki", "Brajda"] as const;
  const tabContent = [Tab1, Tab2, Tab3, Tab4];

  type TabKey = typeof tabs[number];
  const tabLabels: Record<TabKey, string> = {
    "Osnovni podatki": "Osnovni podatki",
    "Članstvo": "Članstvo",
    "Pravilniki": "Pravilniki",
    "Brajda": "Brajda"
  };

  const currentTab: TabKey = (hoveredTab || activeTab) as TabKey;
  const Active = tabContent[tabs.findIndex(t => t === activeTab)];

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg"
          >
            Klub - {tabLabels[currentTab as TabKey]}
          </motion.h1>
        </div>
      </header>

      <main className="w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600">
        <section className="w-full min-h-content max-h-[930px] p-2 px-5 overflow-visible">
          <div className="relative w-full p-3 flex flex-row items-center justify-between">
            {/* Mobile dropdown */}
            <details className="w-full sm:hidden">
              <summary className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer">
                <span className="font-semibold text-gray-800">{currentTab}</span>
                <span className="ml-2 text-gray-500 select-none">▾</span>
              </summary>
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab);
                      // close the <details> after selection
                      const parent = (e.currentTarget.closest('details') as HTMLDetailsElement | null);
                      if (parent) parent.open = false;
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm ${
                      currentTab === tab
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </details>

            {/* Desktop / Tablet tabs */}
            <ul className="hidden w-full sm:flex relative gap-4 sm:gap-6 text-base sm:text-lg font-semibold text-gray-800 select-none overflow-x-auto whitespace-nowrap py-1 -mx-3 sm:mx-0 px-3 sm:px-0 sm:justify-start lg:justify-center">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`flex-shrink-0 relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 uppercase ${
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
              <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gray-300 pointer-events-none" />
            </ul>
          </div>
        </section>

        <section className="w-full min-h-content p-2 px-5 pb-9 flex items-center justify-center">
          {Active ? <Active /> : null}
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
