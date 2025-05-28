'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/tolmin-logo.png';

const navItems = [
  "DOMOV", "Sponzorji", "Nogometna šola", "Klub",
  "Zgodovina","Člansko moštvo", "Arhiv", "Trgovina",
];

export default function MainNav() {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const updateUnderline = (element: HTMLElement) => {
    const navRect = navRef.current!.getBoundingClientRect();
    const left = element.getBoundingClientRect().left - navRect.left;
    const width = element.offsetWidth;
    setUnderlineStyle({ left, width }); 
  };

  useEffect(() => {
    if (navRef.current) {
      const links = navRef.current.querySelectorAll('a');
      const activeLink = links[activeIndex] as HTMLElement;
      if (activeLink) updateUnderline(activeLink);
    }
  }, [activeIndex]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    updateUnderline(e.currentTarget);
  };

  const handleMouseLeave = () => {
    const links = navRef.current?.querySelectorAll('a');
    const activeLink = links?.[activeIndex] as HTMLElement;
    if (activeLink) updateUnderline(activeLink);
  };

  return (
    <div className="w-full py-5 bg-red-fade text-black relative">
      <nav
        ref={navRef}
        role="navigation"
        className="flex items-center justify-between max-w-6xl mx-auto px-4 pb-3 pt-4 border-b border-gray-400 relative w-full"
        onMouseLeave={handleMouseLeave}
      >
        {/* Left nav */}
        <div className="flex gap-7 flex-shrink-0 items-end">
          {navItems.slice(0, 4).map((item, i) => (
            <a
              key={i}
              href="#"
              onMouseEnter={handleMouseEnter}
              onClick={() => setActiveIndex(i)}
              aria-current={activeIndex === i ? "page" : undefined}
              className={`relative z-10 cursor-pointer px-2 ${
                activeIndex === i ? "font-semibold text-red-600" : "text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Logo center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none max-w-fit" style={{top: "110%"}}>
          <Image src={logo} alt="Tolmin Logo" width={100} height={50} />
        </div>

        {/* Right nav */}
        <div className="flex gap-6 flex-shrink-0 items-end justify-content-end">
          {navItems.slice(4).map((item, i) => {
            const index = i + 4;
            return (
              <a
                key={index}
                href="#"
                onMouseEnter={handleMouseEnter}
                onClick={() => setActiveIndex(index)}
                aria-current={activeIndex === index ? "page" : undefined}
                className={`relative z-10 cursor-pointer px-2 ${
                  activeIndex === index ? "font-semibold text-red-600" : "text-white"
                }`}
              >
                {item}
              </a>
            );
          })}
        </div>

        {/* Underline */}
        <span
          className="absolute rounded-sm h-0.5 bg-red-600 transition-all duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
            bottom: "-2px",
          }}
        />
      </nav>

    </div>
  );
}
