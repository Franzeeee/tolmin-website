"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const historyCards = [
  { id: 1, img: "/history1.png", title: "1921 – 1971", link: "/zgodovina?tab=1921%20%E2%80%93%201971" },
  { id: 2, img: "/history2.png", title: "1971 – 1995", link: "/zgodovina?tab=1971%20%E2%80%93%201995" },
  { id: 3, img: "/zgodovina/p3.png", title: "1995 – Today", link: "/zgodovina?tab=1995%20%E2%80%93%20Today" },
  { id: 4, img: "/history4.jpg", title: "Photo History", link: "/zgodovina?tab=Photo%20History" },
];


const HistoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 2 >= historyCards.length ? 0 : prev + 2
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 2 < 0 ? historyCards.length - (historyCards.length % 2 || 2) : prev - 2
    );
  };

  return (
    <div className="relative w-full mt-4">
      {/* Carousel */}
      <div className="flex overflow-hidden gap-2">
        {historyCards
          .slice(currentIndex, currentIndex + 2)
          .map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex-1 bg-white border-b-4 border-red-600 shadow-lg group"
            >
              <a className="block" href={card.link}>
                <div className="w-full h-auto overflow-hidden">
                  <Image
                    width={400}
                    height={100}
                    src={card.img}
                    alt=""
                    className="w-full max-h-[350px] h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ display: "block", maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-red-600">
                    {card.title}
                  </h5>
                </a>
                {/* <div className="flex justify-end">
                  <a
                    
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </div> */}
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
