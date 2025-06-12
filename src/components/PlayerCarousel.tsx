import React, { useRef, useEffect, useState } from 'react';
import '../../public/styles/player-carousel.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Carousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardsPerPage = 4;
  const cards = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5', 'Card 6', 'Card 7', 'Card 8'];
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Scroll detection for dots
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const totalScroll = track.scrollWidth - track.clientWidth;
    const section = Math.round((scrollLeft / totalScroll) * (totalPages - 1));
    setActiveIndex(section);
  };

  // Scroll to dot click or arrow
  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = track.offsetWidth / cardsPerPage;
    track.scrollTo({
      left: index * cardWidth * cardsPerPage,
      behavior: 'smooth',
    });
  };

  const scrollLeftHandler = () => {
    const newIndex = Math.max(activeIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const scrollRightHandler = () => {
    const newIndex = Math.min(activeIndex + 1, totalPages - 1);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll);

    return () => {
      track.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, totalPages]);

  return (
    <div className="carousel-container select-none relative">
      {/* Left Arrow */}
      <button onClick={scrollLeftHandler} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow text-black cursor-pointer hover:text-white hover:bg-red-600 transition-colors duration-300">
        <FaArrowLeft />
      </button>

      {/* Right Arrow */}
      <button onClick={scrollRightHandler} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow text-black cursor-pointer hover:text-white hover:bg-red-600 transition-colors duration-300">
        <FaArrowRight />
      </button>

      <div className="carousel-track" ref={trackRef}>
        {cards.map((label, i) => (
          <div className="card text-black" key={i}>
            <motion.div
              className='relative p-5 h-full w-full'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true, amount: .3 }}
            >
              <h1 className='absolute top-2 right-3 text-white z-2 text-4xl font-bold poppins uppercase player-number'>
                01
              </h1>
              <Image
                src='/player1.png'
                alt="News Image"
                fill
                className='object-cover'
              />
              <div className='absolute w-full px-4 left-0 pb-5 bottom-0 bg-black/50 flex flex-col justify-end text-white p-4 bottom-red-gradient h-50 poppins'>
                <p className='-mb-3 uppercase'>Altin</p>
                <p className='text-4xl font-semibold poppins uppercase'>Manxhuka</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="dots" style={{ textAlign: 'center', marginTop: '10px' }}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={`dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => scrollToIndex(index)}
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              margin: '0 6px',
              borderRadius: '50%',
              backgroundColor: activeIndex === index ? 'red' : '#ccc',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
