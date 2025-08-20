'use client';

import React, { useEffect, useState } from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/tolmin-logo.png';
import PlayerCarousel from '../components/PlayerCarousel';
import MerchItem from '@/components/MerchItem';
import StadiumCarousel from '@/components/Home/StadiumCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faSoccerBall } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';

const slides = [
  { title: "Slide 1", date: "Monday, May 19", location: "Športni park Brajda" },
  { title: "Slide 2", date: "Tuesday, May 20", location: "Central Stadium" },
  { title: "Slide 3", date: "Wednesday, May 21", location: "Arena Nova" }
];

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
  image: string
  publishedAt: string;
}

interface Match {
  id: string;
  season: string;
  o_status: string;
  round: string;
  stage: {
    st_name: string;
  }
  start: number;
  teams: Array<{
    id: string;
    img_id: string;
    name: string;
    o_name: string;
    pos: number;
    s_name: string;
    scores: {
      FINAL_RESULT: string;
      RUNNING: string;
    }
  }>;
}

interface fetchedData {
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

export default function Page() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (finishedMatchesCount > currentSlide) {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };
  const handlePrev = () => {
    if (finishedMatchesCount > currentSlide) {
      setDirection(-1);
      setCurrentSlide((prev) => (prev - 1) % slides.length);
    }
  };

  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    axios.get('/api/news')
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

  const [matches, setMatches] = useState<fetchedData | null>(null);
  const currentSeason = `${new Date().getFullYear().toString()}/${(new Date().getFullYear() + 1).toString()}`;
  const finishedMatchesCount = (matches?.matches?.filter((match: Match) => match.season === currentSeason && match.o_status.includes("FINISHED")) ?? []).length;
  const currentSeasonMatches = matches?.matches?.filter((match: Match) => match.season === currentSeason) ?? [];
  const [venue, setVenue] = useState<string | null>(null);
  const [futureVenue, setFutureVenue] = useState<string | null>(null);

  useEffect(() => {
    if(matches) {
      const matchInfo = axios.get(`/api/fetch?url=https://int.soccerway.com/v1/english/match/soccer/full/${currentSeasonMatches[currentSlide -1].id}/`);
      const futureMatchInfo = axios.get(`/api/fetch?url=https://int.soccerway.com/v1/english/match/soccer/full/${currentSeasonMatches[currentSlide].id}/`);

      matchInfo.then(response => {
        setVenue(response.data.venue.detail.name || "No venue data available");
      });
      futureMatchInfo.then(response => {
        setFutureVenue(response.data.venue.detail.name || "No venue data available");
      });
    }
    console.log(currentSeasonMatches[currentSlide]);
  }, [matches, currentSlide]);

    // ✅ Updated format function
  function formatMatchDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // convert seconds → ms

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

      const day = days[date.getUTCDay()];
    const d = date.getUTCDate().toString().padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${day}, ${month} ${d}, ${hours}:${minutes}`;
  }

  useEffect(()=> {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/fetch?url=https://int.soccerway.com/v1/english/participant/soccer/full/11005/');
        setMatches(response.data);
        console.log('Matches fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  },[]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="w-full relative h-[60vh] md:h-[80vh] lg:h-[100vh] max-h-[900px] overflow-hidden">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/tolmin-header.mp4" type="video/mp4" />
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
          <section className='w-full min-h-content lg:max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                Tekme <span className='font-semibold'>NK tolmin</span>
              </h1>
            </div>

            {/* Card Container */}
            <div className='w-full h-fit lg:max-h-[800px] mt-4 flex gap-4 overflow-visible flex-col lg:flex-row'>

              {Array.from({ length: 3 }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        className='flex-1 bg-gray-800 p-4 shadow-md flex flex-col md:min-h-[400px] gap-2 matches-card relative overflow-hidden'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: .6, ease: "easeOut", delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {idx === 0 ? (
                          <>
                            {/* Carousel Title */}
                            <div className='flex items-center flex-col justify-center p-2 font-semibold text-white uppercase'>
                              <h1 className='text-5xl font-bold font-poppins'>PreJSJA</h1>
                              <h2>SNL</h2>
                            </div>

                            {/* Slide Wrapper */}
                            <div className='relative h-[250px]' key={idx}>
                              <AnimatePresence custom={direction} initial={false}>
                                <motion.div
                                  key={currentSlide}
                                  className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
                                  custom={direction}
                                  variants={slideVariants}
                                  initial="enter"
                                  animate="center"
                                  exit="exit"
                                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                  { matches?.matches && matches.matches.length > 0 ? matches?.matches.filter((match: Match) => match.season  === currentSeason && match.o_status.includes("FINISHED")).map((match: Match, index: number) => (
                                    <>
                                      {/* Logos and VS */}
                                        <div key={index} className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                                          <Image src={logo} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain'  loading="lazy"/>
                                          <div className='min-w-[50px] flex items-center justify-center text-4xl font-bebas'>
                                            <p>VS</p>
                                          </div>
                                          <Image src={`https://static.soccerway.com/team/${match?.teams?.[1].img_id}/participant-logo-mobile-100x100/image.png`} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain'  loading="lazy"/>
                                        </div>

