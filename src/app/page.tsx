'use client';

import React, { useEffect, useState } from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/tolmin-logo.png';
import PlayerCarousel from '../components/PlayerCarousel';
import MerchItem from '@/components/MerchItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faSoccerBall } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import HistoryCarousel from '@/components/Home/HistoryCarousel';
import placeholderLogo from '../../public/logo/placeholder-team.png';
import { fetchAndStoreApiKey } from "@/util/apiKey";
import { getTeamLogo } from '@/util/getTeamLogo';

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
    width: '100%',
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative',
    width: '100%',
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
    width: '100%',
  }),
};

interface NewsArticle {
  id: number;
  _id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  publishedAt: string;
}

type Match = {
  id: string;
  season: string;
  o_status: string; // FINISHED | NOT_STARTED | LIVE | raw fallback
  round: string;
  stage: { st_name: string };
  start: number; // ms epoch
  teams: Array<{
    id: string;
    img_id: string; // e.g. "enet/287782.png"
    name: string;
    o_name: string;
    pos: number; // 1 = home, 2 = away
    s_name: string;
    scores: {
      FINAL_RESULT: string;
      RUNNING: string;
    };
  }>;
};

interface FetchedData {
  code: string;
  gender: string;
  country: Array<string>;
  id: string;
  img_id: string;
  kn: string;
  o_name: string;
  s_name: string;
  sport: string;
  matches: Match[];
}

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
/* ------------------ Helpers ------------------ */

const normalizeStatus = (eps?: string) => {
  switch (eps) {
    case 'NS':
      return 'NOT_STARTED';
    case 'FT':
      return 'FINISHED';
    case 'HT':
    case '1H':
    case '2H':
    case 'ET':
    case 'PEN':
      return 'LIVE';
    default:
      return eps || '';
  }
};

// Derive "YYYY/YYYY+1" season assuming July->June
const deriveSeasonFromMs = (ms: number) => {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const start = m >= 6 ? y : y - 1;
  return `${start}/${start + 1}`;
};

// Build full Livescore URL from Img id
const livescoreLogoUrl = (img_id?: string) =>
  img_id ? `https://storage.livescore.com/images/team/high/${img_id}` : '';

