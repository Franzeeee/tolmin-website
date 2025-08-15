'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/tolmin-logo.png';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { name: "DOMOV", link: "/" },
  { name: "Sponzorji", link: "/sponzorji" },
  {
    name: "Nogometna šola",
    link: "/nogometna-sola/mladinske-ekipe",
    dropdown: [
      { name: "Mladinske ekipe", link: "/nogometna-sola/mladinske-ekipe" },
      { name: "Vodstvo in trenerji", link: "/nogometna-sola/vodstvo-in-trenerji" },
      { name: "Aktivnosti in dokumenti", link: "/nogometna-sola/aktivnosti-in-dokumenti" },
      { name: "Nogometni kamp 1.-7. razred", link: "/nogometna-sola/nogometni-kamp-1-7-razred" },
      { name: "Nogometni kamp 6.-9. razred", link: "/nogometna-sola/nogometni-kamp-6-9-razred" }
    ]
  },
  { name: "Novice", link: "/novice" },
  { name: "Zgodovina", link: "/zgodovina" },
  {
    name: "Člansko moštvo",
    link: "/clansko-mostvo",
    dropdown: [
      { name: "Člansko moštvo – ekipa", link: "/clansko-mostvo" },
      { name: "Tekme", link: "/clansko-mostvo/tekme" },
      { name: "Statistika", link: "/zgodovina/statistika" }
    ]
  },
  { name: "Klub", link: "/klub" },
  { name: "Trgovina", link: "/trgovina" }
];

export default function MainNav() {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isToggled, setIsToggled] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const updateUnderline = (element: HTMLElement) => {
    const navRect = navRef.current!.getBoundingClientRect();
    const left = element.getBoundingClientRect().left - navRect.left;
    const width = element.offsetWidth;
    setUnderlineStyle({ left, width });
  };

