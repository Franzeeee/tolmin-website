'use client';

import React from 'react';
import MainNav from '@/components/layout/MainNav';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <header className="w-full h-screen grid grid-rows-[auto_1fr] bg-white landing-header">
        <MainNav />
        <div className="flex items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: .6 }}
            transition={{ duration: .6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-9xl font-bold text-gray-100 opacity-60 header-text select-none"
          >
            NK TOLMIN
          </motion.h1>
        </div>
      </header>
      <h1 className="text-4xl font-bold mb-4 text-black">Welcome to My App</h1>
      <p className="text-lg text-gray-700">This is a simple Next.js application.</p>
    </div>
  );
}