'use client'

import { useAdminLanguage } from '@/context/AdminLanguageContext'

export default function LanguageToggle() {
  const { lang, toggleLang } = useAdminLanguage()

  return (
    <button
      onClick={toggleLang}
      title={lang === 'sl' ? 'Switch to English' : 'Preklopi na slovenščino'}
      className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-3 py-2 shadow hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <span className={`text-xs font-bold ${lang === 'sl' ? 'text-white' : 'text-gray-500'}`}>SLO</span>
      <span className="text-gray-500">/</span>
      <span className={`text-xs font-bold ${lang === 'en' ? 'text-white' : 'text-gray-500'}`}>ENG</span>
    </button>
  )
}
