'use client';

import React, { useState, useEffect } from 'react';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CartModal from '@/components/Shop/CartModal';
import { useCartStore } from '../cartStore';
import Swal from 'sweetalert2';

type Item = {
  id: string;
  name: string;
  price: string;
  img: string;
  priceWithTax?: string;
  size?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: string;
  img: string;
  priceWithTax?: string;
  quantity: number;
  size: string | null;
};

export default function Page() {
  const { itemId } = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizes, setSizes] = useState<CartItem['size'][]>();
  const [item, setItem] = useState<Item | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const cart = useCartStore((state) => state.cart);

  // Total item count (sum of quantities)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

useEffect(() => {
  if (!itemId || typeof itemId !== 'string') return;
  fetchData(itemId);
}, [itemId]);

  const fetchData = async (itemId: string) => {
    const response = await axios.get(`/api/products/${itemId}`);
    const data = response.data;
    setItem(data);
    setSizes(data.sizes || []); // Set sizes if available
  };

  function addToCart(product: { quantity: number; id?: string; name?: string; price?: string; img?: string; priceWithTax?: string }) {
    if (!item) {
      // Optionally show a message to select size or wait for item to load
      return;
    }
    // Add selected size to the product object
    useCartStore.getState().addToCart({
      ...item,
      size: selectedSize || 'N/A', // Use selected size or null if not selected
      quantity: product.quantity,
    });
    Swal.fire({
      icon: 'success',
      title: 'Izdelek dodan v košarico',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
      popup: 'border-2 border-red-600'
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 text-black poppins">
      {/* === Header with Video Background === */}
      {/* Hero Banner */}
      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-60 pointer-events-none" />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg">
          Trgovina
          </h1>
          <p className="text-lg sm:text-2xl text-white font-medium mb-2 text-center drop-shadow">
        {item ? item.name : 'Nalaganje...'}
          </p>
        </div>
      </header>

      {/* === Main Section === */}
      <main className="w-full h-fit max-w-[60rem] bg-gray-50 border-t-4 border-red-600">
        <section className="w-full min-h-content flex flex-col lg:items-center p-4 sm:px-6 lg:px-12 pb-9">
          {/* Section Title */}
          <div className="border-b-2 border-gray-300 pb-3 w-full flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-left text-red-600 mt-4 uppercase">
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

          {/* Return to shop  */}
            <Link
            href="/trgovina"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition text-left mt-4 lg:mt-5 w-full"
            >
            <i className="fas fa-arrow-left"></i>
            Nazaj v trgovino
            </Link>

          {/* Product Layout */}
          <div className="w-full max-w-6xl mx-auto py-8 flex flex-col md:flex-row gap-8 lg:mt-5">
            {/* Left: Product Image */}
            <div className="flex-1 border border-gray-300 p-4 flex items-center justify-center bg-transparent rounded-lg ">
              {item?.img ? (
              <Image
                src={item.img}
                alt={'Item Image'}
                className="object-contain"
                height={300}
                width={300}
                priority
              />
              ) : (
              <div className="flex items-center justify-center w-[300px] h-[300px] bg-gray-200 animate-pulse rounded">
                <span className="text-gray-400">Loading image...</span>
              </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex-1 flex flex-col gap-4">
              {item ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold">{item.name}</h2>
                  <p className="text-gray-500">Na zalogi</p>
                  <p className="text-xl sm:text-2xl font-bold">€ {item.price},00</p>
                  <p className="text-sm text-gray-500">
                    Cena vključuje DDV (22%) € {item.priceWithTax || "0"},00
                  </p>
                </>
              ) : (
                <div className="animate-pulse space-y-2">
                  <div className="h-7 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-7 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              )}

              {/* Size Selector */}
              <div>
                {sizes && sizes.length > 0 && (
                  <p className="mb-2 font-medium">Izberite velikost:</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-3 py-2 rounded text-sm cursor-pointer ${
                        selectedSize === size
                          ? 'bg-red-600 text-white border-gray-300'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button className="mt-4 bg-red-700 text-white px-4 py-3 cursor-pointer rounded hover:bg-red-800 transition"
                onClick={() => addToCart({ ...item, quantity: 1 })}
              >
                Dodajte v nakupovalno košarico
              </button>

              <p className="text-xs text-red-600">Navedite možnosti</p>

              {/* Social Sharing */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                <span className="text-sm">Delite ta izdelek s prijatelji</span>
                <div className="flex gap-3">
                    <a href="#" aria-label="Instagram" className="text-gray-700 hover:text-pink-600 text-xl">
                    <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" aria-label="Facebook" className="text-gray-700 hover:text-blue-600 text-xl">
                    <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-700 hover:text-red-600 text-xl">
                    <i className="fab fa-youtube"></i>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
