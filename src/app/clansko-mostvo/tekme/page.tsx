'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Loading from '@/components/Loading';
import { fixtureToMatch, type Fixture, type Match } from '@/util/fixtures';

/* ------------------------------------------------
 * Tolmin helper (always left when HOME)
 * ------------------------------------------------ */
const TOLMIN_NAME_RX = /tolmin/i;

const isTolminTeam = (t?: { id?: string; name?: string; o_name?: string }) => {
  if (!t) return false;
  if (t.id === 'tolmin') return true;
  const n = (t.o_name || t.name || '').toString();
  return TOLMIN_NAME_RX.test(n);
};

function OpponentLogo({
  logoUrl,
  alt,
  className = '',
}: {
  logoUrl?: string;
  alt?: string;
  className?: string;
}) {
  const SIZE = 'flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]';
  return (
    <Image
      src={logoUrl || '/logo/placeholder-team.png'}
      alt={alt || 'Team Logo'}
      width={60}
      height={60}
      className={`${SIZE} object-contain ${className}`}
      sizes="(max-width: 480px) 40px, (max-width: 640px) 48px, (max-width: 768px) 60px, 60px"
      unoptimized
    />
  );
}

/* ------------------------------------------------
 * Date util
 * ------------------------------------------------ */
function formatMatchDate(ms?: number) {
  if (!ms) return '';
  const d = new Date(ms);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/* ------------------------------------------------
 * Page
 * ------------------------------------------------ */
export default function Page() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Ekipa');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      { name: 'Ekipa', link: '/clansko-mostvo' },
      { name: 'Tekme', link: '/clansko-mostvo/tekme' },
      { name: 'Lestvica', link: '/clansko-mostvo/lestvica' },
    ],
    []
  );

  useEffect(() => {
    const found = tabs.find((t) => t.link === pathname);
    if (found) setActiveTab(found.name);
  }, [pathname, tabs]);

  const currentTab = hoveredTab || activeTab;

  /* -------- Fetch fixtures/results from our own admin-managed data -------- */
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get<Fixture[]>('/api/tekme')
      .then((res) => {
        if (cancelled) return;
        setFixtures(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allMatches: Match[] = useMemo(() => fixtures.map(fixtureToMatch), [fixtures]);

  // Seasons derived from the fixtures — latest first
  const seasons = useMemo(() => {
    const set = new Set<string>();
    for (const m of allMatches) set.add(m.season);
    return Array.from(set).sort((a, b) => parseInt(b) - parseInt(a));
  }, [allMatches]);

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedSeason && seasons.length) setSelectedSeason(seasons[0]);
  }, [seasons, selectedSeason]);

  // Filter to chosen season
  const seasonMatches = useMemo(
    () => (selectedSeason ? allMatches.filter((m) => m.season === selectedSeason) : []),
    [allMatches, selectedSeason]
  );

  // Group by Month YYYY, newest month on top; matches inside month newest → oldest
  const monthEntries = useMemo(() => {
    const buckets = seasonMatches.reduce<Record<string, Match[]>>((acc, m) => {
      const d = new Date(m.start);
      const key = d.toLocaleString('sl-SI', { month: 'long', year: 'numeric' });
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});

    const entries = Object.entries(buckets).map(([label, matches]) => {
      const maxTs = Math.max(...matches.map((m) => m.start));
      const sortedMatches = [...matches].sort((a, b) => b.start - a.start);
      return { label, ts: maxTs, matches: sortedMatches };
    });

    entries.sort((a, b) => b.ts - a.ts);
    return entries;
  }, [seasonMatches]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
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

      <main className="w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600">
        {/* Tabs + season dropdown */}
        <section className="w-full min-h-content max-h-[930px] p-2 px-5 pb-9 overflow-visible">
          <div className="relative w-full p-3 flex flex-row items-center justify-between">
            <div className="relative w-full p-3 flex flex-row items-center justify-between">
              {/* Mobile dropdown */}
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
                        currentTab === tab.name ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(tab.name)}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </div>
              </details>

              {/* Desktop tabs */}
              <ul className="hidden w-full sm:flex relative gap-4 sm:gap-6 text-base sm:text-lg font-semibold text-gray-800 select-none overflow-x-auto whitespace-nowrap py-1 -mx-3 sm:mx-0 px-3 sm:px-0">
                {tabs.map((tab) => (
                  <li
                    key={tab.name}
                    className={`flex-shrink-0 relative px-2 pb-2 cursor-pointer z-10 transition-colors duration-200 ${
                      currentTab === tab.name ? 'text-red-600' : 'hover:text-red-600'
                    }`}
                    onClick={() => setActiveTab(tab.name)}
                    onMouseEnter={() => setHoveredTab(tab.name)}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <Link href={activeTab === tab.name ? '#' : tab.link}>{tab.name}</Link>
                    {currentTab === tab.name && (
                      <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 -bottom-1 h-[3px] bg-red-600 rounded"
                        transition={{ type: 'spring', stiffness: 500, damping: 60 }}
                      />
                    )}
                  </li>
                ))}
                <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gray-300 pointer-events-none" />
              </ul>
            </div>

            <Dropdown
              label={loading ? 'Loading...' : error ? 'Failed to Load Season' : selectedSeason ?? undefined}
              items={seasons}
              onSelect={setSelectedSeason}
            />
          </div>
        </section>

