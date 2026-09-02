'use client'

import { useAdminLanguage } from '@/context/AdminLanguageContext'

export default function LanguageToggle() {
  const { lang, toggleLang } = useAdminLanguage()

  return (
    <button
      onClick={toggleLang}
      title={lang === 'sl' ? 'Switch to English' : 'Preklopi na slovenščino'}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2.5 shadow-lg hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <span className={`text-xs font-bold ${lang === 'sl' ? 'text-white' : 'text-gray-500'}`}>SLO</span>
      <span className="text-gray-500">/</span>
      <span className={`text-xs font-bold ${lang === 'en' ? 'text-white' : 'text-gray-500'}`}>ENG</span>
    </button>
  )
}
