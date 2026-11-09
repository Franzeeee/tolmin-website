'use client'

import axios from 'axios'
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import NotificationBell from './NotificationBell'
import LanguageToggle from './LanguageToggle'

export default function AdminTopBar({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const handleLogout = () => {
    axios
      .post('/api/logout')
      .then(() => {
        window.location.href = '/'
      })
      .catch((error) => {
        console.error('Logout failed:', error)
      })
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-white border-b border-gray-200 px-4 h-16">
      <button
        onClick={onOpenMobileSidebar}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <NotificationBell />
        <LanguageToggle />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
