'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/Loading';

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
      status: string;
      stage: {
        st_name: string;
      };
      start: number;
    }[];
  };

  const [organizedMatches, setOrganizedMatches] = useState<OrganizedData>({});
  const [seasons, setSeasons] = useState<string[]>([]);

  const corsProxy = "https://cors-anywhere.herokuapp.com/";

  const [links] = useState<string[]>([
    `${corsProxy}https://int.soccerway.com/v1/english/participant/soccer/full/11005/`,
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

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const [i, link] of links.entries()) {
      try {
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
          result[season].push({
            enemy,
            score,
            status: match.o_status,
            stage: { st_name: match.stage.st_name },
            start: match.start
          });
        });
      } catch (error) {
        console.error("Error fetching tekme from", link, error);
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

  useEffect(() => {
    if (selectedSeason) {
      console.log("Selected season:", selectedSeason);
      console.log("Matches for selected season:", organizedMatches[selectedSeason] || []);
    }
  }, [selectedSeason]);

  // ✅ Updated format function
  function formatMatchDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // convert seconds → ms

    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const day = days[date.getUTCDay()];
    const d = date.getUTCDate().toString().padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${day} ${d} ${month} — ${hours}:${minutes}`;
  }

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
                      className="absolute left-0 right-0 -bottom-1 h-[3px] bg-red-600 rounded"
                      transition={{ type: "spring", stiffness: 500, damping: 60 }}
                    />
                  )}
                </li>
              ))}
              <div className="absolute left-0 right-0 bottom-2 h-[3px] w-100% bg-gray-300">
              </div>
            </ul>
            <Dropdown label={isLoading ? "Loading..." : error ? "Failed to Load Season" : selectedSeason ?? undefined} items={seasons} onSelect={handleSelectedSeason} />
          </div>
        </section>

        <section className='w-full min-h-content p-2 px-5 overflow-hidden pb-12'>
          <div className='w-full flex flex-col mb-12'>
            { isLoading && <Loading /> }

            <div className="w-full grid gap-4">
              {(selectedSeason && organizedMatches[selectedSeason] ? organizedMatches[selectedSeason] : []).map((match, i) => (
                <div
                  key={i}
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
                        src="/enemy-logo.png"
                        alt={match.enemy}
                        width={50}
                        height={50}
                        className="w-10 h-10 md:w-[60px] md:h-[60px]"
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
        </section>
      </main>
    </div>
  );
}
