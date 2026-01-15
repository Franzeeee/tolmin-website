import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMusic, faPhone, faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Tab1() {
  return (
    <div className="w-full px-6 py-10 flex flex-col items-center max-w-3xl mx-auto text-black">
      {/* Logo + Title */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative w-60 h-40">
          <Image
            src="/tolmin-logo-clear.png"
            alt="Nk Tolmin Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mt-4 text-red-700">Nogometni klub Tolmin</h1>
        <p className="text-gray-600">Ustanovljen leta 1921</p>
      </div>

      {/* All Boxes in Single Column */}
      <div className="flex flex-col gap-6 w-full">
        {/* Box 1 - Osnovne Informacije */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3">Osnovne Informacije</h2>
          <div className="space-y-2">
            <p><span className="font-bold">Naslov:</span> Ulica padlih borcev 1d, 5220 Tolmin</p>
            <p><span className="font-bold">Barve dresov:</span> rdeče-črna</p>
            <p><span className="font-bold">Vodstvo kluba:</span> 13-članski odbor, predsednik: Žan Isakoski Drole</p>
          </div>
        </div>

        {/* Box 2 - Kontakt */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} /> Kontakt
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>041 781 734 (Žan – predsednik)</li>
            <li>031 714 676 (Tadej – marketing)</li>
            <li>041 487 698 (Andrej – tekmovanja)</li>
            <li>041 243 287 (Mojca – sekretarka)</li>
          </ul>
        </div>

        {/* Box 3 - E-pošta */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} /> E-pošta
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <a href="mailto:nktolmin1921@gmail.com" className="text-red-600 hover:underline">
                nktolmin1921@gmail.com
              </a>
            </li>
            <li>
              <a href="mailto:ns.hidriatolmin@gmail.com" className="text-red-600 hover:underline">
                ns.hidriatolmin@gmail.com
              </a>
            </li>
            <li>
              <a href="mailto:znktminke@gmail.com" className="text-red-600 hover:underline">
                znktminke@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Box 4 - Spletna stran */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faGlobe} /> Spletna stran
          </h2>
          <p>
            <a href="https://www.nktolmin.si" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
              www.nktolmin.si
            </a>
          </p>
        </div>

        {/* Box 5 - Finančni Podatki */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3">Finančni Podatki</h2>
          <div className="space-y-2">
            <p><span className="font-bold">TRR:</span> 04753-0000393918 – Nova KBM d.d. Nova Gorica</p>
            <p><span className="font-bold">Swift:</span> KBMASI2XGOR</p>
            <p><span className="font-bold">IBAN:</span> SI5604753-0000393918</p>
            <p><span className="font-bold">Davčna številka:</span> SI50700332</p>
            <p><span className="font-bold">Matična številka:</span> 5058643000</p>
          </div>
        </div>

        {/* Box 6 - Himna NK Tolmin */}
        <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faMusic} /> Himna NK Tolmin
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/cp5Ur_lthPY"
              title="Himna NK Tolmin"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
