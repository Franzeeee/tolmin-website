import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const images = [
  '/Stadium/Rectangle113.png',
  '/Stadium/Rectangle115.png',
  '/Stadium/Rectangle113.png',
];

function StadiumCarousel() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      const child = container.children[nextIndex];
      if (child) {
        container.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth',
        });
      }
      setCurrentIndex(nextIndex);
    }, 2000); // change image every 2.5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 hide-scroll-arrows scroll-smooth"
      style={{
        width: '100%',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarColor: '#dc2626 transparent',
        scrollbarWidth: 'thin',
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            minWidth: 'calc(100% / 2.5)',
            flexShrink: 0,
            scrollSnapAlign: 'start',
          }}
        >
          <Image
            src={src}
            alt={`Image ${i}`}
            width={200}
            height={200}
            className="w-full h-full object-contain p-4"
          />
        </div>
      ))}
    </div>
  );
}

export default StadiumCarousel;
