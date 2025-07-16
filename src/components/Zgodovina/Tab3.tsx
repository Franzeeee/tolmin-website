'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function Tab3() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const accordionData = [
    {
      title: 'SEZONA 1995/1996',
      content: [
        "S to sezono se začne dvigovati uspešnost ekipe Tolmina. Vlogo glavnega trenerja članov po odstopu Slobodana Veličkovića prevzame Zvonko Peršič. Igralski kader se precej prevetri in okrepi.",
        "Erik Fon le za pol sezone, Denis Rutar pa za celo sezono odideta v drugoligaša iz Renč. Sedanji predsednik, Mitja Taljat, zaradi poškodbe izpusti celotno sezono, Uroš Jermol pa zaradi podobnih težav le jesenski del. Vasja Boškin ekipo zapusti po nekaj krogih.",
        "Rdeče-črnim se pridružijo Ramiz Jagodič, Primož Zorč, Peter Smrekar, Sebastjan Fortunat, Uroš Rutar (dvojna registracija s Primorjem), Bojan Kovač in Vasja Kovač ter nekaj mladincev, od katerih vidno vlogo odigra šele 17-letni Patrik Leban. Izboljša se udeležba in delo na treningih, konkurenca za mesto v prvi postavi je precejšnja."
      ],
      image: '/U7.png',
    },
    {
      title: 'SEZONA 1996/1997',
      content: [
        "Opis za sezono 1996/1997 - prvi odstavek.",
        "Opis za sezono 1996/1997 - drugi odstavek."
      ],
      image: '/U7.png',
    },
    {
      title: 'SEZONA 1997/1998',
      content: [
        "Opis za sezono 1997/1998 - prvi odstavek.",
        "Opis za sezono 1997/1998 - drugi odstavek."
      ],
      image: '/U7.png',
    },
  ];

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full p-4 flex flex-col gap-4 max-w-5xl text-black">
      {accordionData.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-b border-gray-200 overflow-hidden">
            <button
              onClick={() => handleToggle(idx)}
              className={`w-full cursor-pointer text-left text-xl px-4 py-3 flex justify-between items-center font-semibold transition-colors ${
                isOpen ? 'text-red-600 bg-gray-100' : 'text-red-600'
              }`}
            >
              {item.title}
              <span className="ml-2">
                {isOpen ? (
                  <FaChevronDown className="transition-transform duration-300 rotate-180" />
                ) : (
                  <FaChevronRight className="transition-transform duration-300" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="px-10 py-3 bg-white text-gray-800 flex flex-col gap-3">
                <div className="relative w-full min-h-[500px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px] m-auto shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="object-contain xl:object-cover"
                    fill
                    sizes="(max-width: 1280px) 100vw, 650px"
                    priority
                  />
                </div>
                <div className="flex flex-col w-full p-4 py-0 poppins text-black">
                  {item.content.map((paragraph, i) => (
                    <p key={i} className="text-lg text-gray-800 mb-4 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <button className="m-auto cursor-pointer px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors mb-5 uppercase font-semibold">
                  {item.title}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
