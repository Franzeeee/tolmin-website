'use client'

import React, { useState, useRef, useEffect } from "react";

const navItems = ["Nav 1", "Nav 2", "Nav 3", "Nav 4"];

export default function MainNav() {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0); // default active tab is first
  const navRef = useRef<HTMLDivElement>(null);

  // Update underline to active tab on mount and activeIndex change
  useEffect(() => {
    if (!navRef.current) return;
    const links = navRef.current.querySelectorAll('a');
    if (links.length === 0) return;

    const activeLink = links[activeIndex];
    const navRect = navRef.current.getBoundingClientRect();
    const left = activeLink.getBoundingClientRect().left - navRect.left;
    const width = activeLink.offsetWidth;
    setUnderlineStyle({ left, width });
  }, [activeIndex]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navRef.current) return;
    const target = e.currentTarget;
    const navRect = navRef.current.getBoundingClientRect();
    const left = target.getBoundingClientRect().left - navRect.left;
    const width = target.offsetWidth;
    setUnderlineStyle({ left, width });
  };

  const handleMouseLeave = () => {
    // On mouse leave, reset underline to active tab
    if (!navRef.current) return;
    const links = navRef.current.querySelectorAll('a');
    if (links.length === 0) return;

    const activeLink = links[activeIndex];
    const navRect = navRef.current.getBoundingClientRect();
    const left = activeLink.getBoundingClientRect().left - navRect.left;
    const width = activeLink.offsetWidth;
    setUnderlineStyle({ left, width });
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full py-5 bg-red-fade text-black relative">
      <nav
        ref={navRef}
        className="flex items-center justify-center gap-16 max-w-6xl mx-auto px-4 pb-3 pt-4 border-b border-gray-600 relative"
        onMouseLeave={handleMouseLeave}
      >
        {/* Left nav */}
        <div className="flex gap-8">
          {navItems.map((item, i) => (
            <a
              key={i}
              href="#"
              onMouseEnter={handleMouseEnter}
              onClick={() => handleClick(i)}
              className={`relative z-10 cursor-pointer px-5 ${
                i === activeIndex ? "font-semibold" : ""
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide z-10">LOGO HERE</div>

        {/* Right nav */}
        <div className="flex gap-8">
          {navItems.map((item, i) => (
            <a
              key={i + 100}
              href="#"
              onMouseEnter={handleMouseEnter}
              onClick={() => handleClick(i)}
              className={`relative z-10 cursor-pointer px-5 ${
                i === activeIndex ? "font-semibold" : ""
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Sliding underline */}
        <span
          className="absolute rounded-md -bottom-0.5 h-1 bg-red-600 transition-all duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
        />
      </nav>
    </div>
  );
}
