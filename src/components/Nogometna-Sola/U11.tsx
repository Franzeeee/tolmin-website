'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

type FootballSchool = {
  img?: string
  content?: string
  name?: string
  coaches?: {
    name: string
    phone: string
    email: string
  }[]
}

const fetchFootballSchool = async (id: string): Promise<FootballSchool> => {
  const res = await axios.get(`/api/football-school/${id}`)
  return res.data
}

export default function U7() {
  const id = '6884cbecf71ec698fd833eb6'

  const {
    data: fetchedData,
    isLoading,
  } = useQuery({
    queryKey: ['footballSchool', id],
    queryFn: () => fetchFootballSchool(id)
  })

  const contentLoaded = !!fetchedData?.content || !!fetchedData?.name

  return (
    <div className="w-full p-4 flex h-fit gap-8 xl:gap-3 flex-col items-center justify-center bg-gray-50">
      {/* Left: Image */}
      {!fetchedData?.img ? (
        <div className="flex items-center justify-center w-full h-[300px] xl:w-[650px] xl:h-[500px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded relative overflow-hidden transition-all duration-700">
          <div className="absolute inset-0 pointer-events-none">
            <div className="glare-effect" />
          </div>
          <span className="relative z-10 text-gray-400 text-lg font-medium">Loading...</span>
        </div>
      ) : (
        <div className="relative w-full max-h-[400px] aspect-video max-w-full xl:w-[650px] xl:max-h-[500px] flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={fetchedData.img}
                  alt="Team Image"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 75vw, 650px"
                  priority
                />
              </div>
      )}

      {/* Right: Content */}
      <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins">
        {isLoading || !contentLoaded ? (
          <div className="w-full flex flex-col gap-3 items-stretch justify-between animate-pulse transition-all duration-500">
            <div className="w-full h-4 bg-gray-300 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-300 rounded" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-4 bg-gray-300 rounded" />
            <div className="w-4/5 h-4 bg-gray-200 rounded" />
            <div className="w-2/5 h-4 bg-gray-300 rounded" />
            <div className="w-3/5 h-4 bg-gray-200 rounded" />
            <span className="text-gray-400 text-lg mt-4 self-center">Loading vsebina...</span>
          </div>
        ) : (
          <div
            className="text-black pb-10 w-1/2 mx-auto text-center"
            dangerouslySetInnerHTML={{
              __html: fetchedData?.content || fetchedData?.name || 'U11 Nogometna Šola',
            }}
          />
        )}

        {/* Contact Info Cards */}
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 p-2 px-0 pb-0 items-stretch justify-center">
          {/* Phone Card */}
          <div className="relative flex-1 min-w-[220px] max-w-md min-h-40 md:h-40 h-full bg-gray-200 flex flex-col items-center justify-end rounded-xs mb-16 md:mb-0 mx-auto w-full md:w-auto">
            <div className="w-16 h-16 bg-gray-500 rounded-full absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <FontAwesomeIcon icon={faPhone} className="text-2xl text-white" />
            </div>
            <div className="w-full uppercase text-black px-3 pb-4 text-center">
              <h1 className="text-xl md:text-2xl text-black font-semibold">pokličite nas</h1>
              <p className="text-base">{fetchedData?.coaches?.[0]?.name || "No Coach Data"}</p>
              <p className="text-base">{fetchedData?.coaches?.[0]?.phone || "No Phone Data"}</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="relative flex-1 min-w-[220px] max-w-md sm:max-h-40 min-h-40 md:h-40 h-full bg-gray-200 flex flex-col items-center justify-end rounded-xs mb-16 md:mb-0 mx-auto w-full md:w-auto">
            <div className="w-16 h-16 bg-gray-500 rounded-full absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-white" />
            </div>
            <div className="w-full uppercase text-black px-3 pb-6 text-center">
              <h1 className="text-xl md:text-2xl text-black font-semibold">Postavite vprašanje</h1>
              <a
                href={`mailto:${fetchedData?.coaches?.[0]?.email ?? 'fitim.zabeljaj@example.com'}`}
                className="bg-red-700 text-white w-fit px-4 rounded-md mx-auto mt-2 inline-block cursor-pointer"
              >
                začeti
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Glare effect style */}
      <style jsx>{`
        .glare-effect {
          position: absolute;
          top: 0;
          left: -70%;
          width: 70%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%);
          filter: blur(6px);
          opacity: 0.7;
          animation: glareMove 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
          transition: opacity 0.4s;
        }
        @keyframes glareMove {
          0% { left: -70%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  )

}