                                        {/* Date and Location */}
                                        <div className='flex items-center flex-col justify-center p-2 font-semibold text-white'>
                                          <p className='font-semibold'>{formatMatchDate(match.start)}</p>
                                          <p className='text-sm font-thin'>{venue}</p>
                                        </div>
                                    </>
                                  )) : (
                                    <p className='text-white'>No match data available</p>
                                  )}
                                </motion.div>
                              </AnimatePresence>
                            </div>

                            {/* Carousel Navigation */}
                            <div className='flex justify-between items-center gap-4 mt-4'>
                              <button onClick={handlePrev} className='text-white opacity-50 text-lg hover:opacity-100 w-10 text-start cursor-pointer font-extrabold'>⟨</button>
                              <div className='flex gap-2'>
                                {Array.from({ length: finishedMatchesCount }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${i === currentSlide ? 'bg-white' : 'bg-gray-500 opacity-50'}`}
                                  />
                                ))}
                              </div>
                              <button onClick={handleNext} className='text-white opacity-50 hover:opacity-100 text-end w-10 cursor-pointer text-lg font-extrabold'>⟩</button>
                            </div>
                          </>
                        ) : (
                          <>

                            {idx == 1 ? (
                              <>
                                <div className='flex items-center flex-col justify-center p-2 font-semibold text-white uppercase mb-4'>
                                  <h1 className='text-5xl font-bold font-poppins'>prihajajoče</h1>                              
                                  <h2>SNL</h2>
                                </div>
                                <div className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                                  <Image src={logo} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain' />
                                  <div className='min-w-[50px] flex items-center justify-center text-4xl font-bebas'>
                                    <p>VS</p>
                                  </div>
                                  <Image src={`https://static.soccerway.com/team/${currentSeasonMatches[currentSlide]?.teams?.[0]?.img_id}/participant-logo-mobile-100x100/image.png`} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain' />
                                </div>

                                <div className='flex items-center flex-col justify-center p-2 font-semibold text-white'>
                                  <p className='font-semibold'>{formatMatchDate(currentSeasonMatches[currentSlide]?.start)}</p>
                                  <p className='text-sm font-thin'>{futureVenue || "No venue data available"}</p>
                                </div>
                              </>
                            ) : (
                              <Link href="/clansko-mostvo/lestvica">
                                <div className='flex items-center flex-col justify-center p-2 pt-4 font-semibold text-white uppercase mb-4'>
                                  <h2 className='text-2xl'>SNL 3</h2>
                                </div>
                                <div className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                                  <h1 className='text-7xl text-center uppercase italic font-semibold leading-24 '>ligaška lestvica</h1>
                                </div>
                              </Link>
                            )
                              
                            }
                          </>
                        )}
                      </motion.div>
                    ))}

            </div>
          </section>

          {/* News Section */}
          <section className='flex flex-col min-h-[400px] p-2 px-5 gap-4 overflow-hidden border-b-3 border-gray-200 md:pb-12 '>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-2 uppercase">
                Tekme <span className='font-semibold'>nedavne novice</span>
              </h1>
            </div>

            <div className='flex flex-col lg:grid [grid-template-rows:.8fr_1.2fr] md:[grid-template-rows:1fr_1fr] lg:[grid-template-rows:1fr]  lg:[grid-template-columns:1.8fr_1.2fr] h-full gap-5'>
              {/* Main News */}
              <motion.div
                onClick={() => (window.location.href = `/novice/${news[0]?._id}`)}
                className='relative p-5 min-h-[400px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[650px] cursor-pointer group'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: .9, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src={news[0]?.image || '/news.png'}
                  alt={news[0]?.title || 'News Image'}
                  fill
                  className='object-cover w-full h-full'
                  style={{ objectFit: 'cover' }}
                />
                <div className='absolute w-full px-2 sm:px-6 left-0 bottom-0 flex flex-col justify-end text-white p-4 h-50 transition-all duration-500'>
                  {/* Red gradient overlay */}
                  <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none z-0 transition-all duration-500 bg-gradient-to-t from-red-600/50 via-black/50 to-transparent opacity-70 group-hover:from-red-600/90 group-hover:opacity-90"></div>
                  <div className="relative z-10">
                    <h1 className='text-4xl font-bold poppins max-w-[80%] leading-snug'>{news[0]?.title || 'News Title'}</h1>
                    <p className='text-right py-2'>
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
                        className="flex-1 min-h-[100px] md:max-h-[135px] border-t-4 border-gray-200 pt-3 flex flex-col sm:flex-row gap-4 text-black hover:border-red-500 hover:text-red-600 transition-all duration-500"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeIn", delay: idx * 0.2 }}
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
                      animate={{
                        y: [0, -30, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1,
                        ease: "easeInOut",
                      }}
                      className="mb-2"
                      >
                      <FontAwesomeIcon icon={faSoccerBall} className="text-6xl mb-2 text-red-600" spin bounce />
                      </motion.div>
                      <span
                        className="text-lg font-semibold animate-pulse"
                        style={{
                          animation: "pulse-red-gray 2s infinite"
                        }}
                      >
                        No additional news to display
                      </span>
                      <style jsx global>{`
                        @keyframes pulse-red-gray {
                          0%, 100% {
                            color: #dc2626; /* red-600 */
                          }
                          50% {
                            color: #6b7280; /* gray-500 */
                          }
                        }
                      `}</style>
                    </div>
                    )}
                </div>
                {news.length > 6 && (
                  <div className="border-t-4 border-gray-200 pt-3">
                    <motion.button
                      onClick={() => (window.location.href = '/novice')}
                      whileHover={{ scale: 1.01, backgroundColor: "#b91c1c" }}
                      whileTap={{ scale: 1 }}
                      className="w-full bg-red-700 text-white p-2 poppins uppercase cursor-pointer hover:bg-red-700"
                    >
                      See more
                    </motion.button>
                  </div>
                )}
              </div>

              </div>
          </section>


          
