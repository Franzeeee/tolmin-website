import React from 'react'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sponsors() {

  type Sponsor = {
    _id: string;
    name: string;
    logoUrl?: string;
    category: 'main' | 'partner' | 'support' | 'bronze';
  };
  
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get('/api/sponsors');
        setSponsors(res.data);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
      }
    };
    fetchSponsors();
  }, []);
  
  const partnerSponsors = sponsors.filter(s => s.category === 'partner');
  const bronzeSponsors = sponsors.filter(s => s.category === 'bronze');

  return (
    <section className="w-full py-8 bg-gray-950 flex flex-col items-center gap-6">
      {/* Main Sponsors */}
      <div className="w-full border-b border-gray-500 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
        {[
          '/logo/ziggrad.png',
          '/logo/hidria_logo.png',
          '/logo/coronini_logo.png',
          '/logo/herz_logo.png',
          '/logo/tkk_logo.png',
        ].map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Main sponsor ${idx + 1}`}
            width={160}
            height={160}
            className="object-contain"
          />
        ))}
      </div>

      {/* Other sponsors */}
      <div className="w-full flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10 px-4">
        {partnerSponsors.map((s) =>
          s.logoUrl ? (
            <Image
              key={s._id}
              src={s.logoUrl}
              alt={s.name}
              width={135}
              height={135}
              className="object-contain"
            />
          ) : (
            <div
              key={s._id}
              className="w-[135px] h-[135px] flex items-center justify-center bg-gray-800 text-white text-center px-2"
            >
              {s.name}
            </div>
          )
        )}

        {bronzeSponsors.map((s) =>
          s.logoUrl ? (
            <Image
              key={s._id}
              src={s.logoUrl}
              alt={s.name}
              width={135}
              height={135}
              className="object-contain"
            />
          ) : (
            <div
              key={s._id}
              className="w-[135px] h-[135px] flex items-center justify-center bg-gray-800 text-white text-center px-2"
            >
              {s.name}
            </div>
          )
        )}
      </div>
    </section>
  )
}
