'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';
import { useTeamLogos } from '@/app/hooks/useTeamLogos';

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
      enemyId: string; // Added team ID
      score: string;
      status: string;
      stage: {
        st_name: string;
      };
      start: number;
    }[];
  };

  const [organizedMatches, setOrganizedMatches] = useState<OrganizedData>({});
  const [seasons, setSeasons] = useState<string[]>([]);


  const [links] = useState<string[]>([
    '/api/tolmin'
  ]);

  type Team = {
    id: string;
    name: string;
    scores: {
      RUNNING?: string;
    };
    img: string;
  };

  type Match = {
    season_info?: {
      name?: string;
    };
    teams: [Team, Team];
    o_status: string;
    stage: {
      st_name: string;
    };
    start: number;
  };

  const fetchAllMatches = async (): Promise<{ organized: OrganizedData; seasons: string[] }> => {
    const result: OrganizedData = {};
    const seasonSet = new Set<string>();

    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // If you only have one link that contains all matches, fetch it once and process its matches array
    if (links.length === 0) {
      console.warn("No links provided for fetching matches");
    } else {
    try {
    type ApiItem = {
      data: {
        matches: Match[];
      };
    };

    const response = await axios.get<ApiItem[]>('/api/tolmin');
    const data = response.data;

    data.forEach((item) => {
      if (Array.isArray(item.data.matches)) {
        item.data.matches.forEach((match: Match) => {
          const season = match.season_info?.name;
          if (!season) return;

      seasonSet.add(season);

      const [teamA, teamB] = match.teams;
      let enemy = "";
      let enemyId = "";
      let score = "";

      if (teamA.id === "11005") {
        enemy = teamB.name;
        enemyId = teamB.id;
        score = `${teamA.scores.RUNNING ?? "0"} - ${teamB.scores.RUNNING ?? "0"}`;
      } else {
        enemy = teamA.name;
        enemyId = teamA.id;
        score = `${teamB.scores.RUNNING ?? "0"} - ${teamA.scores.RUNNING ?? "0"}`;
      }

      if (!result[season]) result[season] = [];
      result[season].push({
        enemy,
        enemyId,
        score,
        status: match.o_status,
        stage: { st_name: match.stage.st_name },
        start: match.start
      });
      });
    } else {
      console.warn("Expected item.matches to be an array", item);
    }
    })
    
    } catch (error) {
    console.error("Error fetching tekme from", error);
    }
    }

    // Sort seasons like "2025/2026", "2024/2025" -> latest first
    const sortedSeasons = Array.from(seasonSet).sort((a, b) => {
      const startA = parseInt(a.split("/")[0], 10);
      const startB = parseInt(b.split("/")[0], 10);
      return startB - startA; // descending order
    });

    return { organized: result, seasons: sortedSeasons };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['tekme-matches'],
    queryFn: fetchAllMatches,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  useEffect(() => {
    if (data) {
      setOrganizedMatches(data.organized);
      setSeasons(data.seasons);
      setSelectedSeason(data.seasons[0] || null);
    }
  }, [data]);

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const handleSelectedSeason = (season: string) => {
    setSelectedSeason(season);
  };

  // Extract unique team IDs from current season matches
  const currentSeasonTeamIds = useMemo(() => {
    if (!selectedSeason || !organizedMatches[selectedSeason]) return [];
    
    const teamIds = organizedMatches[selectedSeason]
      .map(match => match.enemyId)
      .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
    
    return teamIds;
  }, [selectedSeason, organizedMatches]);

  // Fetch logos for current season teams
  const { data: teamLogos, isLoading: logosLoading } = useTeamLogos(currentSeasonTeamIds);

  // ✅ Updated format function
  function formatMatchDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // convert seconds → ms
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

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
            Člansko moštvo - tekme
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
              Člansko moštvo - Tekme
            </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>
        <section className='w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible'>
          <div className='relative w-full p-3 flex flex-row items-center justify-between'>
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
              <ul className="hidden w-full sm:flex relative gap-4 sm:gap-6 text-base sm:text-lg font-semibold text-gray-800 select-none overflow-x-auto whitespace-nowrap py-1 -mx-3 sm:mx-0 px-3 sm:px-0">
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

            <Dropdown label={isLoading ? "Loading..." : error ? "Failed to Load Season" : selectedSeason ?? undefined} items={seasons} onSelect={handleSelectedSeason} />
          </div>
        </section>

        <section className='w-full min-h-content p-2 px-5 overflow-hidden pb-12'>
          <div className='w-full flex flex-col mb-12'>
            { isLoading && <Loading /> }

             {selectedSeason && organizedMatches[selectedSeason] ? (
              // ✅ Group matches by month/year
              Object.entries(
                organizedMatches[selectedSeason].reduce((acc, match) => {
                  const date = new Date(match.start * 1000);
                  const monthYear = date.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  });
                  if (!acc[monthYear]) acc[monthYear] = [];
                  acc[monthYear].push(match);
                  return acc;
                }, {} as Record<string, typeof organizedMatches[string]>)
              ).map(([monthYear, matches]) => (
                <div key={monthYear} className="mb-10">
                  {/* Month Header */}
                  {/* <div className='border-b-2 border-gray-200 mb-4 pb-2'>
                    <h1 className="text-5xl font-bold text-left mt-2 uppercase text-gray-200">
                      {monthYear}
                    </h1>
                  </div> */}

                  {/* Matches in that month */}
                  <div className="w-full grid gap-4">
                    {[...matches].reverse().map((match, i) => (
                      <div
                        key={`${match.start}-${i}`}
                        className="grid md:grid-cols-[1fr_auto_1fr] grid-cols-1 items-center gap-4 p-4 px-0 text-black border-b-2 border-gray-200 poppins"
                      >
                        {/* Left: Match Info & Home Team */}
                        <div className="flex md:items-start items-center md:justify-start justify-center flex-col relative h-full md:min-h-[140px] text-center md:text-left">
                          <div className="w-full h-full">
                            <div className="font-extrabold text-base">{match.stage.st_name}</div>
                            <div className="text-sm">
                              {formatMatchDate(match.start)} — ŠPORTNI PARK BRAJDA
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
                              {match.score.replace(' - ', ' : ')}
                            </div>

                            <Image
                              src={
                                logosLoading
                                  ? "/logo/placeholder-team.png"
                                  : teamLogos?.[match.enemyId] || "/logo/placeholder-team.png"
                              }
                              alt={match.enemy}
                              width={50}
                              height={50}
                              className="w-10 h-10 md:w-[60px] md:h-[60px]"
                              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                const img = e.currentTarget;
                                // avoid infinite loop if placeholder is missing/broken
                                if (!img.src.includes('/logo/placeholder-team.png')) {
                                  img.onerror = null;
                                  img.src = "/logo/placeholder-team.png";
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Right: Away Team */}
                        <div className="text-3xl w-full text-center md:text-right flex items-end justify-center md:justify-end h-full mt-2 md:mt-0">
                          {match.enemy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              !isLoading && <p className="text-gray-500 text-center">No matches available</p>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}