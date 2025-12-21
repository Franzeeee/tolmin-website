'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosRequestConfig } from 'axios';
import Loading from '@/components/Loading';
import { fetchAndStoreApiKey } from "@/util/apiKey";
import { getTeamLogo } from '@/util/getTeamLogo';


interface LivescorePayload {
  pageProps?: {
    initialData?: {
      eventsByMatchType?: Array<{
        Snm?: string;
        Sds?: string;
        Events?: Array<{
          Tr1?: string | number;
          Tr2?: string | number;
          Eps?: string;
          T1?: Array<{
            ID?: string | number;
            Img?: string;
            Nm?: string;
            Abr?: string;
          }>;
          T2?: Array<{
            ID?: string | number;
            Img?: string;
            Nm?: string;
            Abr?: string;
          }>;
          Esd?: number | string;
          Eid?: string | number;
          Epr?: string | number;
        }>;
      }>;
    };
  };
}

/* ------------------------------------------------
 * Small generic fetch hook (works for JSON & binary)
 * ------------------------------------------------ */
function useFetched<T>(url?: string | null, opts?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const [error, setError] = useState<unknown>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get<T>(url, opts)
      .then((res) => {
        if (cancelled || !isMounted.current) return;
        setData(res.data);
      })
      .catch((err) => {
        if (cancelled || !isMounted.current) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled || !isMounted.current) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
      isMounted.current = false;
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

/* ------------------------------------------------
 * Types
 * ------------------------------------------------ */
type Match = {
  id: string;
  season: string;              // e.g. "2025/2026" derived from date
  o_status: string;            // FINISHED | NOT_STARTED | LIVE
  round: string;
  stage: { st_name: string };
  start: number;               // epoch ms
  teams: Array<{
    id: string;
    img_id: string;            // LiveScore path e.g. "enet/287782.png"
    name: string;
    o_name: string;
    pos: number;               // 1 home, 2 away
    s_name: string;
    scores: {
      FINAL_RESULT: string;    // side score only (e.g. "2")
      RUNNING: string;         // side score while live
    };
  }>;
};

/* ------------------------------------------------
 * Helpers (parsing & formatting)
 * ------------------------------------------------ */
const normalizeStatus = (eps?: string) => {
  switch (eps) {
    case 'NS': return 'NOT_STARTED';
    case 'FT': return 'FINISHED';
    case 'HT':
    case '1H':
    case '2H':
    case 'ET':
    case 'PEN': return 'LIVE';
    default: return eps || '';
  }
};

const deriveSeasonFromMs = (ms: number) => {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const start = m >= 6 ? y : y - 1; // season starts in July
  return `${start}/${start + 1}`;
};

function parseEsdToEpochMs(esd: number | string): number {
  const s = esd.toString().padEnd(14, '0'); // yyyymmddHHMMSS
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6)) - 1;
  const d = Number(s.slice(6, 8));
  const H = Number(s.slice(8, 10));
  const M = Number(s.slice(10, 12));
  const S = Number(s.slice(12, 14));
  return Date.UTC(y, m, d, H, M, S);
}

function safeScore(a?: string | number, b?: string | number): string {
  const has = (v: string | number | undefined | null): boolean =>
    v !== undefined && v !== null && v !== '';
  return has(a) && has(b) ? `${a}-${b}` : '';
}

