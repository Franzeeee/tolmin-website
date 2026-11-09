'use client'

import { useState } from 'react'
import { AdminLanguageProvider } from '@/context/AdminLanguageContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminLanguageProvider>
  )
}
