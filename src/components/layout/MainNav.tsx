'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/tolmin-logo.png';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const navItems = [
  { name: "DOMOV", link: "/" },
  { name: "Sponzorji", link: "/sponzorji" },
  { name: "Nogometna šola", 
    link: "/nogometna-sola/mladinska-epike",
    dropdown: [
      { name: "Mladinske ekipe", link: "/nogometna-sola/mladinske-ekipe" },
      { name: "Vodstvo in trenerji", link: "/nogometna-sola/vodstvo-in-trenerji" },
      { name: "Aktivnosti in dokumenti", link: "/nogometna-sola/aktivnosti-in-dokumenti" },
      { name: "Nogometni kamp 1.-7. razred", link: "/nogometna-sola/nogometni-kamp-1-7-razred" },
      { name: "Nogometni kamp 6.-9. razred", link: "/nogometna-sola/nogometni-kamp-6-9-razred" }
    ]
  },
  { name: "Klub", link: "/klub" },
  { 
    name: "Zgodovina", 
    link: "/zgodovina",
  },
  { name: "Člansko moštvo", 
    link: "/clansko-mostvo",
    dropdown: [
      { name: "Člansko moštvo – ekipa", link: "/clansko-mostvo" },
      { name: "Tekme", link: "/clansko-mostvo/tekme" },
      { name: "Statistika", link: "/zgodovina/statistika" },
    ]
  },
  { name: "Arhiv", link: "/arhiv" },
  { name: "Trgovina", link: "/trgovina" },
];


export default function MainNav() {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // const [activeSubIndex, setActiveSubIndex] = useState<string | null>(null);


  const updateUnderline = (element: HTMLElement) => {
    const navRect = navRef.current!.getBoundingClientRect();
    const left = element.getBoundingClientRect().left - navRect.left;
    const width = element.offsetWidth;
    setUnderlineStyle({ left, width }); 
  };

  useEffect(() => {
    const currentPath = pathname;
    const foundIndex = navItems.findIndex((item) => item.link === currentPath || (item.dropdown && item.dropdown.some(subItem => subItem.link === currentPath))); ;
    let subItemIndex = -1;

    navItems.findIndex((item) => {
      if (item.dropdown) {
        subItemIndex = item.dropdown.findIndex(subItem => subItem.link === currentPath);
        return subItemIndex !== -1;
      }
      return false;
    });
    console.log(currentPath)
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);    }
  }, [pathname]);


  useEffect(() => {
    if (navRef.current) {
      const links = navRef.current.querySelectorAll('a');
      // If hovering, underline the hovered link
      if (hoveredIndex !== null && links[hoveredIndex]) {
        updateUnderline(links[hoveredIndex] as HTMLElement);
      } else {
        const activeLink = links[activeIndex] as HTMLElement;
        if (activeLink) updateUnderline(activeLink);
      }
    }
  }, [activeIndex, isScrolled, hoveredIndex]);



useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    updateUnderline(e.currentTarget);
  };

  const handleMouseLeave = () => {
    // Only restore if not hovering over any nav item or dropdown
    if (!navRef.current?.matches(':hover')) {
      const links = navRef.current?.querySelectorAll('a');
      const activeLink = links?.[activeIndex] as HTMLElement;
      if (activeLink) updateUnderline(activeLink);
    }
  };

  const restoreUnderlineToActive = () => {
    const links = navRef.current?.querySelectorAll('a');
    const activeLink = links?.[activeIndex] as HTMLElement;
    if (activeLink) {
      updateUnderline(activeLink);
    }
  };


  


  return (
<div className={`${isScrolled ? "bg-white text-black shadow-md fixed top-0 z-50 pt-3" : "relative bg-red-fade text-black py-5"} w-full z-40 transition-colors duration-300 ease-in-out`}>
      <nav
        ref={navRef}
        role="navigation"
        className={`flex items-center ${isScrolled ? "justify-around gap-14" : "justify-between"} max-w-6xl mx-auto px-4 pb-3 pt-4 border-b border-gray-400 relative w-full z-20`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left nav */}
        <div className={`flex ${isScrolled ? "gap-8" : "gap-7"} flex-shrink-0 items-end relative`}>
          {navItems.slice(0, 4).map((item, i) => {
            const index = i;
            const hasDropdown = item.dropdown && item.dropdown.length > 0;

            return (
              <div
                key={index}
                className="relative"
                onMouseLeave={() => {
                  setTimeout(() => {
                    const dropdown = document.querySelector(`.dropdown-${index}`);
                    const isHoveringDropdown = dropdown?.matches(':hover');
                    const isHoveringNav = navRef.current?.matches(':hover');
                    
                    if (!isHoveringDropdown && !isHoveringNav) {
                      setHoveredIndex(null);
                      restoreUnderlineToActive();
                    }
                  }, 100);
                }}
              >
                <Link
                  href={item.link}
                  onMouseEnter={(e) => {
                    setHoveredIndex(index);
                    handleMouseEnter(e);
                  }}
                  onClick={() => setActiveIndex(index)}
                  aria-current={activeIndex === index ? "page" : undefined}
                  className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 pb-3 ${
                    activeIndex === index ? "text-red-600" : isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  {item.name}
                </Link>

                {hasDropdown && hoveredIndex === index && (
                  <div 
                    className={`dropdown-${index} absolute top-full left-0 bg-white shadow-md z-30 w-48 mt-[.85rem]`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => {
                      // Only close if not hovering the parent item
                      setTimeout(() => {
                        const parent = document.querySelector(`[data-index="${index}"]`);
                        if (!parent?.matches(':hover')) {
                          setHoveredIndex(null);
                          restoreUnderlineToActive();
                        }
                      }, 100);
                    }}
                  >
                    {item.dropdown.map((subItem, subIndex) => {
                      const isActive = subItem.link === pathname;
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.link}
                          className={`block px-4 py-3 text-sm ${
                            isActive
                              ? 'bg-red-500 text-white'
                              : 'text-gray-700 hover:text-white hover:bg-red-500'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logo center */}
        <div className={`${isScrolled ? "mt-5" : " top-1/2 "} left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-30 pointer-events-none max-w-fit transition-all duration-200 ease-in-out`} style={isScrolled ? { top: '0' } : { top: '110%' }}>
          <Image src={logo} alt="Tolmin Logo" width={isScrolled ? 60 : 100} height={50} />
        </div>

        {/* Right nav */}
        <div className={`flex ${isScrolled ? "gap-8" : "gap-7"} flex-shrink-0 items-end relative`}>
          {navItems.slice(4).map((item, i) => {
            const index = i + 4;
            const hasDropdown = item.dropdown && item.dropdown.length > 0;

            return (
              <div
                key={index}
                className="relative"
                onMouseLeave={() => {
                  setTimeout(() => {
                    const dropdown = document.querySelector(`.dropdown-${index}`);
                    const isHoveringDropdown = dropdown?.matches(':hover');
                    const isHoveringNav = navRef.current?.matches(':hover');
                    
                    if (!isHoveringDropdown && !isHoveringNav) {
                      setHoveredIndex(null);
                      restoreUnderlineToActive();
                    }
                  }, 100);
                }}
              >
                <Link
                  href={item.link}
                  onMouseEnter={(e) => {
                    setHoveredIndex(index);
                    handleMouseEnter(e);
                  }}
                  onClick={() => setActiveIndex(index)}
                  aria-current={activeIndex === index ? "page" : undefined}
                  className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 pb-3 ${
                    activeIndex === index ? "text-red-600" : isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  {item.name}
                </Link>

                {hasDropdown && hoveredIndex === index && (
                  <div 
                    className={`dropdown-${index} absolute top-full left-0 bg-white shadow-md z-30 w-48 mt-[.85rem]`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => {
                      // Only close if not hovering the parent item
                      setTimeout(() => {
                        const parent = document.querySelector(`[data-index="${index}"]`);
                        if (!parent?.matches(':hover')) {
                          setHoveredIndex(null);
                          restoreUnderlineToActive();
                        }
                      }, 100);
                    }}
                  >
                    {item.dropdown.map((subItem, subIndex) => {
                      const isActive = subItem.link === pathname;
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.link}
                          className={`block px-4 py-3 text-sm ${
                            isActive
                              ? 'bg-red-500 text-white'
                              : 'text-gray-700 hover:text-white hover:bg-red-500'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