const toMatchArray = (payload: LivescorePayload): Match[] => {
  const blocks = payload?.pageProps?.initialData?.eventsByMatchType ?? [];
  const out: Match[] = [];

  for (const block of blocks) {
    const stageName: string = block?.Snm ?? '';

    for (const ev of block?.Events ?? []) {
      const finalScore = safeScore(ev?.Tr1, ev?.Tr2);
      const runningScore = ev?.Eps && ev.Eps !== 'NS' ? finalScore : '';
      const t1 = (ev?.T1 ?? [])[0] ?? {};
      const t2 = (ev?.T2 ?? [])[0] ?? {};
      const startMs = ev?.Esd ? parseEsdToEpochMs(ev.Esd) : 0;

      const teams: Match['teams'] = [
        {
          id: String(t1.ID ?? ''),
          img_id: String(t1.Img ?? ''),
          name: String(t1.Nm ?? ''),
          o_name: String(t1.Nm ?? ''),
          pos: 1,
          s_name: String(t1.Abr ?? ''),
          scores: {
            FINAL_RESULT: finalScore ? finalScore.split('-')[0] : '',
            RUNNING: runningScore ? runningScore.split('-')[0] : '',
          },
        },
        {
          id: String(t2.ID ?? ''),
          img_id: String(t2.Img ?? ''),
          name: String(t2.Nm ?? ''),
          o_name: String(t2.Nm ?? ''),
          pos: 2,
          s_name: String(t2.Abr ?? ''),
          scores: {
            FINAL_RESULT: finalScore ? finalScore.split('-')[1] : '',
            RUNNING: runningScore ? runningScore.split('-')[1] : '',
          },
        },
      ];

      const normalized = normalizeStatus(ev?.Eps);
      const season = deriveSeasonFromMs(startMs);

      out.push({
        id: String(ev?.Eid ?? ''),
        season,
        o_status: normalized,
        round: ev?.Epr !== undefined ? String(ev?.Epr) : '',
        stage: { st_name: stageName },
        start: startMs,
        teams,
      });
    }
  }
  return out;
};

/* ------------------------------------------------
 * Tolmin helpers (always left)
 * ------------------------------------------------ */
const TOLMIN_IDS = new Set(['11156', '11005']);
const TOLMIN_NAME_RX = /tolmin/i;

const isTolminTeam = (t?: { id?: string; name?: string; o_name?: string }) => {
  if (!t) return false;
  if (TOLMIN_IDS.has(String(t.id))) return true;
  const n = (t.o_name || t.name || '').toString();
  return TOLMIN_NAME_RX.test(n);
};

// function orderTolminLeft(match: Match) {
//   const a = match.teams[0];
//   const b = match.teams[1];

//   if (isTolminTeam(a)) {
//     return {
//       left: a,
//       right: b,
//       leftScore: a.scores.FINAL_RESULT || a.scores.RUNNING || '0',
//       rightScore: b.scores.FINAL_RESULT || b.scores.RUNNING || '0',
//     };
//   }
//   if (isTolminTeam(b)) {
//     return {
//       left: b,
//       right: a,
//       leftScore: b.scores.FINAL_RESULT || b.scores.RUNNING || '0',
//       rightScore: a.scores.FINAL_RESULT || a.scores.RUNNING || '0',
//     };
//   }
//   return {
//     left: a,
//     right: b,
//     leftScore: a.scores.FINAL_RESULT || a.scores.RUNNING || '0',
//     rightScore: b.scores.FINAL_RESULT || b.scores.RUNNING || '0',
//   };
// }

/* ------------------------------------------------
 * Logo fetching (binary -> Blob URL) with fallback
 * ------------------------------------------------ */
const objectUrlCache = new Map<string, string>();
const livescoreLogoUrl = (img_id?: string) =>
  img_id ? `https://storage.livescore.com/images/team/high/${img_id}` : '';