useEffect(() => {
  const currentPath = pathname;
  
  // Find the index of the active item
  let foundIndex = -1;
  
  navItems.forEach((item, index) => {
    // Check if current path matches the main link exactly
    if (currentPath === item.link) {
      foundIndex = index;
    }
    // Check if current path starts with the main link (for nested routes)
    else if (currentPath.startsWith(item.link + '/') || 
            (item.link !== '/' && currentPath.startsWith(item.link))) {
      foundIndex = index;
    }
    // Check dropdown items
    else if (item.dropdown && item.dropdown.some(subItem => 
      currentPath === subItem.link || 
      currentPath.startsWith(subItem.link + '/'))) {
      foundIndex = index;
    }
  });

  if (foundIndex !== -1) {
    setActiveIndex(foundIndex);
  }
}, [pathname]);

  useEffect(() => {
    if (navRef.current) {
      const links = navRef.current.querySelectorAll('a');
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
    <>
      <div className={`lg:block ${isScrolled || isToggled ? "bg-white text-black shadow-md fixed top-0 z-50 lg:pt-4" : "relative bg-red-fade text-black lg:py-5"} w-screen z-40 transition-colors duration-300 ease-in-out`}>
        <nav
          ref={navRef}
          role="navigation"
          className={`flex items-center ${isScrolled || isToggled ? "justify-between lg:gap-14" : "lg:justify-between justify-between"} max-w-6xl mx-auto px-3 py-5 md:px-9 lg:px-4 lg:pb-3 lg:pt-4 border-b border-gray-400 relative w-full z-20`}
          onMouseLeave={handleMouseLeave}
        >
          {/* Desktop Left Nav */}
          <div className={`hidden lg:flex ${isScrolled || isToggled ? "gap-8 lg:gap-3 xl:gap-6 uppercase" : "gap-7 lg:gap-3 xl:gap-7"} flex-shrink-0 items-end relative`}>
            {navItems.slice(0, 4).map((item, i) => {
              const index = i;
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              return (
                <div key={index} className="relative"
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
                  }}>
                  <Link
                    href={item.link}
                    onMouseEnter={(e) => {
                      setHoveredIndex(index);
                      handleMouseEnter(e);
                    }}
                    onClick={() => setActiveIndex(index)}
                  className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 pb-3 ${
                    activeIndex === index || 
                    pathname === item.link || 
                    (item.link !== '/' && pathname.startsWith(item.link + '/')) || 
                    (item.dropdown && item.dropdown.some(subItem => 
                      pathname === subItem.link || 
                      pathname.startsWith(subItem.link + '/')))
                      ? "text-red-600" 
                      : isScrolled ? "text-gray-900" : "text-white"
                  }`}
                  >
                    {item.name}
                  </Link>
                  {hasDropdown && hoveredIndex === index && (
                    <div className={`dropdown-${index} absolute top-full left-0 bg-white shadow-md z-30 w-48 mt-[.85rem]`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          const parent = document.querySelector(`[data-index="${index}"]`);
                          if (!parent?.matches(':hover')) {
                            setHoveredIndex(null);
                            restoreUnderlineToActive();
                          }
                        }, 100);
                      }}
                    >
                      {item.dropdown.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.link}
                          className={`block px-4 py-3 text-sm ${subItem.link === pathname ? 'bg-red-500 text-white' : 'text-gray-700 hover:text-white hover:bg-red-500'}`}>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toggle Button Mobile */}
          <div className="lg:hidden flex-shrink-0 items-end relative" onClick={() => setIsToggled(!isToggled)}>
            <FontAwesomeIcon
              icon={isToggled ? faClose : faBars}
              className={`text-lg font-light border ml-2 p-2 px-3 min-w-4 rounded-sm ${isToggled ? "text-gray-800 border-gray-400" : !isScrolled ? "text-red-50 bg-red border-gray-300" : "text-gray-800 border-gray-400"}`}
            />
          </div>

          {/* Center Logo */}
          <div className={`hidden lg:inline ${isScrolled ? "mt-5" : "top-1/2"} left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-30 pointer-events-none max-w-fit transition-all duration-200 ease-in-out`} style={isScrolled ? { top: '0' } : { top: '110%' }}>
            <Image src={logo} alt="Tolmin Logo" width={isScrolled ? 60 : 100} height={isScrolled ? 60 : 100} />
          </div>

          {/* Mobile Center Logo */}
          <div className={`lg:hidden left-1/2 -translate-x-1/2 absolute z-30 pointer-events-none max-w-fit transition-all duration-200 ease-in-out`}>
            <Image src={logo} alt="Tolmin Logo" width={isScrolled || isToggled ? 50 : 60} height={isScrolled ? 60 : 100} className="transition-all duration-200 ease-in-out" />
          </div>

          {/* Desktop Right Nav */}
          <div className={`hidden lg:flex ${isScrolled ? "gap-8 lg:gap-3 xl:gap-5 uppercase" : "gap-7 lg:gap-2 xl:gap-7"} flex-shrink-0 items-end relative`}>
            {navItems.slice(4).map((item, i) => {
              const index = i + 4;
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              return (
                <div key={index} className="relative"
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
                  }}>
                  <Link
                    href={item.link}
                    onMouseEnter={(e) => {
                      setHoveredIndex(index);
                      handleMouseEnter(e);
                    }}
                    onClick={() => setActiveIndex(index)}
                    className={`relative z-10 cursor-pointer px-2 font-semibold hover:text-red-600 pb-3 ${
                      activeIndex === index || 
                      pathname === item.link || 
                      (item.link !== '/' && pathname.startsWith(item.link + '/')) || 
                      (item.dropdown && item.dropdown.some(subItem => 
                        pathname === subItem.link || 
                        pathname.startsWith(subItem.link + '/')))
                        ? "text-red-600" 
                        : isScrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {hasDropdown && hoveredIndex === index && (
                    <div className={`dropdown-${index} absolute top-full left-0 bg-white shadow-md z-30 w-48 mt-[.85rem]`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          const parent = document.querySelector(`[data-index="${index}"]`);
                          if (!parent?.matches(':hover')) {
                            setHoveredIndex(null);
                            restoreUnderlineToActive();
                          }
                        }, 100);
                      }}
                    >
                      {item.dropdown.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.link}
                          className={`block px-4 py-3 text-sm ${subItem.link === pathname ? 'bg-red-500 text-white' : 'text-gray-700 hover:text-white hover:bg-red-500'}`}>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Underline */}
          <span className={`hidden lg:inline absolute ${isScrolled ? 'h-1 rounded-none' : 'h-0.5 rounded-sm'} bg-red-600 transition-all duration-300`}
            style={{ left: underlineStyle.left, width: underlineStyle.width, bottom: "-2px" }} />
        </nav>

        {/* Mobile Dropdown Nav */}
        <div className={`w-screen bg-white ${isToggled ? 'block absolute' : 'hidden'}`}>
          <div className="flex flex-col px-6 pt-6 pb-10 space-y-2">
            {navItems.map((item, index) => {
              const isActive = item.link === pathname || (item.dropdown && item.dropdown.some(sub => sub.link === pathname));
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              return (
                <div key={index}>
                  <div
                    className="flex justify-between items-center py-2 font-semibold cursor-pointer"
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                  >
                    <Link href={item.link} className={`${isActive ? 'text-red-600' : 'text-gray-800'}`}>
                      {item.name}
                    </Link>
                    {hasDropdown && (
                      <span className="ml-2 text-gray-500 text-sm">
                        {openDropdownIndex === index ? '▲' : '▼'}
                      </span>
                    )}
                  </div>

                  {hasDropdown && openDropdownIndex === index && (
                    <div className="pl-4">
                      {item.dropdown.map((subItem, subIndex) => {
                        const isSubActive = subItem.link === pathname;
                        return (
                          <Link
                            key={subIndex}
                            href={subItem.link}
                            className={`block text-sm py-1 ${
                              isSubActive
                                ? 'text-red-500 font-medium'
                                : 'text-gray-600 hover:text-red-600'
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
            <p className="uppercase pt-4 text-sm text-gray-800">Login</p>
          </div>
        </div>
      </div>
    </>
  );
}
