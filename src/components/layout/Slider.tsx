import React from 'react';
import '../../../public/styles/slider.css'
import Image from 'next/image';

type SliderItem = {
  id: number;
  imageUrl: string;
  position: number;
};

const items: SliderItem[] = [
  { id: 1, imageUrl: 'https://via.placeholder.com/300x200?text=1', position: 1 },
  { id: 2, imageUrl: 'https://via.placeholder.com/300x200?text=2', position: 2 },
  { id: 3, imageUrl: 'https://via.placeholder.com/300x200?text=3', position: 3 },
  { id: 4, imageUrl: 'https://via.placeholder.com/300x200?text=4', position: 4 },
  { id: 5, imageUrl: 'https://via.placeholder.com/300x200?text=5', position: 5 },
];

function Slider() {
  return (
    <div
      className="slider w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,_#000_10%,_#000_90%,transparent)]"
      style={
        {
          '--height': '200px',
          '--width': '300px',
          '--duration': '20s',
          '--quantity': items.length,
        } as React.CSSProperties
      }
    >
      <div className="list flex w-full min-w-[calc(var(--width)*var(--quantity))] relative">
        {items.map((item) => (
            <div
            key={item.id}
            className="item absolute w-[var(--width)] h-[var(--height)] left-full animate-slide"
            style={
              {
              '--position': item.position,
              animationDelay: `calc((var(--duration) / var(--quantity)) * (${item.position} - 1) - var(--duration))`,
              } as React.CSSProperties
            }
            >
            <Image
              src={item.imageUrl}
              alt={`Slide ${item.id}`}
              width={300}
              height={200}
              className="w-full"
              unoptimized
            />
            </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
