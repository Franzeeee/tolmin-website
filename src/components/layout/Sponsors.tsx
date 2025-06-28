import React from 'react'
import Image from 'next/image'

export default function Sponsors() {
  return (
    <section className="w-full py-8 bg-gray-950 flex flex-col items-center gap-6">
      {/* Main Sponsors */}
      <div className="w-full border-b border-gray-500 flex flex-wrap justify-center items-center gap-6 md:gap-12 px-4">
        {[
          '/logo/hidria_logo.png',
          '/logo/coronini_logo.png',
          '/logo/tkk_logo.png',
          '/logo/mahle_logo.png'
        ].map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Main sponsor ${idx + 1}`}
            width={160}
            height={160}
            className="object-contain"
          />
        ))}
      </div>

      {/* Other sponsors */}
      <div className="w-full flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10 px-4">
        {[
          '/logo/ziggrad.png',
          '/logo/varuh.png',
          '/logo/aurenis_logo.png',
          '/logo/Avtoprevoz_vektorski.png',
          '/logo/elektro.png',
          '/logo/herz_logo.png',
          '/logo/ITW_logo.png',
          '/logo/konek_logo.png',
          '/logo/obsina_logo.png',
          '/logo/maya_team_logo.png'
        ].map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Sponsor ${idx + 1}`}
            width={135}
            height={135}
            className="object-contain"
          />
        ))}
      </div>
    </section>
  )
}