{/* Matches */}
<section className="w-full min-h-content p-2 px-5 overflow-hidden pb-12">
  <div className="w-full flex flex-col mb-12">
    {loading && <Loading />}

    {Boolean(error) && !loading && (
      <p className="text-center text-red-600">Napaka pri nalaganju tekem.</p>
    )}

    {!loading && !error && selectedSeason && monthEntries.length === 0 && (
      <p className="text-gray-500 text-center">Ni razpoložljivih tekem.</p>
    )}

    {!loading &&
      !error &&
      selectedSeason &&
      monthEntries.length > 0 &&
      monthEntries.map(({ label, matches }) => (
      <div key={label} className="mb-10">
        <div className="mb-2">
        <h2 className="text-sm sm:text-base md:text-xl font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </h2>
        </div>

        <div className="w-full grid gap-2 sm:gap-3 md:gap-4">
        {matches.map((match) => {
          // const tolminTeam = match.teams.find((t) => isTolminTeam(t));
          // const opponent = match.teams.find((t) => !isTolminTeam(t));
          const homeTeam = match.teams.find((t) => t.pos === 1);
          const awayTeam = match.teams.find((t) => t.pos === 2);

          // Home team on left, away on right
          const left = homeTeam;
          const right = awayTeam;
          const isFinished = match.o_status === 'FINISHED';
          const leftScore = left?.scores.FINAL_RESULT || left?.scores.RUNNING || '0';
          const rightScore = right?.scores.FINAL_RESULT || right?.scores.RUNNING || '0';
          const venue = isTolminTeam(left) ? 'HOME' : 'AWAY';

          return (
  <div
    key={match.id}
    className="
    border-b border-gray-200 poppins
    p-3 md:px-0
    grid gap-2
    grid-cols-1
    md:[grid-template-columns:minmax(0,1fr)_auto_minmax(0,1fr)]
    md:items-center
    "
  >
    {/* LEFT (meta + home team) */}
    <div className="md:col-start-1 md:row-start-1 h-full">
    <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start h-full md:min-h-[120px]">
      {/* Meta */}
      <div className="w-full text-black">
      <div className="font-semibold text-xs sm:text-sm">{match.stage.st_name}</div>
      <div className="flex items-center gap-2 md:mt-1 text-[11px] sm:text-xs text-gray-600">
        <span>{formatMatchDate(match.start)}</span>
        <span className="hidden sm:inline">—</span>
        <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${
          venue === 'HOME' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}
        >
        {venue}
        </span>
        {!isFinished && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold bg-yellow-100 text-yellow-700">
            Predstoji
          </span>
        )}
      </div>
      </div>

      {/* Desktop: home team name anchored at bottom of left pane */}
      <div className="hidden md:block text-3xl font-extrabold max-w-full truncate mt-auto md:text-transparent text-black">
      {/* {left?.o_name || left?.name || 'Home'} */}
      </div>
    </div>
    </div>

    {/* CENTER (crests + score) */}
    <div className="justify-self-center flex flex-col items-center justify-center gap-2 mt-1 md:mt-0 text-black">
    <div className="flex items-center gap-3">
      {/* Home team logo + name (name below logo on md+) */}
      <div className="flex flex-col items-center">
      <OpponentLogo
        logoUrl={left?.logoUrl}
        alt={left?.o_name || left?.name || 'Home'}
      />
      <span className="hidden md:block mt-1 text-base font-semibold text-black text-center max-w-[100px] truncate">
        {left?.o_name || left?.name || 'Home'}
      </span>
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded leading-none">
      {isFinished ? (
        <>
          {leftScore} <span className="mx-1">:</span> {rightScore}
        </>
      ) : (
        <span className="text-lg sm:text-xl md:text-2xl font-semibold">VS</span>
      )}
      </div>
      {/* Away team logo + name (name below logo on md+) */}
      <div className="flex flex-col items-center">
      <OpponentLogo
        logoUrl={right?.logoUrl}
        alt={right?.o_name || right?.name || 'Away'}
      />
      <span className="hidden md:block mt-1 text-base font-semibold text-black text-center max-w-[100px] truncate">
        {right?.o_name || right?.name || 'Away'}
      </span>
      </div>
    </div>
    </div>

    {/* RIGHT (away team name on desktop) */}
    <div className="hidden md:flex md:col-start-3 md:row-start-1 items-end justify-end md:text-transparent text-black">
    <span className="text-3xl max-w-full truncate">
      {/* {right?.o_name || right?.name || 'Away'} */}
    </span>
    </div>

    {/* MOBILE names row (hidden on desktop) */}
    <div className="grid grid-cols-2 gap-1 md:hidden">
    <div className="text-center text-lg sm:text-xl font-bold truncate text-black">
      {left?.o_name || left?.name || 'Home'}
    </div>
    <div className="text-center text-lg sm:text-xl truncate text-black">
      {right?.o_name || right?.name || 'Away'}
    </div>
    </div>
  </div>

          );
        })}
        </div>
      </div>
      ))}
  </div>
</section>

      </main>
    </div>
  );
}
