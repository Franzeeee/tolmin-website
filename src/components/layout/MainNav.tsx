'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/tolmin-logo.png';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const navItems = [
  { name: "DOMOV", link: "/" },
  { name: "Sponzorji", link: "/sponzorji" },
  { name: "Nogometna šola", link: "/nogometna-sola" },
  { name: "Klub", link: "/klub" },
  { name: "Zgodovina", link: "/zgodovina" },
  { name: "Člansko moštvo", link: "/clansko-mostvo" },
  { name: "Arhiv", link: "/arhiv" },
  { name: "Trgovina", link: "/trgovina" },
];

export default function MainNav() {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const updateUnderline = (element: HTMLElement) => {
    const navRect = navRef.current!.getBoundingClientRect();
    const left = element.getBoundingClientRect().left - navRect.left;
    const width = element.offsetWidth;
    setUnderlineStyle({ left, width }); 
  };

  useEffect(() => {
    const currentPath = pathname;
    const foundIndex = navItems.findIndex((item) => item.link === currentPath);
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }
  }, [pathname]);


  useEffect(() => {
    if (navRef.current) {
      const links = navRef.current.querySelectorAll('a');
      const activeLink = links[activeIndex] as HTMLElement;
      if (activeLink) updateUnderline(activeLink);
    }
  }, [activeIndex, isScrolled]);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    updateUnderline(e.currentTarget);
  };

  const handleMouseLeave = () => {
    const links = navRef.current?.querySelectorAll('a');
    const activeLink = links?.[activeIndex] as HTMLElement;
    if (activeLink) updateUnderline(activeLink);
  };

  return (
<div className={`${isScrolled ? "bg-white text-black shadow-md fixed top-0 z-50 pt-3" : "relative bg-red-fade text-black py-5"} w-full z-20 transition-colors duration-300 ease-in-out`}>
      <nav
        ref={navRef}
        role="navigation"
        className={`flex items-center ${isScrolled ? "justify-around gap-14" : "justify-between"} max-w-6xl mx-auto px-4 pb-3 pt-4 border-b border-gray-400 relative w-full z-20`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left nav */}
        <div className={`flex ${isScrolled ? " gap-8 " : " gap-7 "} flex-shrink-0 items-end`}>
          {navItems.slice(0, 4).map((item, i) => (
            <Link
              key={i}
              href={item.link}
              onMouseEnter={handleMouseEnter}
              onClick={() => setActiveIndex(i)}
              aria-current={activeIndex === i ? "page" : undefined}
              className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 ${
                activeIndex === i ? "font-semibold text-red-600" : isScrolled ? "text-gray-900" : "text-white" 
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Logo center */}
        <div className={`${isScrolled ? "mt-5" : " top-1/2 "} left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-20 pointer-events-none max-w-fit transition-all duration-200 ease-in-out`} style={isScrolled ? { top: '0' } : { top: '110%' }}>
          <Image src={logo} alt="Tolmin Logo" width={isScrolled ? 60 : 100} height={50} />
        </div>

        {/* Right nav */}
        <div className={`flex ${isScrolled ? " gap-8 " : " gap-7 "} flex-shrink-0 items-end`}>
          {navItems.slice(4).map((item, i) => {
            const index = i + 4;
            return (
              <Link
                key={index}
                href={item.link}
                onMouseEnter={handleMouseEnter}
                onClick={() => setActiveIndex(index)}
                aria-current={activeIndex === index ? "page" : undefined}
                className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 ${
                activeIndex === index ? " text-red-600" : isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Underline */}
        <span
          className={`absolute ${isScrolled ? 'h-1 rounded-none' : 'h-0.5 rounded-sm'} bg-red-600 transition-all duration-300`}
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
