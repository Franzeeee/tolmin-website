import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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

  // Filter main and partner sponsors
  const mainSponsors = sponsors.filter((s) => s.category === 'main');
  const partnerSponsors = sponsors.filter((s) => s.category === 'partner');

  // Find TKK sponsor and place it in the middle
  const tkkIndex = mainSponsors.findIndex((s) => s.name.includes('TKK'));
  const orderedMainSponsors = [...mainSponsors];

  if (tkkIndex !== -1) {
    const [tkkSponsor] = orderedMainSponsors.splice(tkkIndex, 1);
    const middleIndex = Math.floor(orderedMainSponsors.length / 2);
    orderedMainSponsors.splice(middleIndex, 0, tkkSponsor);
  }

  return (
    <section className="w-full py-8 bg-white flex flex-col border-t items-center gap-6">
      {/* Main Sponsors */}
      <div className="w-full border-b border-gray-500 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4 md:pb-5">
        {orderedMainSponsors.map((s) => {
          const isTKK = s.name.includes('Tkk');
          // Container keeps fixed size so other logos don't grow
          return (
            <div
              key={s._id}
              className={`flex items-center justify-center ${
              isTKK ? 'w-[200px] h-[200px]' : 'w-[155px] h-[155px] max-h-[155px]'
              }`}
            >
              {s.logoUrl ? (
              <Image
                src={s.logoUrl}
                alt={s.name}
                width={isTKK ? 200 : 105}
                height={isTKK ? 200 : 105}
                className={`object-contain transition-all duration-300${!isTKK ? ' max-h-[135px]' : ''}`}
              />
              ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-center px-2">
                {s.name}
              </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Partner Sponsors */}
      <div className="w-full flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10 px-4">
        {partnerSponsors.map((s) =>
          s.logoUrl ? (
            <Image
              key={s._id}
              src={s.logoUrl}
              alt={s.name}
              width={105}
              height={105}
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
  );
}
