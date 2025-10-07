'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Team = {
  position?: string;
  firstName?: string;
  lastName?: string;
  number?: string;
  img?: string;
};

type OldTeam = {
  _id: string;
  season?: string;
  image?: string;
};

export default function Page() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Ekipa");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const [tabs] = useState<{ name: string; link: string }[]>([
    { name: "Ekipa", link: "/clansko-mostvo" },
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

  const [teamData, setTeamData] = useState<Team[] | null>(null);
  const [currentYear] = useState<string>(() => {
    const y = new Date().getFullYear();
    return `${y}-${y + 1}`;
  });
  const [activeSeason, setActiveSeason] = useState<string>(currentYear);
  const [oldTeamData, setOldTeamData] = useState<OldTeam[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/teams');
      const data = await res.json();

      const oldTeamRes = await fetch('/api/old-team');
      const oldTeamData = await oldTeamRes.json();

      setOldTeamData(oldTeamData)

      setTeamData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
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
            Člansko moštvo - Ekipa
          </motion.h1>
        </div>
      </header> */}

      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-60 pointer-events-none" />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
          <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg"
          >
            Člansko moštvo - Ekipa
          </motion.h1>
        </div>
      </header>
      
      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible'>
            <div className='relative w-full p-3 flex flex-col sm:flex-row items-center justify-between'>
              <div className="relative w-full p-3 flex flex-row items-center justify-between">
                {/* Mobile: compact dropdown / segmented menu using native <details> for no extra hooks */}
                <details className="w-full sm:hidden">
                <summary className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer">
                  <span className="font-semibold text-gray-800">{currentTab}</span>
                  <span className="ml-2 text-gray-500 select-none">▾</span>
                </summary>

                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.link}
                    className={`block w-full text-left px-4 py-3 text-sm ${
                    currentTab === tab.name
                      ? "bg-red-50 text-red-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.name}
                  </Link>
                  ))}
                </div>
                </details>

                {/* Desktop / tablet: original horizontal tabs with underline animation */}
                <ul className="hidden sm:flex w-full relative gap-4 sm:gap-6 text-base sm:text-lg font-semibold text-gray-800 select-none overflow-x-auto whitespace-nowrap py-1 -mx-3 sm:mx-0 px-3 sm:px-0">
                {tabs.map((tab) => (
                  <li
                  key={tab.name}
                  className={`flex-shrink-0 relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 ${
                    currentTab === tab.name ? "text-red-600" : "hover:text-red-600"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                  onMouseEnter={() => setHoveredTab(tab.name)}
                  onMouseLeave={() => setHoveredTab(null)}
                  >
                  <Link href={activeTab === tab.name ? "#" : tab.link}>
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
                <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gray-300 pointer-events-none" />
                </ul>
              </div>

              {(() => {
              const now = new Date();
              const startYear = now.getFullYear(); // current season start (e.g., 2024 for 2024-2025)
              const minStart = 2014;
              const seasons: string[] = [];
              for (let y = startYear; y >= minStart; y--) {
                seasons.push(`${y}-${y + 1}`);
              }
              return (
                <Dropdown
                  items={seasons}
                  onSelect={(season: string) => {
                    setActiveSeason(season);
                  }}
                />
              );
              })()}
            </div>
        </section>

        { activeSeason === currentYear && (
          <>
            {/* GoalKeeper Section */}
            <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
              <div className='border-b-2 border-gray-300 mb-4 pb-2'>
                <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
                  Vratarji
                </h1>
              </div>
            {/* Player Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {teamData === null ? (
                  <div className="col-span-full p-6 text-center text-gray-500">Loading team data...</div>
                ) : teamData.filter((p: Team) => p.position && p.position.toLowerCase().includes('goal')).length === 0 ? (
                  <div className="col-span-full p-6 text-center text-gray-500">No Vratarji found.</div>
                ) : (
                  teamData
                    .filter((p: Team) => p.position && p.position.toLowerCase().includes('goal'))
                    .map((player: Team, index: number) => (
                      <motion.div
                        key={index}
                        className="relative p-5 h-[430px] w-full"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        viewport={{ once: true, amount: .3 }}
                      >
                        <h1 className="absolute top-2 right-3 text-red-600 z-2 text-4xl font-bold poppins uppercase player-number">
                          {player.number ?? '01'}
                        </h1>
                        <Image
                          src={player.img || '/player1.png'}
                          alt={`${player.firstName ?? ''} ${player.lastName ?? ''}`.trim() || 'Player'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins">
                          <p className="-mb-2 uppercase">{player.firstName ?? 'First'}</p>
                          <p className="text-4xl font-semibold poppins uppercase">{player.lastName ?? 'Last'}</p>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </section>

            {/* Players Section */}
            <section className='w-full min-h-content p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
              <div className='border-b-2 border-gray-300 mb-4 pb-2'>
                <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
                  Igralci
                </h1>
              </div>
            {/* Player Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {teamData === null ? (
                  <div className="col-span-full p-6 text-center text-gray-500">Loading team data...</div>
                ) : teamData.filter((p: Team) => p.position && p.position.toLowerCase().includes('def')).length === 0 ? (
                  <div className="col-span-full p-6 text-center text-gray-500">No Igralci found.</div>
                ) : (
                  teamData
                    .filter((p: Team) => p.position && p.position.toLowerCase().includes('def') ||  p.position && p.position.toLowerCase().includes('mid') 
                  || p.position && p.position.toLowerCase().includes('forward') || p.position && p.position.toLowerCase().includes('forward'))
                    .map((player: Team, index: number) => (
                      <motion.div
                        key={index}
                        className="relative p-5 h-[430px] w-full"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        viewport={{ once: true, amount: .3 }}
                      >
                        <h1 className="absolute top-2 right-3 text-red-600 z-2 text-4xl font-bold poppins uppercase player-number">
                          {player.number ?? '01'}
                        </h1>
                        <Image
                          src={player.img || '/player1.png'}
                          alt={`${player.firstName ?? ''} ${player.lastName ?? ''}`.trim() || 'Player'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins">
                          <p className="-mb-2 uppercase">{player.firstName ?? 'First'}</p>
                          <p className="text-4xl font-semibold poppins uppercase">{player.lastName ?? 'Last'}</p>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </section>

            {/* Coach Section */}
            <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
              <div className='border-b-2 border-gray-300 mb-4 pb-2'>
                <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
                  Trener
                </h1>
              </div>
            {/* Player Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {teamData === null ? (
                  <div className="col-span-full p-6 text-center text-gray-500">Loading team data...</div>
                ) : teamData.filter((p: Team) => p.position && p.position.toLowerCase().includes('coach')).length === 0 ? (
                  <div className="col-span-full p-6 text-center text-gray-500">No Trener found.</div>
                ) : (
                  teamData
                    .filter((p: Team) => p.position && p.position.toLowerCase().includes('coach'))
                    .map((player: Team, index: number) => (
                      <motion.div
                        key={index}
                        className="relative p-5 h-[430px] w-full"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        viewport={{ once: true, amount: .3 }}
                      >
                        <h1 className="absolute top-2 right-3 text-red-600 z-2 text-4xl font-bold poppins uppercase player-number">
                          {player.number ?? '01'}
                        </h1>
                        <Image
                          src={player.img || '/player1.png'}
                          alt={`${player.firstName ?? ''} ${player.lastName ?? ''}`.trim() || 'Player'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins">
                          <p className="-mb-2 uppercase">{player.firstName ?? 'First'}</p>
                          <p className="text-4xl font-semibold poppins uppercase">{player.lastName ?? 'Last'}</p>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </section>

            {/* Staff Section */}
            <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
              <div className='border-b-2 border-gray-300 mb-4 pb-2'>
                <h1 className="text-6xl font-bold text-left text-black mt-2 uppercase">
                  Strokovni štab
                </h1>
              </div>
            {/* Player Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {teamData === null ? (
                  <div className="col-span-full p-6 text-center text-gray-500">Loading team data...</div>
                ) : teamData.filter((p: Team) => p.position && p.position.toLowerCase().includes('staff')).length === 0 ? (
                  <div className="col-span-full p-6 text-center text-gray-500">No Strokovni štab found.</div>
                ) : (
                  teamData
                    .filter((p: Team) => p.position && p.position.toLowerCase().includes('staff'))
                    .map((player: Team, index: number) => (
                      <motion.div
                        key={index}
                        className="relative p-5 h-[430px] w-full"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        viewport={{ once: true, amount: .3 }}
                      >
                        <h1 className="absolute top-2 right-3 text-red-600 z-2 text-4xl font-bold poppins uppercase player-number">
                          {player.number ?? '01'}
                        </h1>
                        <Image
                          src={player.img || '/player1.png'}
                          alt={`${player.firstName ?? ''} ${player.lastName ?? ''}`.trim() || 'Player'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins">
                          <p className="-mb-2 uppercase">{player.firstName ?? 'First'}</p>
                          <p className="text-4xl font-semibold poppins uppercase">{player.lastName ?? 'Last'}</p>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </section>
          </>
        )}

        {activeSeason !== currentYear && (
          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
              <div className='border-b-2 border-gray-300 mb-4 pb-2'>
                <h1 className="text-3xl font-bold text-left text-black mt-2 uppercase">
                  Team Picture of Season {activeSeason}
                </h1>
              </div>
                <div className="w-full flex justify-center items-center py-6">
                  <div className="relative w-full max-w-5xl aspect-video">
                  {(() => {
                    const item = oldTeamData?.find((i) => i.season === activeSeason);
                    const src = item?.image || item?.image;
                    if (src) {
                    return (
                      <Image
                      src={src}
                      alt={`Team picture ${activeSeason}`}
                      fill
                      className="object-contain rounded-md shadow-md"
                      />
                    );
                    }
                    return (
                    <div className="w-full h-full flex items-center justify-center rounded-md bg-gray-100 border border-dashed border-gray-300 text-gray-500">
                      Slika ni najdena
                    </div>
                    );
                  })()}
                  </div>
                </div>
          </section>
        )}

      </main>
    </div>
  );
}
