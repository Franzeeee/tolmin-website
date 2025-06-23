'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
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
            initial={{ x: '100vw' }}
            animate={{ x: '-120vw' }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 16,
              ease: "linear"
            }}
            className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins"
          >
            Člansko moštvo - Lestvica
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
              <Dropdown items={["1", "2"]} />
          </div>
        </section>

        <section className="w-full min-h-content p-2 px-5 overflow-hidden pb-20 poppins">
            <div className="w-full overflow-auto">
                <table className="w-full text-left border-collapse font-medium text-sm md:text-base border-t-8 border-red-600">
                <thead>
                    <tr className="bg-gray-900 text-white">
                    <th colSpan={6} className="text-left px-4 py-3 text-sm md:text-base">
                        2. SNL 2024/2025
                    </th>
                    </tr>
                    <tr className="bg-gray-200 text-gray-700 border-t border-gray-300 uppercase text-xs md:text-sm">
                    <th className="px-4 py-3">Ekipa</th>
                    <th className="px-2 py-3">Tekem</th>
                    <th className="px-2 py-3">Z</th>
                    <th className="px-2 py-3">N</th>
                    <th className="px-2 py-3">P</th>
                    <th className="px-2 py-3">Točke</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                    ["ILIRIJA 1911", 19, 17, 1, 1, 52],
                    ["BRINJE GROSUPLJE", 16, 14, 2, 4, 45],
                    ["TKK TOLMIN", 16, 14, 2, 4, 45],
                    ["SVOBODA LJUBLJANA", 16, 14, 2, 4, 45],
                    ["ILIRIJA 1911", 19, 17, 1, 1, 52],
                    ["BRINJE GROSUPLJE", 16, 14, 2, 4, 45],
                    ["TKK TOLMIN", 16, 14, 2, 4, 45], // Highlight this row
                    ["SVOBODA LJUBLJANA", 16, 14, 2, 4, 45],
                    ["ILIRIJA 1911", 19, 17, 1, 1, 52],
                    ["BRINJE GROSUPLJE", 16, 14, 2, 4, 45],
                    ["TKK TOLMIN", 16, 14, 2, 4, 45],
                    ["SVOBODA LJUBLJANA", 16, 14, 2, 4, 45],
                    ].map((team, idx) => (
                    <tr
                        key={idx}
                        className={`border-b border-gray-200 ${
                        team[0] === "TKK TOLMIN" && idx === 6
                            ? "bg-red-600 text-white"
                            : "bg-transparent text-gray-800"
                        }`}
                    >
                        {team.map((val, i) => (
                        <td key={i} className="px-4 py-3">
                            {val}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </section>


      </main>
    </div>
  );
}
