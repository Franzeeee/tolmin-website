'use client';

import React from 'react';
import MainNav from '@/components/layout/MainNav';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header">
        <MainNav />
        <div className="flex items-center justify-center">
          <h1 className="text-9xl font-bold text-gray-50 opacity-60 header-text">NK TOLMIN</h1>
        </div>
      </header>
      <h1 className="text-4xl font-bold mb-4 text-black">Welcome to My App</h1>
      <p className="text-lg text-gray-700">This is a simple Next.js application.</p>
    </div>
  );
}