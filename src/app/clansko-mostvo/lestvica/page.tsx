'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/Loading';

const TOLMIN_ID = '11156';

// ===== Types for LiveScore tables payload (simplified to what we render) =====
type TeamBadge = {
  high?: string;
  medium?: string;
};

type LeagueTeam = {
  id: string;
  name: string;
  draws: number;
  goalsAgainst: number;
  goalsDiff: number;
  goalsFor: number;
  hasMatchInProgress: boolean;
  losses: number;
  lossesOT: number;
  played: number;
  points: number;
  rank: number;
  reg: number;
  wins: number;
  winsOT: number;
  slug: string;
  teamBadge?: TeamBadge;
};

type LeagueBlock = {
  kind: 'all' | 'home' | 'away' | 'form' | string;
  url: string;
  name: string;       // e.g. "3.SNL: West"
  tableName: string;  // e.g. "total" | "home" | "away"
  country: string;
  countryName: string;
  teams: LeagueTeam[];
  hideLeagueTableBadges?: boolean;
};

type LiveScoreTables = {
  pageProps: {
    initialData: {
      basicInfo: {
        id: string;
        name: string;
        country: string;
        badge: {
          high: string;
          medium: string;
        };
      };
      leagueTables: {
        league: {
          "": LeagueBlock[];
        };
      };
    };
  };
};

function getBadgeUrl(team: LeagueTeam) {
  return (
    team?.teamBadge?.medium ||
    team?.teamBadge?.high ||
    '/logo/placeholder-team.png'
  );
}

// Small helper to map the array to a dictionary by kind
function indexByKind(blocks: LeagueBlock[]) {
  return blocks.reduce<Record<string, LeagueBlock>>((acc, blk) => {
    if (blk?.kind) acc[blk.kind] = blk;
    return acc;
  }, {});
}

export default function Page() {
  const pathname = usePathname();

  // Top nav tabs across the squad section
  const tabs = useMemo(
    () => [
      { name: 'Epika', link: '/clansko-mostvo' },
      { name: 'Tekme', link: '/clansko-mostvo/tekme' },
      { name: 'Lestvica', link: '/clansko-mostvo/lestvica' },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState('Epika');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const currentTab = hoveredTab || activeTab;

  useEffect(() => {
    const found = tabs.find((t) => t.link === pathname);
    if (found) setActiveTab(found.name);
  }, [pathname, tabs]);

  // LiveScore tables state
  const [data, setData] = useState<LiveScoreTables | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Which sub-table to show (all/home/away)
  const [tableKind, setTableKind] = useState<'all' | 'home' | 'away'>('all');

  const url =
    'https://www.livescore.com/_next/data/nvstvvHIPnFDwGFa8CR__/en/football/team/tolmin/11156/tables/22579.json?sport=football&teamName=tolmin&teamId=11156&stageId=22579';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as LiveScoreTables;
        setData(json);
            } catch (e) {
        if (e instanceof Error) {
          setErr(e.message);
        } else {
          setErr('Failed to load table.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathname, url]);

  const blocks = data?.pageProps?.initialData?.leagueTables?.league?.[''] || [];
  const byKind = indexByKind(blocks);

  // Prefer the selected kind; fall back to 'all' if missing
  const selectedBlock =
    byKind[tableKind] || byKind['all'] || (blocks.length ? blocks[0] : undefined);

  const stageName = selectedBlock?.name || 'Table';
  const teams = selectedBlock?.teams || [];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-60 pointer-events-none" />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg">
            Člansko moštvo - Lestvica
          </h1>
        </div>
      </header>

      <main className="w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600">
        {/* Top tabs (Epika / Tekme / Lestvica) */}
        <section className="w-full min-h-content max-h-[930px] p-2 px-5 pb-6 overflow-visible">
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
                        currentTab === tab.name
                          ? 'bg-red-50 text-red-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
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
          </div>
        </section>

        {/* Kind switcher (All / Home / Away) */}
        <section className="w-full px-5 pb-3">
          <div className="flex gap-2">
            {(['all', 'home', 'away'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTableKind(k)}
                className={`px-3 py-2 rounded text-sm font-semibold ${
                  tableKind === k
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {k === 'all' ? 'Skupaj' : k === 'home' ? 'Doma' : 'V gosteh'}
              </button>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="w-full min-h-content p-2 px-5 overflow-hidden pb-20 poppins">
          <div className="w-full overflow-auto">
            <table className="w-full text-left border-collapse font-medium text-sm md:text-base border-t-8 border-red-600">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th colSpan={7} className="text-left px-4 py-3 text-sm md:text-base">
                    {stageName} — {tableKind === 'all' ? 'Skupaj' : tableKind === 'home' ? 'Doma' : 'V gosteh'}
                  </th>
                </tr>
                <tr className="bg-gray-200 text-gray-700 border-t border-gray-300 uppercase text-xs md:text-sm">
                  <th className="px-4 py-3">Ekipa</th>
                  <th className="px-2 py-3 text-center">M</th>
                  <th className="px-2 py-3 text-center">Z</th>
                  <th className="px-2 py-3 text-center">N</th>
                  <th className="px-2 py-3 text-center">P</th>
                  <th className="px-2 py-3 text-center">DG</th>
                  <th className="px-2 py-3 text-center">Točke</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6">
                      <div className="w-full flex justify-center items-center">
                        <Loading />
                      </div>
                    </td>
                  </tr>
                )}

                {/* Error */}
                {!loading && err && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                      {err}
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!loading && !err && teams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      Ni podatkov za prikaz.
                    </td>
                  </tr>
                )}

                {/* Rows */}
                {!loading &&
                  !err &&
                  teams.map((team, idx) => {
                    const isTolmin = team.id === TOLMIN_ID || /tolmin/i.test(team.name || '');
                    const rowClass = isTolmin
                      ? 'bg-red-600 text-white'
                      : 'bg-transparent text-gray-800';

                    const logoSrc = getBadgeUrl(team);

                    return (
                      <tr key={`${team.id}-${idx}`} className={`border-b border-gray-200 ${rowClass}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={logoSrc}
                              alt={team.name ?? 'Team'}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain rounded bg-white"
                              unoptimized
                            />
                            <span className="font-medium">{team?.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">{team?.played ?? '-'}</td>
                        <td className="px-2 py-3 text-center">{team?.wins ?? '-'}</td>
                        <td className="px-2 py-3 text-center">{team?.draws ?? '-'}</td>
                        <td className="px-2 py-3 text-center">{team?.losses ?? '-'}</td>
                        <td className="px-2 py-3 text-center">
                          {/* DG = goal difference */}
                          {typeof team?.goalsDiff === 'number' ? team.goalsDiff : '-'}
                        </td>
                        <td className="px-2 py-3 text-center">{team?.points ?? '-'}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
