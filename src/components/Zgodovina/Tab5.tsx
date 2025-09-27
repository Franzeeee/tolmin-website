'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { data } from './2014_danes';

export default function Tab5() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const accordionData: AccordionItem[] = data;

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  type AccordionItem = {
    title: string;
    content: string[];
    image?: string;
    screenshot?: string;
  };
  const [modalItem, setModalItem] = useState<AccordionItem | null>(null);

  const openModal = (item: AccordionItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
  };

  return (
    <>
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
                <div className="px-4 sm:px-6 py-3 bg-white text-gray-800 flex flex-col gap-3">
                  {item.image && (
                    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px] max-h-[480px] m-auto overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="object-contain"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 650px"
                        priority
                      />
                    </div>
                  )}
                  <div className="flex flex-col w-full p-2 sm:p-4 py-0 poppins text-black">
                    {item.content.map((paragraph, i) => (
                      <p key={i} className="text-base sm:text-lg text-gray-800 mb-4 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => openModal(item)}
                    className="m-auto cursor-pointer px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors mb-5 uppercase font-semibold text-sm sm:text-base"
                  >
                    {item.title}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4">
              <h3 className="text-xl font-semibold text-center text-red-600">
                {modalItem.title}
              </h3>
              <hr className="my-4 border-gray-200" />
              {/* optional small description above image (first paragraph) */}
              <div className="flex justify-center px-4 pb-6">
                {modalItem.screenshot ? (
                    <div className="relative w-full max-w-xl h-64 sm:h-96 overflow-hidden">
                    <div
                      className="relative w-full h-full"
                      ref={(el: HTMLDivElement | null) => {
                        if (!el) return;
                        const parent = el.parentElement as HTMLDivElement | null;
                        if (!parent) return;
                        // make the modal image container taller on small screens (mobile)
                        if (typeof window !== 'undefined' && window.innerWidth < 640) {
                          parent.style.height = '28rem'; // ~448px for small screens
                        } else {
                          parent.style.height = ''; // reset for larger screens
                        }
                      }}
                      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                        const el = e.currentTarget as HTMLDivElement;
                        const rect = el.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        const img = el.querySelector('img') as HTMLImageElement | null;
                        if (img) {
                          img.style.transformOrigin = `${x}% ${y}%`;
                          img.style.transform = 'scale(2)';
                          img.style.transition = 'transform 200ms ease';
                        }
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        const img = (e.currentTarget as HTMLDivElement).querySelector('img') as HTMLImageElement | null;
                        if (img) {
                          img.style.transform = '';
                          img.style.transformOrigin = '';
                          img.style.transition = 'transform 200ms ease';
                        }
                      }}
                    >
                      <Image
                        src={modalItem.screenshot}
                        alt={modalItem.title}
                        fill
                        className="object-contain transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, 640px"
                        priority
                      />
                    </div>
                    </div>
                ) : (
                  <div className="text-gray-500">No image available</div>
                )}
              </div>
              <div className="flex justify-center pb-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
