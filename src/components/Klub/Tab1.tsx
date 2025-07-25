import React from 'react'

export default function Tab1() {
    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">

        {/* Text: Content */}
        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                <span className='font-bold'>Naziv:</span> Nogometni klub Tolmin
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                <span className='font-bold'>Naslovaj:</span> Ulica padlih borcev 1d, 5220 Tolmin
            </p>

            <h1 className="text-2xl font-bold mb-6 text-center mt-5 text-left">
                Leta 1921 je leto rojstvo nogometne igre v Tolminu.
            </h1>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                

            </p>

        </div>


    </div>

    </>)
}