function useOpponentLogo(imgId?: string) {
  const lsUrl = livescoreLogoUrl(imgId);
  const proxyUrl = lsUrl ? `/api/fetch?url=${encodeURIComponent(lsUrl)}` : null;

  const cached = imgId ? objectUrlCache.get(imgId) : null;

  const { data } = useFetched<ArrayBuffer>(cached || !proxyUrl ? null : proxyUrl, {
    responseType: 'arraybuffer',
  });

  const placeholderTeam =
    'https://res.cloudinary.com/du7efjkf3/image/upload/v1758985173/placeholder-team_wwfwbr.png';

  const [src, setSrc] = useState<string>(cached || placeholderTeam);

  useEffect(() => {
    if (!imgId) {
      setSrc(placeholderTeam);
      return;
    }
    if (cached) {
      setSrc(cached);
      return;
    }
    if (!data) return;

    try {
      const blob = new Blob([data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      objectUrlCache.set(imgId, url);
      setSrc(url);
    } catch {
      setSrc(placeholderTeam);
    }
  }, [data, imgId, cached]);

  return { src };
}

function OpponentLogo({
  imgId,
  alt,
  className = '',
  teamName,
}: {
  imgId?: string;
  alt?: string;
  className?: string;
  teamName?: string;
}) {
  const { src } = useOpponentLogo(imgId);
  const SIZE = 'flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]';
  return (
    <Image
      src={getTeamLogo(teamName) || src}
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
  const [activeTab, setActiveTab] = useState('Epika');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const getKey = async () => {
      const key = await fetchAndStoreApiKey();
      setApiKey(key);
    };
    getKey();
  }, []);

  const tabs = useMemo(
    () => [
      { name: 'Epika', link: '/clansko-mostvo' },
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

  /* -------- Fetch results & fixtures from LiveScore via proxy -------- */
  const RESULTS_URL =
    `https://www.livescore.com/_next/data/${apiKey}/en/football/team/tolmin/11156/results.json?sport=football&teamName=tolmin&teamId=11156`;
  const FIXTURES_URL =
    `https://www.livescore.com/_next/data/${apiKey}/en/football/team/tolmin/11156/fixtures.json?sport=football&teamName=tolmin&teamId=11156`;

  const { data: resultsJson, loading: resultsLoading, error: resultsError } = useFetched<LivescorePayload>(
    `/api/fetch?url=${encodeURIComponent(RESULTS_URL)}`
  );
  const { data: fixturesJson, loading: fixturesLoading, error: fixturesError } = useFetched<LivescorePayload>(
    `/api/fetch?url=${encodeURIComponent(FIXTURES_URL)}`
  );

  const parsedResults: Match[] = useMemo(
    () => (resultsJson ? toMatchArray(resultsJson) : []),
    [resultsJson]
  );
  const parsedFixtures: Match[] = useMemo(
    () => (fixturesJson ? toMatchArray(fixturesJson) : []),
    [fixturesJson]
  );

  const allMatches = useMemo(() => [...parsedResults, ...parsedFixtures], [parsedResults, parsedFixtures]);

  // 🔎 Filter out games that didn't start yet
  const playedOrLiveMatches = useMemo(
    () => allMatches.filter((m) => m.o_status !== 'NOT_STARTED'),
    [allMatches]
  );

  // Seasons derived from dates (YYYY/YYYY+1) — latest first
  const seasons = useMemo(() => {
    const set = new Set<string>();
    for (const m of playedOrLiveMatches) set.add(m.season);
    return Array.from(set).sort((a, b) => parseInt(b) - parseInt(a));
  }, [playedOrLiveMatches]);

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedSeason && seasons.length) setSelectedSeason(seasons[0]);
  }, [seasons, selectedSeason]);

  // Filter to chosen season
  const seasonMatches = useMemo(
    () => (selectedSeason ? playedOrLiveMatches.filter((m) => m.season === selectedSeason) : []),
    [playedOrLiveMatches, selectedSeason]
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

  const loading = resultsLoading || fixturesLoading;
  const error = resultsError || fixturesError;

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
      </div>
      </div>

      {/* Desktop: home team name anchored at bottom of left pane */}
      <div className="hidden md:block text-3xl font-extrabold max-w-full truncate mt-auto md:text-transparent text-black">
      {left?.o_name || left?.name || 'Home'}
      </div>
    </div>
    </div>

    {/* CENTER (crests + score) */}
    <div className="justify-self-center flex flex-col items-center justify-center gap-2 mt-1 md:mt-0 text-black">
    <div className="flex items-center gap-3">
      {/* Home team logo + name (name below logo on md+) */}
      <div className="flex flex-col items-center">
      <OpponentLogo
        imgId={left?.img_id}
        alt={left?.o_name || left?.name || 'Home'}
        teamName={left?.o_name || left?.name || undefined}
      />
      <span className="hidden md:block mt-1 text-base font-semibold text-black text-center max-w-[100px] truncate">
        {left?.o_name || left?.name || 'Home'}
      </span>
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded leading-none">
      {leftScore} <span className="mx-1">:</span> {rightScore}
      </div>
      {/* Away team logo + name (name below logo on md+) */}
      <div className="flex flex-col items-center">
      <OpponentLogo
        imgId={right?.img_id}
        alt={right?.o_name || right?.name || 'Away'}
        teamName={right?.o_name || right?.name || undefined}
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
      {right?.o_name || right?.name || 'Away'}
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
