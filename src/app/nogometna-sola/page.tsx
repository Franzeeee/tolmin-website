import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
        <div className="flex items-end pb-2 justify-center h-screen max-h-[900px] z-20 relative overflow-hidden">
          <h1 className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins">
            Nogometna šola
          </h1>
        </div>
      </header>
    </div>
  );
}