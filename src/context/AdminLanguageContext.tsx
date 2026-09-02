'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type AdminLang = 'sl' | 'en'

const STORAGE_KEY = 'admin_lang'

type AdminLanguageContextValue = {
  lang: AdminLang
  setLang: (lang: AdminLang) => void
  toggleLang: () => void
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null)

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>('sl')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'sl' || stored === 'en') setLangState(stored)
    } catch {
      // localStorage unavailable — keep default
    }
  }, [])

  const setLang = (next: AdminLang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  const toggleLang = () => setLang(lang === 'sl' ? 'en' : 'sl')

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const ctx = useContext(AdminLanguageContext)
  if (!ctx) throw new Error('useAdminLanguage must be used within an AdminLanguageProvider')
  return ctx
}
