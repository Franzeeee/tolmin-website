'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import MainNav from '@/components/layout/MainNav';
import Tab1 from '@/components/Klub/Tab1';
import Tab2 from '@/components/Klub/Tab2';
import Tab3 from '@/components/Klub/Tab3';
import Tab4 from '@/components/Klub/Tab4';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const TABS = ["Osnovni podatki", "Članstvo", "Pravilniki", "Brajda"] as const;
type TabKey = typeof TABS[number];

const TAB_COMPONENTS: Record<TabKey, React.ComponentType> = {
  "Osnovni podatki": Tab1,
  "Članstvo": Tab2,
  "Pravilniki": Tab3,
  "Brajda": Tab4,
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("Osnovni podatki");
  const [hoveredTab, setHoveredTab] = useState<TabKey | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizeTitle = (s: string) =>
    s
      .replace(/\s*[-–]\s*/g, " – ") // normalize any dash into en dash w/ spaces
      .replace(/\s+/g, " ")
      .trim();

  // Read ?tab= from URL on load / change
  useEffect(() => {
    const fromUrl = searchParams.get('tab');
    if (!fromUrl) return;

    const normalized = normalizeTitle(fromUrl);
    const match = (TABS as readonly string[]).find(t => normalizeTitle(t) === normalized);
    if (match) setActiveTab(match as TabKey);
  }, [searchParams]);

  // Helper: set tab + update URL (?tab=)
  const setTabAndUrl = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab); // URLSearchParams handles encoding (en dash etc.)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentTab = hoveredTab || activeTab;
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

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
            Klub – {currentTab}
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
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={(e) => {
                      e.preventDefault();
                      setTabAndUrl(tab);
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
              {TABS.map((tab) => (
                <li
                  key={tab}
                  className={`flex-shrink-0 relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 uppercase ${
                    currentTab === tab ? 'text-red-600' : 'hover:text-red-600'
                  }`}
                  onClick={() => setTabAndUrl(tab)}
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
          <ActiveTabComponent />
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
