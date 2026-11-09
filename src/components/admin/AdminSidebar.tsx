'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

type NavItem = {
  name: string
  href?: string
  submenu?: { name: string; href: string }[]
}

const navItems: NavItem[] = [
  { name: 'API', href: '/admin/dashboard' },
  { name: 'Sponzorji', href: '/admin/sponzorji' },
  {
    name: 'Klub',
    submenu: [
      { name: 'Članstvo', href: '/admin/clanstvo' },
      { name: 'Pravilniki', href: '/admin/pravilniki' },
      { name: 'Bradja', href: '/admin/bradja' },
    ],
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
  {
    name: 'Članstvo Moštvo',
    submenu: [
      { name: 'Ekipa', href: '/admin/teams' },
      { name: 'Tekme', href: '/admin/clansko-tekme' },
      { name: 'Lestvica', href: '/admin/clansko-lestvica' },
    ],
  },
  {
    name: 'News',
    submenu: [
      { name: 'News Overview', href: '/admin/news' },
      { name: 'Create News', href: '/admin/news/create' },
    ],
  },
  {
    name: 'Shop',
    submenu: [
      { name: 'Shop Overview', href: '/admin/shop' },
      { name: 'Orders', href: '/admin/shop/orders' },
    ],
  },
]

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function isGroupActive(pathname: string, item: NavItem) {
  return item.submenu?.some((sub) => isActivePath(pathname, sub.href)) ?? false
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    navItems.forEach((item) => {
      if (item.submenu && isGroupActive(pathname, item)) initial.add(item.name)
    })
    return initial
  })

  useEffect(() => {
    const active = navItems.find((item) => item.submenu && isGroupActive(pathname, item))
    if (active) {
      setOpenGroups((prev) => (prev.has(active.name) ? prev : new Set(prev).add(active.name)))
    }
  }, [pathname])

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) =>
        item.submenu ? (
          <div key={item.name}>
            <button
              onClick={() => toggleGroup(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isGroupActive(pathname, item) ? 'text-red-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${openGroups.has(item.name) ? 'rotate-180' : ''}`}
              />
            </button>
            {openGroups.has(item.name) && (
              <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onNavigate}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      isActivePath(pathname, sub.href)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={item.name}
            href={item.href!}
            onClick={onNavigate}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActivePath(pathname, item.href!) ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.name}
          </Link>
        )
      )}
    </nav>
  )
}

export default function AdminSidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200">
        <div className="px-4 py-5 border-b border-gray-100">
          <Link href="/admin/dashboard" className="text-xl font-bold text-red-600">
            Admin
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[80%] h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
              <span className="text-xl font-bold text-red-600">Admin</span>
              <button onClick={onCloseMobile} className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavLinks onNavigate={onCloseMobile} />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