function formatMatchDateMs(ms?: number | null): string {
  if (!ms) return '';
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}.${month}`;
}

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
  const has = (v: string | number | undefined) =>
    v !== undefined && v !== null && String(v).trim() !== '';
  return has(a) && has(b) ? `${a}-${b}` : '';
}

/* ------------ Mapper from Livescore JSON ------------ */
const toMatchArray = (payload: LivescorePayload): Match[] => {
  const blocks = payload?.pageProps?.initialData?.eventsByMatchType ?? [];
  const out: Match[] = [];

  for (const block of blocks) {
    const stageName: string = block?.Snm ?? '';
    const seasonFromBlock: string = block?.Sds ?? '';

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
      const season = seasonFromBlock || deriveSeasonFromMs(startMs);

      out.push({
        id: String(ev?.Eid ?? ''),
        season,
        o_status: normalized,
        round: ev?.Epr !== undefined ? String(ev.Epr) : '',
        stage: { st_name: stageName },
        start: startMs,
        teams,
      });
    }
  }
  return out;
};

/* ------------ Tolmin ordering helpers ------------ */

// Is this Tolmin?
const isTolminTeam = (t?: { id?: string; name?: string; o_name?: string }) => {
  if (!t) return false;
  if (t.id === '11156') return true;
  const n = (t.o_name || t.name || '').toString();
  return /tolmin/i.test(n);
};

// Return display order with Tolmin always left + per-side scores
function orderTolminLeft(match: Match) {
  const t1 = match.teams[0];
  const t2 = match.teams[1];

  if (isTolminTeam(t1)) {
    return {
      leftTeam: t1,
      rightTeam: t2,
      leftScore: t1.scores.FINAL_RESULT,
      rightScore: t2.scores.FINAL_RESULT,
    };
  }
  if (isTolminTeam(t2)) {
    return {
      leftTeam: t2,
      rightTeam: t1,
      leftScore: t2.scores.FINAL_RESULT,
      rightScore: t1.scores.FINAL_RESULT,
    };
  }
  // Fallback
  return {
    leftTeam: t1,
    rightTeam: t2,
    leftScore: t1.scores.FINAL_RESULT,
    rightScore: t2.scores.FINAL_RESULT,
  };
}

// Get the opponent team (the one that's NOT Tolmin)
// function getOpponent(match: Match) {
//   const opp = match.teams.find((t) => !isTolminTeam(t));
//   return opp || match.teams[1] || match.teams[0];
// }

/* ------------ Proxy image loader (Blob -> objectURL) ------------ */

// cache object URLs per img_id so we don't refetch/recreate on every render
const objectUrlCache = new Map<string, string>();

function useLivescoreLogo(imgId?: string) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!imgId) {
      setSrc(placeholderLogo.src); // fallback to local Tolmin logo
      return;
    }

    const cacheKey = imgId;
    const cached = objectUrlCache.get(cacheKey);
    if (cached) {
      setSrc(cached);
      return;
    }

    const lsUrl = livescoreLogoUrl(imgId);
    if (!lsUrl) {
      setSrc(placeholderLogo.src); // fallback to placeholder
      return;
    }

    let isCancelled = false;

    axios
      .get(`/api/fetch?url=${encodeURIComponent(lsUrl)}`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        if (isCancelled) return;
        const contentType = res.headers['content-type'] || 'image/png';
        const blob = new Blob([res.data], { type: contentType });
        const objUrl = URL.createObjectURL(blob);
        objectUrlCache.set(cacheKey, objUrl);
        setSrc(objUrl);
      })
      .catch(() => {
        if (!isCancelled) setSrc(placeholderLogo.src); // fallback to placeholder
      });

    return () => {
      isCancelled = true;
    };
  }, [imgId]);

  return src || placeholderLogo.src;
}

/** Responsive team logo.
 *  - Always uses object/blob URL (via `/api/fetch`) for non-Tolmin teams
 *  - `unoptimized` to allow blob/data URLs
 *  - Responsive sizing via Tailwind + `sizes` for correct density
 */
function TeamLogo({
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
  const src = useLivescoreLogo(imgId);

  // Responsive size classes to prevent oversized logos on small cards
  const SIZE_CLASSES =
    'flex-shrink-0 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36';

  return (
    <Image
      src={getTeamLogo(teamName) || src}
      alt={alt || 'Team Logo'}
      width={133}
      height={133}
      className={`${SIZE_CLASSES} object-contain ${className}`}
      sizes="(max-width: 480px) 64px, (max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 144px"
      unoptimized
    />
  );
}

/* ------------ Page ------------ */

export default function Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [matches, setMatches] = useState<FetchedData | null>(null);
  // const [venue, setVenue] = useState<string | null>(null);
  // const [futureVenue, setFutureVenue] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);


  useEffect(() => {
    // Store API key in state
    fetchAndStoreApiKey()
      .then((key) => setApiKey(key || null))
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error fetching API key',
          text: error?.message || 'Failed to fetch API key for matches.',
        });
      });
  }, []);

  const handleNext = () => {
    if (finishedMatches.length > 0) {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % finishedMatches.length);
    }
  };

  const handlePrev = () => {
    if (finishedMatches.length > 0) {
      setDirection(-1);
      setCurrentSlide((prev) =>
        prev === 0 ? finishedMatches.length - 1 : prev - 1
      );
    }
  };

  /* -------- fetch news -------- */
  useEffect(() => {
    axios
      .get('/api/news')
      .then((response) => {
        setNews(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error fetching news',
          text: error.message,
        });
      });
  }, []);

  /* -------- fetch matches -------- */
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const target = `https://www.livescore.com/_next/data/${apiKey}/en/football/team/tolmin/11156/results.json?sport=football&teamName=tolmin&teamId=11156`;
        const response = await axios.get(`/api/fetch?url=${encodeURIComponent(target)}`);
        const parsed: Match[] = toMatchArray(response.data);

        setMatches({
          code: '',
          gender: '',
          country: [],
          id: '',
          img_id: '',
          kn: '',
          o_name: '',
          s_name: '',
          sport: '',
          matches: parsed,
        });
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, [apiKey]);

  /* -------- derive season & filtered lists -------- */
  const currentSeason = deriveSeasonFromMs(Date.now());

  const finishedMatches: Match[] =
    matches?.matches?.filter(
      (m) => m.season === currentSeason && m.o_status === 'FINISHED'
    ) ?? [];

  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  const finishedMatchesCount = finishedMatches.length;

  // Fetch fixture for next match details
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const target = `https://www.livescore.com/_next/data/${apiKey}/en/football/team/tolmin/11156/fixtures.json?sport=football&teamName=tolmin&teamId=11156`;
        const response = await axios.get(`/api/fetch?url=${encodeURIComponent(target)}`);
        const parsed: Match[] = toMatchArray(response.data);

        setUpcomingMatches(parsed);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, [apiKey]);

  /* -------- venue fetch -------- */
  useEffect(() => {
    if (!finishedMatches.length && !upcomingMatches.length) return;


    const match = finishedMatches[currentSlide];
    if (match?.id) {
    //  const tolminTeam = match.teams.find((t) => isTolminTeam(t));
    //  setVenue(tolminTeam?.pos === 1 ? 'HOME' : 'AWAY');
    } else {
      // setVenue(null);
    }

    const futureMatch = upcomingMatches[0];
    if (futureMatch?.id) {
      // const tolminTeam = futureMatch.teams.find((t) => isTolminTeam(t));
      // setFutureVenue(tolminTeam?.pos === 1 ? 'HOME' : 'AWAY');
    } else {
      // setFutureVenue(null);
    }
  }, [finishedMatches, upcomingMatches, currentSlide]);

  // Stage names
  // const allStageNames = [...new Set(matches?.matches?.map((m) => m.stage.st_name) ?? [])];
  // const currentStageName = allStageNames[allStageNames.length - 1] ?? null;

  // Reusable responsive size classes for the static Tolmin crest
  const TOLMIN_LOGO_CLASSES =
    'flex-shrink-0 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain';

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 max-w-[100vw]">
      <header className="w-full relative h-[60vh] md:h-[80vh] lg:h-[100vh] max-h-[900px] overflow-hidden">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video/naslovna-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-60 z-10" />
        <div className="flex items-center justify-center w-full h-full z-20 relative">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-white text-center px-4 select-none"
          >
            NK TOLMIN
          </motion.h1>
        </div>
      </header>

      <main className="w-full h-fit max-w-screen-2xl bg-gray-50 border-t-4 border-red-600 px-2 sm:px-6 lg:px-10">
        {/* Match Section */}
        <section className="w-full min-h-content lg:max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12">
          {/* Header Title */}
          <div>
            <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
              Tekme <span className="font-semibold">NK tolmin</span>
            </h1>
          </div>

          {/* Card Container */}
          <div className="w-full h-fit lg:max-h-[800px] mt-4 flex gap-4 overflow-visible flex-col lg:flex-row">
            {Array.from({ length: 3 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="flex-1 bg-gray-800 p-4 shadow-md flex flex-col md:min-h-[400px] gap-2 matches-card relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {idx === 0 ? (
                  <>
                    {/* Carousel Title */}
                    <div className="flex items-center flex-col justify-center p-2 font-semibold text-white uppercase">
                      <h1 className="text-5xl font-bold font-poppins">Zadnja</h1>
                      <h2>SNL</h2>
                    </div>

                    {/* Slide Wrapper */}
                    <div className="relative h-[250px]" key={idx}>
                      <AnimatePresence custom={direction} initial={false}>
                        {finishedMatches.length > 0 ? (
                          (() => {
                            const finishedReversed = finishedMatches.slice();
                            return finishedReversed.map((match: Match, index: number) =>
                              index === currentSlide ? (
                              <motion.div
                                key={match.id || index}
                                className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                              >
                                {/* Logos and Score */}
                                <div className="flex items-center justify-center p-2 font-semibold text-white gap-2">
                                {(() => {
                                  // Determine Tolmin vs opponent and place Tolmin left only when Tolmin was HOME (pos === 1)
                                  const tolminTeam = match.teams.find((t) => isTolminTeam(t));
                                  const opponent = match.teams.find((t) => !isTolminTeam(t)) || match.teams[0];

                                  let leftTeam = match.teams[0];
                                  let rightTeam = match.teams[1];

                                  if (tolminTeam) {
                                  if (tolminTeam.pos === 1) {
                                    // Tolmin was home -> Tolmin on left
                                    leftTeam = tolminTeam;
                                    rightTeam = match.teams.find((t) => t !== tolminTeam) || opponent;
                                  } else {
                                    // Tolmin was away -> Tolmin on right
                                    rightTeam = tolminTeam;
                                    leftTeam = match.teams.find((t) => t !== tolminTeam) || opponent;
                                  }
                                  } else {
                                  // Fallback: keep original ordering but ensure readable scores
                                  const ordered = orderTolminLeft(match);
                                  leftTeam = ordered.leftTeam;
                                  rightTeam = ordered.rightTeam;
                                  }

                                  const leftScore = leftTeam?.scores?.FINAL_RESULT ?? '';
                                  const rightScore = rightTeam?.scores?.FINAL_RESULT ?? '';

                                  const leftIsTolmin = isTolminTeam(leftTeam);
                                  const rightIsTolmin = isTolminTeam(rightTeam);

                                  return (
                                  <>
                                    {/* LEFT */}
                                    <div className="flex flex-col items-center">
                                    {leftIsTolmin ? (
                                      <>
                                      <Image
                                        src={logo}
                                        alt="Tolmin"
                                        width={110}
                                        height={110}
                                        className={TOLMIN_LOGO_CLASSES}
                                        sizes="(max-width: 480px) 64px,
                                          (max-width: 640px) 80px,
                                          (max-width: 768px) 96px,
                                          (max-width: 1024px) 112px,
                                          144px"
                                        priority={false}
                                      />
                                      <p className="mt-2 text-sm font-semibold text-white">Tolmin</p>
                                      </>
                                    ) : (
                                      <>
                                      <TeamLogo
                                        imgId={leftTeam?.img_id}
                                        alt={leftTeam?.o_name || leftTeam?.name || 'Opponent Logo'}
                                        teamName={leftTeam?.o_name || leftTeam?.name || ""}
                                      />
                                      <p className="mt-2 text-sm font-semibold text-white text-center">
                                        {leftTeam?.o_name || leftTeam?.name || 'Opponent'}
                                      </p>
                                      </>
                                    )}
                                    </div>

                                    {/* SCORE */}
                                    <div className="min-w-[50px] flex items-center justify-center text-4xl font-bebas">
                                    <p
                                      className="text-4xl font-bold text-white rounded-xl px-3 py-3 shadow-lg border-2 border-red-700"
                                      style={{
                                      background:
                                        'linear-gradient(90deg, #dc2626 0%, #6b0f1a 50%, #000 100%)',
                                      boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
                                      letterSpacing: '1px',
                                      }}
                                    >
                                      {leftScore}
                                      <span className="mx-3 text-4xl mb-2 font-extrabold text-gray-200 drop-shadow">
                                      :
                                      </span>
                                      {rightScore}
                                    </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex flex-col items-center">
                                    {rightIsTolmin ? (
                                      <>
                                      <Image
                                        src={logo}
                                        alt="Tolmin"
                                        width={110}
                                        height={110}
                                        className={TOLMIN_LOGO_CLASSES}
                                        sizes="(max-width: 480px) 64px,
                                          (max-width: 640px) 80px,
                                          (max-width: 768px) 96px,
                                          (max-width: 1024px) 112px,
                                          144px"
                                        priority={false}
                                      />
                                      <p className="mt-2 text-sm font-semibold text-white">Tolmin</p>
                                      </>
                                    ) : (
                                      <>
                                      <TeamLogo
                                        imgId={rightTeam?.img_id}
                                        alt={rightTeam?.o_name || rightTeam?.name || 'Opponent Logo'}
                                        teamName={rightTeam?.o_name || rightTeam?.name || ""}
                                      />
                                      <p className="mt-2 text-sm font-semibold text-white text-center">
                                        {rightTeam?.o_name || rightTeam?.name || 'Opponent'}
                                      </p>
                                      </>
                                    )}
                                    </div>
                                  </>
                                  );
                                })()}
                                </div>

                                {/* Date and Location */}
                                <div className="flex items-center flex-col justify-center p-2 font-semibold text-white">
                                <p className="font-semibold">{formatMatchDateMs(match.start)}</p>
                                {/* <p className="text-sm font-thin">{venue}</p> */}
                                </div>
                              </motion.div>
                              ) : null
                            );
                          })()
                        ) : (
                          <motion.div
                            key="no-data"
                            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            No match data available
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Carousel Navigation */}
                    <div className="flex justify-between items-center gap-4 mt-4">
                      <button
                        onClick={handlePrev}
                        className="text-white opacity-50 text-lg hover:opacity-100 w-10 text-start cursor-pointer font-extrabold"
                      >
                        ⟨
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: finishedMatchesCount }, (_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i === currentSlide ? 'bg-white' : 'bg-gray-500 opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleNext}
                        className="text-white opacity-50 hover:opacity-100 text-end w-10 cursor-pointer text-lg font-extrabold"
                      >
                        ⟩
                      </button>
                    </div>
                  </>
                  ) : (
                    <>
                    {idx === 1 ? (
                      <>
                      <div className="flex items-center flex-col justify-center p-2 font-semibold text-white uppercase mb-4">
                        <h1 className="text-5xl font-bold font-poppins">Naslednja</h1>
                        <h2>SNL</h2>
                      </div>

                      <div className="flex items-center justify-center p-2 font-semibold text-white gap-2">
                        {(() => {
                        const next = upcomingMatches[0];
                        const tolminTeam = next?.teams.find((t) => isTolminTeam(t));
                        const opponent = next
                          ? next.teams.find((t) => !isTolminTeam(t)) || next.teams[0]
                          : undefined;

                        // If Tolmin is at pos === 1 they were HOME -> show Tolmin on left.
                        // If pos === 2 they were AWAY -> show Tolmin on right.
                        // Fallback to left.
                        const tolminOnLeft =
                          tolminTeam?.pos === 1 ? true : tolminTeam?.pos === 2 ? false : true;

                        const Left = () =>
                          tolminOnLeft ? (
                          <div className="flex flex-col items-center">
                            <Image
                            src={logo}
                            alt="Tolmin"
                            width={110}
                            height={110}
                            className={TOLMIN_LOGO_CLASSES}
                            sizes="(max-width: 480px) 64px,
                                (max-width: 640px) 80px,
                                (max-width: 768px) 96px,
                                (max-width: 1024px) 112px,
                                144px"
                            priority={false}
                            />
                            <p className="mt-2 text-sm font-semibold text-white">Tolmin</p>
                          </div>
                          ) : (
                          <div className="flex flex-col items-center">
                            <TeamLogo
                            imgId={opponent?.img_id}
                            alt={opponent?.o_name || opponent?.name || 'Opponent'}
                            teamName={opponent?.o_name || opponent?.name || ""}
                            />
                            <p className="mt-2 text-sm font-semibold text-white text-center">
                            {opponent?.o_name || opponent?.name || 'Opponent'}
                            </p>
                          </div>
                          );

                        const Right = () =>
                          tolminOnLeft ? (
                          <div className="flex flex-col items-center">
                            <TeamLogo
                            imgId={opponent?.img_id}
                            alt={opponent?.o_name || opponent?.name || 'Opponent'}
                            teamName={opponent?.o_name || opponent?.name || ""}
                            />
                            <p className="mt-2 text-sm font-semibold text-white text-center">
                            {opponent?.o_name || opponent?.name || 'Opponent'}
                            </p>
                          </div>
                          ) : (
                          <div className="flex flex-col items-center">
                            <Image
                            src={logo}
                            alt="Tolmin"
                            width={110}
                            height={110}
                            className={TOLMIN_LOGO_CLASSES}
                            sizes="(max-width: 480px) 64px,
                                (max-width: 640px) 80px,
                                (max-width: 768px) 96px,
                                (max-width: 1024px) 112px,
                                144px"
                            priority={false}
                            />
                            <p className="mt-2 text-sm font-semibold text-white">Tolmin</p>
                          </div>
                          );

                        return (
                          <>
                          {/* LEFT */}
                          <Left />

                          {/* VS */}
                          <div className="min-w-[50px] flex items-center justify-center text-4xl font-bebas">
                            <p className="text-xl md:text-2xl font-bold">VS</p>
                          </div>

                          {/* RIGHT */}
                          <Right />
                          </>
                        );
                        })()}
                      </div>

                      <div className="flex items-center flex-col justify-center p-2 font-semibold text-white">
                        <p className="font-semibold">{formatMatchDateMs(upcomingMatches[0]?.start)}</p>
                        {/* <p className="text-sm font-thin">{futureVenue || 'No venue data available'}</p> */}
                      </div>
                      </>
                    ) : (
                      <Link href="/clansko-mostvo/lestvica">
                        <div className="flex items-center flex-col justify-center p-2 pt-4 font-semibold text-white uppercase mb-4">
                          <h2 className="text-2xl">{'3. SNL'}</h2>
                        </div>
                        <div className="flex items-center justify-center p-2 font-semibold text-white gap-2">
                          <h1 className="text-7xl text-center uppercase italic font-semibold leading-24 ">
                            ligaška lestvica
                          </h1>
                        </div>
                      </Link>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* News Section */}
        <section className="flex flex-col min-h-[400px] p-2 px-5 gap-4 overflow-hidden border-b-3 border-gray-200 md:pb-12 ">
          {/* Header Title */}
          <div>
            <h1 className="text-4xl font-extrabold text-left text-black mt-2 uppercase">
              Nedavne<span className="font-semibold"> Novice</span>
            </h1>
          </div>

          <div className="flex flex-col lg:grid [grid-template-rows:.8fr_1.2fr] md:[grid-template-rows:1fr_1fr] lg:[grid-template-rows:1fr]  lg:[grid-template-columns:1.8fr_1.2fr] h-full gap-5">
            {/* Main News */}
            <motion.div
              onClick={() => (window.location.href = `/novice/${news[0]?._id}`)}
              className="relative p-5 min-h-[400px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[650px] cursor-pointer group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Image
                src={news[0]?.image || '/news.png'}
                alt={news[0]?.title || 'News Image'}
                fill
                className="object-cover w-full h-full"
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute w-full px-2 sm:px-6 left-0 bottom-0 flex flex-col justify-end text-white p-4 h-50 transition-all duration-500">
                {/* Red gradient overlay */}
                <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none z-0 transition-all duration-500 bg-gradient-to-t from-red-600/50 via-black/50 to-transparent opacity-70 group-hover:from-red-600/90 group-hover:opacity-90"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold poppins max-w-[80%] leading-snug">
                    {news[0]?.title || 'News Title'}
                  </h1>
                  <p className="text-right py-2">
                    {news[0]?.publishedAt
                      ? new Date(news[0].publishedAt).toLocaleDateString('sl-SI', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Datum ni na voljo'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Additional News */}
            <div className="flex gap-3 flex-col h-full justify-between">
              <div className="flex gap-3 flex-col flex-1">
                {news.length > 1 ? (
                  news.slice(1, 5).map((item, idx) => (
                    <motion.div
                      key={item._id || idx}
                      className="flex-1 min-h-[100px] md:max-h-[135px] border-t-4 border-gray-200 pt-3 flex flex-col sm:flex-row gap-4 text-black hover:border-red-500 hover:text-red-600 transition-all duration-500 cursor-pointer"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeIn', delay: idx * 0.2 }}
                      viewport={{ once: true }}
                      onClick={() => (window.location.href = `/novice/${item._id}`)}
                    >
                      <Image
                        src={item.image || '/news.png'}
                        alt="Thumb"
                        width={230}
                        height={800}
                        className="object-cover w-full sm:w-[200px]"
                      />
                      <div className="flex gap-1 flex-col w-full">
                        <p className="text-left text-xs text-gray-500 lg:text-right">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString('sl-SI', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : ''}
                        </p>
                        <h1 className="font-semibold text-lg">{item.title}</h1>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <motion.div
                      animate={{ y: [0, -30, 0] }}
                      transition={{ repeat: Infinity, repeatType: 'loop', duration: 1, ease: 'easeInOut' }}
                      className="mb-2"
                    >
                      <FontAwesomeIcon icon={faSoccerBall} className="text-6xl mb-2 text-red-600" spin bounce />
                    </motion.div>
                    <span className="text-lg font-semibold animate-pulse" style={{ animation: 'pulse-red-gray 2s infinite' }}>
                      No additional news to display
                    </span>
                    <style jsx global>{`
                      @keyframes pulse-red-gray {
                        0%,
                        100% {
                          color: #dc2626;
                        }
                        50% {
                          color: #6b7280;
                        }
                      }
                    `}</style>
                  </div>
                )}
              </div>
              {news.length > 5 && (
                <div className="border-t-4 border-gray-200 pt-3">
                  <motion.button
                    onClick={() => (window.location.href = '/novice')}
                    whileHover={{ scale: 1.01, backgroundColor: '#b91c1c' }}
                    whileTap={{ scale: 1 }}
                    className="w-full bg-red-700 text-white p-2 poppins uppercase cursor-pointer hover:bg-red-700"
                  >
                    Prikaže Vse
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="w-full min-h-content p-2 overflow-hidden border-b-3 border-gray-200 pb-12">
          <div className="mb-4 flex items	end justify-between">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-left text-black mt-4 uppercase">
              Ekipa
            </h1>
            <Link
              href={'/clansko-mostvo'}
              className="text-gray-700 cursor-pointer hover:text-red-600 transition-colors duration-300 text-sm md:text-base"
            >
              Prikaži vse <FontAwesomeIcon className="text-xs" icon={faAngleRight} />
            </Link>
          </div>
          <PlayerCarousel />
        </section>

        <section className="w-full min-h-content lg:max-h-[930px] p-2 px-1 overflow-hidden border-b-3 border-gray-200 pb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">zgodovina</h1>
          </div>
          <HistoryCarousel />
        </section>

        <section className="w-full min-h-content md:max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12">
          <div className="mb-4 flex items-end justify-between">
            <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">Brajda</h1>
            <Link
              href="/klub?tab=Brajda"
              className={`text-gray-700 cursor-pointer hover:text-red-600 transition-color duration-300 float-right`}
            >
              Oglejte si več <FontAwesomeIcon className={`text-xs`} icon={faAngleRight} />{' '}
            </Link>
          </div>
          <div className="w-full overflow-x-auto px-4 pb-6">
            <Link href="/klub?tab=Brajda" className="block w-full max-w-7xl mx-auto">
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
                <Image
                  src="/Stadium/stadium-latest.jpeg"
                  alt="Športni park Brajda"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority={false}
                />
              </div>
            </Link>
          </div>
        </section>

        <section className="w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12">
          <div className="mb-4">
            <div className={`w-full flex items-end justify-between`}>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">Trgovina</h1>
              <Link
                href="/trgovina"
                className={`text-gray-700 cursor-pointer hover:text-red-600 transition-color duration-300`}
              >
                Obiščite trgovino <FontAwesomeIcon className={`text-xs`} icon={faAngleRight} />{' '}
              </Link>
            </div>
          </div>
          <MerchItem />
        </section>
      </main>
    </div>
  );
}
