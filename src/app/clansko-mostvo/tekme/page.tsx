'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

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

  const currentTab = hoveredTab || activeTab;

  type OrganizedData = {
  [season: string]: {
    enemy: string;
    score: string;
  }[];
};

const [organizedMatches, setOrganizedMatches] = useState<OrganizedData>({});
const [seasons, setSeasons] = useState<string[]>([]);

useEffect(() => {
  console.log("organizedMatches:", organizedMatches);
  console.log("seasons:", seasons);
}, [organizedMatches, seasons]);


const corsProxy = "https://cors-anywhere.herokuapp.com/";

const [links] = useState<string[]>([
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&limit=20&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=30&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=60&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=90&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=120&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=150&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=180&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=210&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=240&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=270&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=300&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=330&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=360&onlydetails=true`,
  `${corsProxy}https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=390&onlydetails=true`
]);

useEffect(() => {
  const fetchAllMatches = async () => {
    const result: OrganizedData = {};
    const seasonSet = new Set<string>();

    type Team = {
      id: string;
      name: string;
      scores: {
        RUNNING?: string;
      };
    };

    type Match = {
      season_info?: {
        name?: string;
      };
      teams: [Team, Team];
    };

    // Helper to wait for ms milliseconds
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const [i, link] of links.entries()) {
      try {
        // Add buffer time between requests (e.g., 500ms)
        if (i > 0) await delay(500);

        const response = await axios.get(link);
        const matches = response.data.matches;

        matches.forEach((match: Match) => {
          const season = match.season_info?.name;
          if (!season) return;

          seasonSet.add(season);

          const [teamA, teamB] = match.teams;
          let enemy = "";
          let score = "";

          if (teamA.id === "11005") {
            enemy = teamB.name;
            score = `${teamA.scores.RUNNING ?? "0"} - ${teamB.scores.RUNNING ?? "0"}`;
          } else {
            enemy = teamA.name;
            score = `${teamB.scores.RUNNING ?? "0"} - ${teamA.scores.RUNNING ?? "0"}`;
          }

          if (!result[season]) result[season] = [];
          result[season].push({ enemy, score });
        });
      } catch (error) {
        console.error("Error fetching tekme from", link, error);
      }
    }

    setOrganizedMatches(result);
    setSeasons(Array.from(seasonSet));
    console.log("Organized:", result);
  };

  fetchAllMatches();
}, [links]);


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
            Člansko moštvo - tekme
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

        <section className='w-full min-h-content p-2 px-5 overflow-hidden pb-12'>
          
          <div className='w-full flex flex-col mb-12'>
            <div className='border-b-2 border-gray-200 mb-4 pb-2'>
              <h1 className="text-5xl font-bold text-left mt-2 uppercase text-gray-200">
                May 2025
              </h1>
            </div>

            <div className="w-full grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-[1fr_auto_1fr] grid-cols-1 items-center gap-4 p-4 px-0 text-black border-b-2 border-gray-200 poppins"
                >
                  {/* Left: Match Info & Home Team */}
                  <div className="flex md:items-start items-center md:justify-start justify-center flex-col relative h-full md:min-h-[140px] text-center md:text-left">
                    <div className="w-full h-full">
                      <div className="font-extrabold text-base">2. SNL</div>
                      <div className="text-sm">
                        SUN 25 MAY — 23:00 — ŠPORTNI PARK BRAJDA
                      </div>
                    </div>
                    <div className="text-3xl flex items-end justify-end h-full md:absolute md:-bottom-0.5 md:left-0">
                      NK TOLMIN
                    </div>
                  </div>

                  {/* Center: Logos and Score */}
                  <div className="flex flex-col items-center justify-center gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/tolmin-logo.png"
                        alt="NK Tolmin"
                        width={50}
                        height={50}
                        className="w-10 h-10 md:w-[60px] md:h-[60px]"
                      />
                      <div className="text-3xl md:text-4xl bg-gray-200 p-2 px-4 md:p-3 md:px-5 rounded poppins">
                        2 : 2
                      </div>
                      <Image
                        src="/enemy-logo.png"
                        alt="NK Dravinja"
                        width={50}
                        height={50}
                        className="w-10 h-10 md:w-[60px] md:h-[60px]"
                      />
                    </div>
                  </div>

                  {/* Right: Away Team */}
                  <div className="text-3xl w-full text-center md:text-right flex items-end justify-center md:justify-end h-full mt-2 md:mt-0">
                    NK DRAVINJA
                  </div>
                </div>
              ))}
            </div>

            


          </div>

          
        </section>

      </main>
    </div>
  );
}
