import React, { useRef, useEffect, useState } from 'react';
import '../../public/styles/player-carousel.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

type Product = {
  id: string | number;
  label: string;
  img?: string;
};

const MerchItem: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardsPerPage = 4;
  const [cards, setCards] = useState<Product[]>([]);
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        console.log('Products fetched:', response.data);
        setCards(response.data.map((product: { _id: string | number, name: string, img?: string }) => ({
          id: product._id,
          label: product.name,
          img: product.img
        })));
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

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
        {cards.map((item, i) => (
          <div className="card text-black" key={i}>
            <motion.div
              className='relative h-full w-full border-2 border-gray-200'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true, amount: .3 }}
            >
              <div className={`w-full h-[350px] flex items-center justify-center bg-gray-200`}>
                <Image
                  src={item.img || '/Merch/item1.png'}
                  alt="News Image"
                  className='object-cover'
                  height={250}
                  width={250}
                />
              </div>
                <div className="p-5 pt-2">
                  <a href="#">
                      <h5 className="mb-2 text-lg text-center tracking-tight text-gray-700">{item.label}</h5>
                  </a>
                  <a href={`/trgovina/${item.id}`} className="inline-flex justify-center items-center w-full px-3 py-2 text-lg uppercase font-medium text-center text-white bg-gray-900 hover:bg-gray-950 focus:ring-1 focus:outline-none focus:ring-gray-500">
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
