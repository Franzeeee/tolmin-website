import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

export default function U7() {
    return(<>
    <div className="w-full p-4 flex h-fit gap-8 xl:gap-3 flex-col xl:flex-row">
        {/* Left: Image */}
        <div className="relative w-full max-h-[500px] xl:w-[650px] xl:max-h-[1200px] xl:aspect-square h-auto flex-shrink-0">
            <Image 
                src={'/U7.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
            />
        </div>

        {/* Right: Content */}
        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins">
            <div className="flex flex-col border-b-2 border-gray-200 items-start justify-start w-full h-fit pb-5 text-black uppercase">
                <h1 className='text-black font-semibold mb-1 uppercase'>AKTUALNA OBVESTILA:</h1>
                <ul className="list-disc ml-6 space-y-1 text-gray-800 mb-4 font-light">
                    <li>GARDEROBE NISO NA RAZPOLAGO, ZATO VSI OTROCI PRIDEJO NA TRENING OBLEČENI V ŠPORTNO OPREMO, ALI PA SE PREOBLEČEJO PRED GARDEROBO.</li>
                </ul>

                <h1 className='text-black font-semibold mb-1 uppercase'>V spodnjih VIDEO POSNETKIH najdete primere preprostih vaj, ki jih lahko opravite doma. Vse, kar rabite je žoga in želja.</h1>
                <ul className="list-disc ml-6 space-y-1 text-gray-800 mb-4 font-light">
                    <li>prvih 5 vaj navajanja na žogo.</li>
                    <li>drugih 5 vaj navajanja na žogo</li>
                </ul>

                <h1 className='text-black font-semibold mb-1 uppercase'>VIDEO UTRINKI:</h1>
                <ul className="list-disc ml-6 space-y-1 text-gray-800 mb-4 font-light">
                    <li>Nekaj utrinkov iz predstavitve selekcije U7 na članski tekmi</li>
                </ul>

                <p className='mb-4'>TURNIRJI potekajo občasno, na sporedu so ob vikendih (september – november, marec – maj). Za prevoz na turnir poskrbite sami.</p>

                <p className='mb-4'><span className='font-semibold'>TEKME:</span> otroci v tej starostni skupini nimajo tekem.</p>

                <p className='text-red-700 italic font-semibold text-lg'>OTROCI naj imajo vedno s se boj telovadne copate, kratke hlače in rdečo klubsko majico!</p>
            </div>
            <div className='w-full h-50 p-2 px-5 flex gap-12 pb-0 items-end justify-center '>
                <div className='relative w-1/2 p-1 h-36 bg-gray-200 flex items-end justify-center rounded-xs'>
                    <div className='w-20 h-20 bg-gray-500 rounded-full absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center'>
                        <FontAwesomeIcon icon={faPhone} className='text-3xl'/>
                    </div>
                    <div className='w-full uppercase text-black px-3 pb-4'>
                        <h1 className='text-2xl text-black font-semibold'>pokličite nas</h1>
                        <p>Fitim Zabeljaj</p>
                        <p>041 656 492</p>
                    </div>
                </div>
                <div className='relative w-1/2 p-1 h-36 bg-gray-200 flex items-end justify-center rounded-xs'>
                    <div className='w-20 h-20 bg-gray-500 rounded-full absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center'>
                        <FontAwesomeIcon icon={faEnvelope} className='text-3xl'/>
                    </div>
                    <div className='w-full uppercase text-black px-3 pb-10'>
                        <h1 className='text-2xl text-black font-semibold'>Postavite vprašanje</h1>
                        <p className='bg-red-700 text-white w-fit px-4 rounded-md'>začeti</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    </>)
}