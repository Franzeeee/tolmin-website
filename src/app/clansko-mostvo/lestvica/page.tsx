'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Loading from '@/components/Loading';
import Swal from 'sweetalert2';
import { goalsDiff, sortStandings, type StandingsRow } from '@/util/standings';

const TOLMIN_NAME_RX = /tolmin/i;

type history = {
  season_end: string;
  season_start: string;
  year: number;
  league: string;
  image?: string;
};

export default function Page() {
  const pathname = usePathname();

  const [SEASONS, setSEASONS] = useState(
    Array.from(
      { length: new Date().getFullYear() - 1919 },
      (_, i) => {
        const year = 1920 + i;
        const isLatest = year === new Date().getFullYear();
        return {
          label: isLatest ? 'Latest' : `${year}-${year + 1}`,
          year,
        };
      }
    ).reverse()
  );

  const [history, setHistory] = useState<history[]>([]);

  useEffect(() => {
    fetch('/api/lestvica')
      .then((res) => res.json())
      .then((data) => {
        setHistory(data || []);
      })
      .catch((err) => {
        console.error('Error fetching table data:', err);
        Swal.fire({
          icon: 'error',
          title: 'Napaka',
          text: 'Pri nalaganju zgodovine lestvice je prišlo do napake.',
        });
      });
  }, []);

  const tabs = useMemo(
    () => [
      { name: 'Ekipa', link: '/clansko-mostvo' },
      { name: 'Tekme', link: '/clansko-mostvo/tekme' },
      { name: 'Lestvica', link: '/clansko-mostvo/lestvica' },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState('Ekipa');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const currentTab = hoveredTab || activeTab;

  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0].year);
  const isLatestSeason = selectedSeason === SEASONS[0].year;

  const [selectedSeasonLabel, setSelectedSeasonLabel] = useState(
    SEASONS.find(s => s.year === selectedSeason)?.label ?? ''
  );

  const [activeHistory, setActiveHistory] = useState<history | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>('');
  

  useEffect(() => {
    setSelectedSeasonLabel(
      SEASONS.find(s => s.year === selectedSeason)?.label ?? ''
    );

    // Get the start year and end year from label
    history.forEach((h) => {
      if (parseInt(h.season_start, 10) === selectedSeason) {
        // console.log('Found matching history:', h);
        setActiveHistory(h);
        setImageUrl(h.image || null);
        setLeagueName(h.league || '');
      } else {
        // console.log('No matching history for season:', selectedSeason);
        setActiveHistory(null);
      }
    });
  }, [selectedSeason, SEASONS]);
  

  useEffect(() => {
    const found = tabs.find((t) => t.link === pathname);
    if (found) setActiveTab(found.name);
  }, [pathname, tabs]);

  /* -------- Fetch the current-season standings from our own admin-managed data -------- */
  const [rows, setRows] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchRows = async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await axios.get<StandingsRow[]>('/api/lestvica-tabela');

        // Only keep seasons that have data (plus the current one, always shown).
        const seasonsWithData = new Set<number>();
        history.forEach((h) => {
          seasonsWithData.add(parseInt(h.season_start, 10));
        });
        setSEASONS((prevSeasons) => {
          const latestSeasonYear = new Date().getFullYear();
          return prevSeasons.filter(
            (s) => s.year === latestSeasonYear || seasonsWithData.has(s.year)
          );
        });

        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load table.');
      } finally {
        setLoading(false);
      }
    };
    fetchRows();
  }, [pathname, history]);

  const sortedRows = useMemo(() => sortStandings(rows), [rows]);
  const stageName = sortedRows[0]?.league || 'Lestvica';

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
        <section className="w-full min-h-content max-h-[930px] p-2 px-5 pb-6 overflow-visible">
          <div className="relative w-full p-3 flex flex-row items-center justify-between">
            <div className="relative w-full p-3 flex flex-row items-center justify-between">
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

        {/* Season Switcher */}
        <section className="w-full px-5 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 poppins">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="px-3 py-2 rounded text-sm font-semibold bg-white text-gray-700 border outline-1 outline-red-500 border-gray-200 hover:bg-gray-50"
          >
            {SEASONS.map((season) => (
              <option key={season.year} value={season.year}>
                {season.label}
              </option>
            ))}
          </select>
        </section>

        {/* Table */}
        <section className="w-full min-h-content p-2 px-5 overflow-hidden pb-20 poppins">
          <div className="w-full overflow-auto">
            <table className="w-full text-left border-collapse font-medium text-sm md:text-base border-t-8 border-red-600">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th colSpan={7} className="text-left px-4 py-3 text-sm md:text-base">
                      {
                        !isLatestSeason
                          ? `Lestvica za sezono ${selectedSeasonLabel} - ${leagueName|| ''}`
                          : stageName
                      }
                  </th>
                </tr>
                {isLatestSeason && (
                  <tr className="bg-gray-200 text-gray-700 border-t border-gray-300 uppercase text-xs md:text-sm">
                  <th className="px-4 py-3">Ekipa</th>
                  <th className="px-2 py-3 text-center">M</th>
                  <th className="px-2 py-3 text-center">Z</th>
                  <th className="px-2 py-3 text-center">N</th>
                  <th className="px-2 py-3 text-center">P</th>
                  <th className="px-2 py-3 text-center">DG</th>
                  <th className="px-2 py-3 text-center">Točke</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {/* NON-LATEST SEASON → BLANK TAB MESSAGE */}
                {!isLatestSeason && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      {activeHistory?.image || imageUrl ? (
                        /* IMAGE EXISTS */
                        <div className="flex flex-col items-center gap-4">
                          {/* <span className="text-lg font-semibold text-gray-800">
                            {selectedSeasonLabel}
                          </span> */}

                          <div className="relative w-full max-w-3xl h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={imageUrl!}
                              alt={`Lestvica ${selectedSeasonLabel}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 900px"
                            />
                          </div>
                        </div>
                      ) : (
                        /* NO DATA */
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-lg font-semibold text-gray-800">
                            {selectedSeasonLabel}
                          </span>
                          <span className="text-sm text-gray-500">
                            Lestvica za to sezono trenutno ni na voljo.
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                )}


                {/* LATEST SEASON → ORIGINAL TABLE LOGIC (UNCHANGED) */}
                {isLatestSeason && loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6">
                      <div className="w-full flex justify-center items-center">
                        <Loading />
                      </div>
                    </td>
                  </tr>
                )}

                {isLatestSeason && !loading && err && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                      {err}
                    </td>
                  </tr>
                )}

                {isLatestSeason && !loading && !err && sortedRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      Ni podatkov za prikaz.
                    </td>
                  </tr>
                )}

                {isLatestSeason &&
                  !loading &&
                  !err &&
                  sortedRows.map((row) => {
                    const isTolmin = TOLMIN_NAME_RX.test(row.team || '');
                    const rowClass = isTolmin
                      ? 'bg-red-600 text-white'
                      : 'bg-transparent text-gray-800';

                    return (
                      <tr
                        key={row._id}
                        className={`border-b border-gray-200 ${rowClass}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={row.teamLogo || '/logo/placeholder-team.png'}
                              alt={row.team}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain rounded bg-white"
                              unoptimized
                            />
                            <span className="font-medium">{row.team}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">{row.played}</td>
                        <td className="px-2 py-3 text-center">{row.wins}</td>
                        <td className="px-2 py-3 text-center">{row.draws}</td>
                        <td className="px-2 py-3 text-center">{row.losses}</td>
                        <td className="px-2 py-3 text-center">{goalsDiff(row)}</td>
                        <td className="px-2 py-3 text-center">{row.points}</td>
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