<section className="w-full min-h-content p-2 overflow-hidden border-b-3 border-gray-200 pb-12">
          <div className="mb-4 flex items-end justify-between">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-left text-black mt-4 uppercase">
              Igralci
            </h1>
            <Link href={'/clansko-mostvo'} className="text-gray-700 cursor-pointer hover:text-red-600 transition-colors duration-300 text-sm md:text-base">
              Prikaži vse <FontAwesomeIcon className="text-xs" icon={faAngleRight} />
            </Link>
          </div>
          <PlayerCarousel />
        </section>

          <section className='w-full min-h-content lg:max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                zgodovina
              </h1>
            </div>

            <div className='w-full h-fit lg:max-h-[800px] mt-4 flex gap-6 overflow-visible flex-col lg:flex-row'>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut"}}
                viewport={{ once: true, amount: .3 }}
                className="flex-1 bg-white border-b-4 border-red-600 shadow-lg group"
              >
                <a className="block">
                  <div className="w-full h-auto overflow-hidden">
                    <Image
                      width={400}
                      height={100}
                      src="/history1.png"
                      alt=""
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                      1921 – 1971
                    </h5>
                  </a>
                  <p className="mb-3 text-3xl text-black poppins">
                    The History of Nk Tolmin
                  </p>
                  <div className="flex justify-end">
                    <a
                      href="/zgodovina"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Read more
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut"}}
                viewport={{ once: true, amount: .3 }}
                className="flex-1 bg-white border-b-4 border-red-600 shadow-lg group"
              >
                <a className="block">
                  <div className="w-full h-auto overflow-hidden">
                    <Image
                      width={400}
                      height={100}
                      src="/history2.png"
                      alt=""
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                      1971 – 1995
                    </h5>
                  </a>
                  <p className="mb-3 text-3xl text-black poppins">
                    The History of Nk Tolmin
                  </p>
                  <div className="flex justify-end">
                    <a
                      href="/zgodovina"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Read more
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div className='mb-4'>
              <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                Brajda
              </h1>
            </div>
            <div className="w-full overflow-x-auto px-4 pb-6">
              <StadiumCarousel />
            </div>
            <div className={`w-full p-2 px-7 poppins text-justify flex flex-col gap-4 text-gray-900`}> 
                <p>
                  <span className='font-bold text-black'>Športni park Brajda</span> je že dolga desetletja dom tolminskih nogometašev. V letu 1962 je Občinska zveza za telesno vzgojo v Tolminu finančno podprla izgradnjo novega stadiona, ki je bil svečano odprt leta 1967.
                </p>
                <p>
                  Športni park Brajda meri 38.787 m2. Park obsega atletski in nogometni stadion, zunanja športna igrišča, teniški igrišči in spremljajoče objekte. Nogometni stadion ima glavno in pomožno nogometno igrišče. Tribuna ima 250 sedežev. Športni kompleks je namenjen šolski športni vzgoji, športni vadbi in tekmovanjem v atletiki, nogometu, malem nogometu, košarki, rokometu, tenisu in odbojki na mivki ter športni rekreaciji. Vsako leto športni park obišče 21.000 uporabnikov in obiskovalcev.
                </p>
                <p>Leta 2014 je bil nogometni stadion na Brajdi posodobljen za potrebe nastopanja članskega moštva v 2.SNL.</p>
            </div>
          </section>

          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden pb-12'>
            {/* Header Title */}
            <div className='mb-4'>
              <div className={`w-full flex items-end justify-between`}>
                <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                  Trgovina
                </h1>
                <Link href="/trgovina" className={`text-gray-700 cursor-pointer hover:text-red-600 transition-color duration-300`}>Obiščite trgovino <FontAwesomeIcon className={`text-xs`} icon={faAngleRight} /> </Link>
              </div>
            </div>
            <MerchItem />
          </section>
      </main>
    </div>
  );
}