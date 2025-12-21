'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDownIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)

  const navItems = [
    { name: 'API', href: '/admin/dashboard' },
    { name: 'Sponzorji', href: '/admin/sponzorji' },
    { name: 'Klub',
      submenu: [
        { name: 'Članstvo', href: '/admin/clanstvo' },
        { name: 'Pravilniki', href: '/admin/pravilniki' },
        { name: 'Bradja', href: '/admin/bradja' },
      ]
    },
    {
      name: 'Football School',
      submenu: [
        { name: 'Vodstvo NŠ Hidria Tolmin in trenerji', href: '/admin/vodstvo-ns-hidria-tolmin-in-trenerji' },
        { name: 'U7', href: '/admin/U7' },
        { name: 'U9', href: '/admin/U9' },
        { name: 'U11', href: '/admin/U11' },
        { name: 'U13', href: '/admin/U13' },
        { name: 'U15', href: '/admin/U15' },
        { name: 'U17', href: '/admin/U17' },
        { name: 'U19', href: '/admin/U19' },
        { name: 'Aktivnosti in dokumenti', href: '/admin/aktivnosti-in-dokumenti' },
        { name: 'Nogometni kamp 1.-7. razred', href: '/admin/nogometni-kamp-1-7-razred' },
        { name: 'Nogometni kamp 6.-9. razred', href: '/admin/nogometni-kamp-6-9-razred' },
      ],
    },
    { name: 'Photo History', href: '/admin/photo-history' },
    { name: 'Članstvo Moštvo', submenu: [
      { name: 'Ekipa', href: '/admin/teams' },
      { name: 'Tekme', href: '/admin/clansko-tekme' },
      { name: 'Lestvica', href: '/admin/clansko-lestvica' },
      { name: 'Edit', href: '/admin/clanstvo-mostvo/edit/[id]', visible: false, dynamic: true },
    ]},
    { name: 'News', submenu: [
      { name: 'News Overview', href: '/admin/news' },
      { name: 'Create News', href: '/admin/news/create' },
      { name: 'Edit News', href: '/admin/news/edit/[id]', visible: false, dynamic: true },
    ]},
    { name: 'Shop', submenu: [
      { name: 'Shop Overview', href: '/admin/shop' },
      { name: 'Orders', href: '/admin/shop/orders' },
      // { name: 'Customers', href: '/admin/shop/customers' },
    ]},
  ]


  const handleLogout = () => {
    axios.post('/api/logout')
      .then(() => {
        window.location.href = '/'
      })
      .catch((error) => {
        console.error('Logout failed:', error)
      })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top nav */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-red-600">Admin</div>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-4 relative">
            {navItems.map((item) =>
              item.submenu ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
                    setOpenDropdown(item.name)
                  }}
                  onMouseLeave={() => {
                    dropdownTimeout.current = setTimeout(() => {
                      setOpenDropdown(null)
                    }, 100)
                  }}
                >
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  item.submenu.some(sub => pathname === sub.href || pathname.startsWith(sub.href))
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                  {openDropdown === item.name && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-40">
                      {item.submenu.map((sub) => (
                        (sub.visible !== false) && (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2 text-sm ${
                              pathname === sub.href
                                ? 'bg-red-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex gap-2">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-700">
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="space-y-1 px-2 py-3">
              {navItems.map((item) =>
                item.submenu ? (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() =>
                        setOpenMobileSubmenu(openMobileSubmenu === item.name ? null : item.name)
                      }
                      className="flex w-full items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <span>{item.name}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transform transition-transform ${
                          openMobileSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openMobileSubmenu === item.name && (
                      <div className="pl-4 space-y-1">
                        {item.submenu.map((sub) => (
                          (sub.visible !== false) && (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-3 py-2 rounded-md text-sm ${
                                pathname === sub.href
                                  ? 'bg-red-500 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-sm ${
                      pathname === item.href
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 mt-16 p-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
