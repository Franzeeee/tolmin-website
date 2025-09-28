"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const historyCards = [
  { id: 1, img: "/history1.png", title: "1921 – 1971", link: "/zgodovina?tab=1921%20%E2%80%93%201971" },
  { id: 2, img: "/history2.png", title: "1971 – 1995", link: "/zgodovina?tab=1971%20%E2%80%93%201995" },
  { id: 3, img: "/zgodovina/p3.png", title: "1995 – 2014", link: "/zgodovina?tab=1995%20%E2%80%93%202014" },
  { id: 4, img: "/zgodovina/sezona-img/2017-2018.jpg", title: "2014 – Danes", link: "/zgodovina?tab=2014%20%E2%80%93%20Danes" },
  { id: 5, img: "/history4.jpg", title: "Foto Zgodovina", link: "/zgodovina?tab=Foto%20Zgodovina" },
];

const HistoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const len = historyCards.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2) % len);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 + len) % len);
  };

  // Always show exactly two cards, wrapping around
  const visibleCards = [
    historyCards[currentIndex],
    historyCards[(currentIndex + 1) % len],
  ];

  return (
    <div className="relative w-full mt-4">
      {/* Carousel */}
      <div className="flex overflow-hidden gap-2">
        {visibleCards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="basis-1/2 flex-shrink-0 bg-white border-b-4 border-red-600 shadow-lg group"
          >
            <a className="block" href={card.link}>
              <div className="w-full h-auto overflow-hidden">
                <Image
                  width={400}
                  height={100}
                  src={card.img}
                  alt={card.title}
                  className="w-full max-h-[350px] h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ display: "block", maxWidth: "100%", height: "auto" }}
                />
              </div>
            </a>
            <div className="p-5">
              <a href={card.link}>
                <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                  {card.title}
                </h5>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-white text-gray-900 rounded-full hover:text-gray-950"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-white text-gray-900 rounded-full hover:text-gray-950"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default HistoryCarousel;
