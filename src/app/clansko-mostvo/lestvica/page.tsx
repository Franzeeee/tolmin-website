'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
// import Dropdown from '@/components/Dropdown';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/Loading';

type FetchedData = {
  stages: Array<{
    id: string;
    st_name: string;
    season_info: {
      id: string;
      name: string;
      code: string;
    };
    standings: Array<{
      id: string;
      teams: Array<{
        id: string;
        name: string;
        goal_against: string;
        goal_for: string;
        img_id: string;
        losses: string;
        draws: string;
        wins: string;
        points: string;
        ranking: number;
        ppg: number;
        played: string;
      }>;
    }>;
  }>;
};

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

  const [data, setData] = useState<FetchedData | null>(null);
  const url = "https://int.soccerway.com/v1/english/participant/soccer/full/11005/";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      setData(json);
      setLoading(false);

      console.log("Fetched data:", json.stages[0]);
    };

    fetchData();
  }, [pathname]);

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
              {/* <Dropdown items={["1", "2"]} onSelect={() => {}} /> */}
          </div>
        </section>

        <section className="w-full min-h-content p-2 px-5 overflow-hidden pb-20 poppins">
            <div className="w-full overflow-auto">
                <table className="w-full text-left border-collapse font-medium text-sm md:text-base border-t-8 border-red-600">
                <thead>
                    <tr className="bg-gray-900 text-white">
                    <th colSpan={6} className="text-left px-4 py-3 text-sm md:text-base">
                        {data?.stages[0]?.st_name} {data?.stages[0]?.season_info?.code}
                    </th>
                    </tr>
                    <tr className="bg-gray-200 text-gray-700 border-t border-gray-300 uppercase text-xs md:text-sm">
                    <th className="px-4 py-3">Ekipa</th>
                    <th className="px-4 py-3 text-center">Tekem</th>
                    <th className="px-4 py-3 text-center">Z</th>
                    <th className="px-4 py-3 text-center">N</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">Točke</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6">
                          <div className="w-full flex justify-center items-center">
                            <Loading />
                          </div>
                        </td>
                      </tr>
                    )}
                    {data?.stages[0]?.standings[0]?.teams?.map((team, idx) => (
                    <tr
                      key={team.id ?? idx}
                      className={`border-b border-gray-200 ${
                        team?.name === "Tolmin"
                          ? "bg-red-600 text-white"
                          : "bg-transparent text-gray-800"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {team?.img_id ? (
                            <Image
                              src={`https://static.soccerway.com/team/${team.img_id}/participant-logo-mobile-100x100/image.png` || '/logo/placeholder-team.png'}
                              alt={team.name ?? ''}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-cover rounded"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src="/logo/placeholder-team.png"
                              alt={team.name ?? ''}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-cover rounded"
                              unoptimized
                            />
                          )}
                          <span className="font-medium">{team?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{team?.played}</td>
                      <td className="px-4 py-3 text-center">{team?.wins}</td>
                      <td className="px-4 py-3 text-center">{team?.draws}</td>
                      <td className="px-4 py-3 text-center">{team?.losses}</td>
                      <td className="px-4 py-3 text-center">{team?.points}</td>
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
