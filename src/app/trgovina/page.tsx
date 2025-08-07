'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';
import axios from 'axios';
import CartModal from '@/components/Shop/CartModal';
import Loading from '@/components/Loading';
import { useCartStore } from './cartStore';

interface Item {
  id: number; 
  _id?: string;
  name: string;
  price: string;
  img: string;
}

export default function Page() {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cart = useCartStore((state) => state.cart);

  // Total item count (sum of quantities)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);


  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
            const mappedItems = response.data.map((item: Item & { _id?: number }) => ({
            ...item,
            id: item._id ?? item.id,
            }));
            setItems(mappedItems);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching items:', error);
          setError(error);
          setIsLoading(false);  
        });
    }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      <header className="w-screen h-screen grid grid-rows-[auto_1fr] bg-white landing-header max-h-[900px]">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[900px]"
        >
          <source src="/tolmin-header.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[900px]" />
        <div className="flex items-end pb-2 justify-center h-screen max-h-[900px] z-20 relative overflow-hidden">
          <motion.h1
            initial={{ x: '110vw' }}
            animate={{ x: '-120vw' }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 16,
              ease: "linear"
            }}
            className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins"
          >
            Trgovina
          </motion.h1>
        </div>
      </header>

      <main className='w-full h-fit max-w-[95rem] bg-gray-50 border-t-4 border-red-600'>

        <section className='w-full min-h-content p-2 px-5 pb-9'>
            {/* Header Title */}
            <div className='flex items-center justify-between border-b-2 border-gray-300 pb-3'>
              <h1 className="text-3xl font-bold text-left text-red-600 mt-4 uppercase">
              Trgovina
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <button
                  className="flex items-center relative"
                  onClick={() => setCartOpen(true)}
                  aria-label="View cart"
                >
                  <i className="fas fa-shopping-cart text-lg text-red-500 hover:text-red-700 transition-colors duration-200 ease-in cursor-pointer " aria-hidden="true"></i>

                  {/* Banner showing cart count, currently 0 */}
                    <span className="absolute font-semibold rounded-full w-6 h-6 flex items-center justify-center text-xs text-black -top-4 -right-4 bg-white border border-gray-300 shadow">
                    {cartItemCount > 0 ? cartItemCount : '0'}
                    </span>
                </button>
                </div>
              </div>

             <div className="w-full py-8 px-4 flex flex-wrap justify-center gap-6 md:gap-8 text-black">
                { isLoading ? (
                  <Loading />
                ) : error ? (
                  <p className="text-lg text-red-500">
                    Error loading items: {error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : String(error)}
                  </p>
                ) : items.length === 0 ? (
                  <p className="text-lg text-gray-500">No items available.</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex pb-4 flex-col items-center transition-all duration-200 ease-in-out bg-white shadow hover:shadow-lg rounded w-full sm:w-[270px] md:w-[300px] lg:w-[320px] h-[340px] md:h-[420px] lg:h-[400px] justify-between"
                    >
                      {/* Image Container */}
                      <div className="w-full flex justify-center items-center h-[210px] md:h-[260px] lg:h-[290px] overflow-hidden bg-gray-100">
                        <Image
                          src={item.img}
                          alt={item.name}
                          height={250}
                          width={250}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col items-center text-left flex-1 mt-4 w-full">
                        <h3 className="text-sm md:text-base font-medium">{item.name}</h3>
                        <p className="font-bold mt-1 text-2xl">€ {item.price},00</p>
                      </div>

                      {/* Button */}
                      <a
                        className="mt-4 text-center font-semibold bg-black text-white text-xs md:text-sm px-4 py-3 cursor-pointer rounded w-[90%] hover:bg-red-700 transition"
                        href={`/trgovina/${item._id}`}
                      >
                        BUY NOW
                      </a>
                    </div>

                ))
              )}
            </div>
        </section>

      </main>
       <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
