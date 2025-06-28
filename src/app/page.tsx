'use client';

import React from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/tolmin-logo.png'
import PlayerCarousel from '../components/PlayerCarousel';
import MerchItem from '@/components/MerchItem';
import { useState } from 'react';
import StadiumCarousel from '@/components/Home/StadiumCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const slides = [
  { title: "Slide 1", date: "Monday, May 19", location: "Športni park Brajda" },
  { title: "Slide 2", date: "Tuesday, May 20", location: "Central Stadium" },
  { title: "Slide 3", date: "Wednesday, May 21", location: "Arena Nova" }
];


const slideVariants : Variants = {
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

export default function Page() {

  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // +1 or -1 for slide direction

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 ">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[500px] lg:max-h-[900px] overflow-hidden">
        <MainNav />
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[500px] lg:max-h-[900px]"
          >
            <source src="/tolmin-header.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[500px] lg:max-h-[900px]"/>
        <div className="flex items-center justify-center h-screen max-h-[500px] lg:max-h-[900px] z-20 relative">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: .6 }}
            transition={{ duration: .6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-9xl z-20 font-bold text-white opacity-60 header-text select-none"
          >
            NK TOLMIN
          </motion.h1>
        </div>
      </header>
      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>

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
                            <div className='relative h-[250px]'>
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
                                  {/* Logos and VS */}
                                  <div className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                                    <Image src={logo} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain'  loading="lazy"/>
                                    <div className='min-w-[50px] flex items-center justify-center text-4xl font-bebas'>
                                      <p>VS</p>
                                    </div>
                                    <Image src={'/enemy-logo.png'} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain'  loading="lazy"/>
                                  </div>

                                  {/* Date and Location */}
                                  <div className='flex items-center flex-col justify-center p-2 font-semibold text-white'>
                                    <p className='font-semibold'>{slides[currentSlide].date}, 12:00</p>
                                    <p className='text-sm font-thin'>{slides[currentSlide].location}</p>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            </div>

                            {/* Carousel Navigation */}
                            <div className='flex justify-between items-center gap-4 mt-4'>
                              <button onClick={handlePrev} className='text-white opacity-50 text-lg hover:opacity-100 w-10 text-start cursor-pointer font-extrabold'>⟨</button>
                              <div className='flex gap-2'>
                                {slides.map((_, i) => (
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
                                  <Image src={'/enemy-logo.png'} alt="Team Logo" width={110} height={110} className='w-36 h-36 object-contain' />
                                </div>

                                <div className='flex items-center flex-col justify-center p-2 font-semibold text-white'>
                                  <p className='font-semibold'>Monday, May 19, 12:00</p>
                                  <p className='text-sm font-thin'>Športni park Brajda</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className='flex items-center flex-col justify-center p-2 pt-4 font-semibold text-white uppercase mb-4'>
                                  <h2 className='text-2xl'>SNL 3</h2>
                                </div>
                                <div className='flex items-center justify-center p-2 font-semibold text-white gap-2'>
                                  <h1 className='text-7xl text-center uppercase italic font-semibold leading-24 '>ligaška lestvica</h1>
                                </div>
                              </>
                            )
                              
                            }
                          </>
                        )}
                      </motion.div>
                    ))}

            </div>
          </section>

          {/* News Section */}
          <section className='flex flex-col min-h-[400px] p-2 px-5 gap-4 overflow-hidden border-b-3 border-gray-200 pb-12 '>
            {/* Header Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-left text-black mt-2 uppercase">
                Tekme <span className='font-semibold'>nedavne novice</span>
              </h1>
            </div>
            
            <div className='grid [grid-template-rows:1fr_1fr] lg:[grid-template-rows:1fr]  lg:[grid-template-columns:1.8fr_1.2fr] h-full gap-3'>
              {/* Main News */}
              <motion.div 
                className='relative p-5 h-full'
                initial={{  opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: .9, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src='/news.png'
                  alt="News Image"
                  fill
                  className='object-cover'
                />
                <div className='absolute w-full px-6 left-0 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50'>
                  <h1 className='text-4xl font-bold poppins max-w-[80%] leading-snug'>NOVICE SPREMLJAJTE NA NAŠI FB IN IG STRANI</h1>
                  <p className='text-right py-2'>May 22, 2025 </p>
                </div>
              </motion.div>

              {/* Additional News */}
              <div className='flex gap-3 flex-col'>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className='flex-1 min-h-[100px] max-h-[135px] border-t-4 border-gray-200 pt-3 flex gap-4 text-black hover:border-red-500 hover:text-red-600 transition-all duration-500'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1}}
                    transition={{ duration: 0.6, ease: "easeIn", delay: idx * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Image
                      src='/news.png'
                      alt='Thumb'
                      width={230}
                      height={800}
                      className='object-cover'
                    />
                    <div className='flex gap-1 flex-col w-full'>
                      <p className='text-left text-xs text-gray-500 lg:text-right'>May 22, 2025</p>
                      <h1 className='font-semibold text-lg'>TKK TOLMIN 0:4 TRIGLAV KRANJ</h1>
                    </div>
                  </motion.div>
                ))}

                <div className='border-t-4 border-gray-200 pt-3'>
                    <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#b91c1c" }}
                    whileTap={{ scale: 1 }}
                    className='w-full bg-red-700 text-white p-2 poppins uppercase cursor-pointer hover:bg-red-700'
                    >
                    See more
                    </motion.button>
                </div>

              </div>
            </div>
          </section>


          
          <section className='w-full min-h-content max-h-[930px] p-2 px-5 overflow-hidden border-b-3 border-gray-200 pb-12'>
            {/* Header Title */}
            <div className='mb-4'>
              <div className={`w-full flex items-end justify-between`}>
                <h1 className="text-4xl font-extrabold text-left text-black mt-4 uppercase">
                  Igralci
                </h1>
                <p className={`text-gray-700 cursor-pointer hover:text-red-600 transition-color duration-300`}>Prikaži vse <FontAwesomeIcon className={`text-xs`} icon={faAngleRight} /> </p>
              </div>
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
                      href="#"
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
                      href="#"
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
                <p className={`text-gray-700 cursor-pointer hover:text-red-600 transition-color duration-300`}>Obiščite trgovino <FontAwesomeIcon className={`text-xs`} icon={faAngleRight} /> </p>
              </div>
            </div>
            <MerchItem />
          </section>
      </main>
    </div>
  );
}