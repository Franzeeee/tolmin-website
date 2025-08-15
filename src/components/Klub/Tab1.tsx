import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMusic, faPhone } from '@fortawesome/free-solid-svg-icons'

export default function Tab1() {
    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">

        {/* Text: Content */}
        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">

            <div className="w-full flex justify-center">
                <div className="relative w-full max-h-[300px] aspect-video max-w-full xl:w-[450px] xl:max-h-[350px] flex-shrink-0 rounded overflow-hidden">
                    <Image
                        src="/tolmin-logo-clear.png"
                        alt="Nk Tolmin Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 60vw, 450px"
                        priority
                    />
                </div>
            </div>

            <p className='text-lg text-gray-800 text-justify lg:mt-10'>
                Naziv:<span className='font-bold'> Nogometni klub Tolmin</span>
            </p>

            <p className='text-lg text-gray-800 text-justify'>
                Ustanovitev:<span className='font-bold'> Ulica padlih borcev 1d, 5220 Tolmin</span>
            </p>

            <p className='text-lg text-gray-800 text-justify'>
                Osnovna barva dresov:<span className='font-bold'> rdeče-črna</span>
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify mt-5'>
                Naslovaj:<span className='font-bold'> leta 1921</span>
            </p>
            <p className='text-lg text-gray-800 mb-4 text-justify '>
                Vodstvo kluba: <span className='font-bold'>13-članski upravni odbor, predsednik kluba: Žan Isakoski Drole</span>
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify '>
               <span className='font-bold'><FontAwesomeIcon icon={faPhone} /> Kontakt:</span>
            </p>

            <ul className="list-disc pl-7 text-lg text-gray-800 mb-4">
                <li>041 781 734 (Žan – predsednik),</li>
                <li>031 714 676 (Tadej – marketing)</li>
                <li>041 487 698 (Andrej – tekmovanja)</li>
                <li>041 243 287 (Mojca – sekretarka )</li>
            </ul>

            <p className='text-lg text-gray-800 mb-4 text-justify '>
               <span className='font-bold'><FontAwesomeIcon icon={faEnvelope} /> E-pošta:</span>
            </p>

            <ul className="list-disc pl-7 text-lg text-gray-800 mb-4">
                <li>
                    <a href="mailto:nktolmin1921@gmail.com" className="text-red-600 hover:underline">
                        nktolmin1921@gmail.com
                    </a>
                </li>
                <li>
                    <a href="mailto:nktolmin.mladi@gmail.com" className="text-red-600 hover:underline">
                        nktolmin.mladi@gmail.com
                    </a>
                </li>
                <li>
                    <a href="mailto:znktminke@gmail.com" className="text-red-600 hover:underline">
                        znktminke@gmail.com
                    </a>
                </li>
            </ul>


            <p className='text-lg text-gray-800 mb-4 text-justify mt-5'>
                Spletna stran:<span className='font-bold'> www.nktolmin.si</span>
            </p>
            <p className='text-lg text-gray-800 mb-4 text-justify '>
                Transakcijski račun: <span className='font-bold'>04753-0000393918 – Nova KBM d.d. Nova Gorica; swift: KBMASI2XGOR; IBAN koda: SI5604753-0000393918 </span>
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify mt-5'>
                Davčna številka:<span className='font-bold'>  SI50700332</span>
            </p>
            <p className='text-lg text-gray-800 mb-4 text-justify '>
                Matična številka: <span className='font-bold'>5058643000</span>
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify '>
               <span className='font-bold'><FontAwesomeIcon icon={faMusic} /> Himna NK Tolmin:</span> - Leon Oblak <a
                 href="https://www.youtube.com/watch?v=cp5Ur_lthPY"
                 className="text-red-600 hover:underline"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                  (BESEDILO)
               </a>:
               
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Vrti se žoga, vrti se svet,
                mi smo nori na nogomet. <br />
                Vsaka zmaga je nov spomin <br />
                gremo, gremo, gremo Tolmin.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Vedno polni energije, <br />
                ko za klub srce nam bije.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj odmeva od gora vse do nižin, samo eden je Tolmin. <br />
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj se sliši preko hribov in dolin, da najboljši je Tolmin.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Teče žoga, teče čas, <br />
                teče vroča kri v nas. <br />
                Nogomet je adrenalin, <br />
                gremo, gremo, gremo Tolmin.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Vedno polni energije, <br />
                ko za klub srce nam bije.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj odmeva od gora vse do nižin, samo eden je Tolmin. <br />
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj se sliši preko hribov in dolin, da najboljši je Tolmin.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Nogomet na valovih domišljije, <br />
                tam kjer se Tolminka v Sočo zlije, <br />
                z nami naj se dvigne do višin <br />
                nogometni klub Tolmin.
            </p>

            <p className='text-gray-800 mb-4 text-justify italic'>
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj odmeva od gora vse do nižin, samo eden je Tolmin. <br />
                Rdeče-črni iz Tolmina, naj se piše zgodovina, <br />
                naj se sliši preko hribov in dolin, da najboljši je Tolmin.
            </p>

        </div>


    </div>

    </>)
}