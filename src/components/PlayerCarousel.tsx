import React, { useRef, useEffect, useState } from 'react';
import '../../public/styles/player-carousel.css';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Carousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Scroll to dot click
  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = track.offsetWidth / cardsPerPage;
    track.scrollTo({
      left: index * cardWidth * cardsPerPage,
      behavior: 'smooth',
    });
  };

  // Mouse/Touch drag logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    if (!trackRef.current) return;

    setIsDragging(true);
    setStartX(pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !trackRef.current) return;

    const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
    const x = pageX - trackRef.current.offsetLeft;
    const walk = x - startX;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Add scroll listener for active index tracking
    track.addEventListener('scroll', handleScroll);

    // Add move listeners for drag
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, startX, scrollLeft, totalPages]);

  return (
    <div className="carousel-container select-none">
      <div
        className="carousel-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {cards.map((label, i) => (
          <div className="card text-black" key={i}>
            <motion.div 
              className='relative p-5 h-full w-full'
              initial={{  opacity: 0 }}
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
              backgroundColor: activeIndex === index ? '#333' : '#ccc',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
