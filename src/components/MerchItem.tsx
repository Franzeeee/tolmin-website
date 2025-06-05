import React, { useRef, useEffect, useState } from 'react';
import '../../public/styles/player-carousel.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const MerchItem: React.FC = () => {
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
      <button onClick={scrollLeftHandler} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow text-black cursor-pointer">
        <FaArrowLeft />
      </button>

      {/* Right Arrow */}
      <button onClick={scrollRightHandler} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow text-black cursor-pointer">
        <FaArrowRight />
      </button>

      <div className="carousel-track" ref={trackRef}>
        {cards.map((label, i) => (
          <div className="card text-black" key={i}>
            <motion.div
              className='relative h-full w-full border-2 border-gray-200'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true, amount: .3 }}
            >
              <Image
                src='/player1.png'
                alt="News Image"
                className='object-cover'
                height={300}
                width={300}
              />
                <div className="p-5">
                  <a href="#">
                      <h5 className="mb-2 text-lg text-center tracking-tight text-gray-700">Dres NK TKK Tolmin</h5>
                  </a>
                  <a href="#" className="inline-flex justify-center items-center w-full px-3 py-2 text-lg uppercase font-medium text-center text-white bg-gray-900 hover:bg-gray-950 focus:ring-1 focus:outline-none focus:ring-gray-500">
                      Buy Now
                  </a>
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

export default MerchItem;
