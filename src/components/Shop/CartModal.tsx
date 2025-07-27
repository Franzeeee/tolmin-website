'use client';

import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Image from 'next/image';
import { useCartStore } from '@/app/trgovina/cartStore';

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleRemove = (id: string, size: string) => {
    Swal.fire({
      title: 'Ste prepričani?',
      text: 'Izdelek bo odstranjen iz košarice.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, odstrani',
      cancelButtonText: 'Prekliči',
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id, size);
      }
    });
  };


  const handleClearCart = () => {
    Swal.fire({
      title: 'Počisti košarico?',
      text: 'Vsi izdelki bodo odstranjeni.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, počisti',
      cancelButtonText: 'Prekliči',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] rounded-2xl">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-700">
            <FontAwesomeIcon icon={faShoppingCart} />
            Košarica
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Vaša košarica je prazna.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-300"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden relative">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Velikost: {item.size}</p>
                    <p className="text-sm text-gray-600">Cena: € {item.price},00</p>
                    <p className="text-sm text-gray-600">Količina: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1 text-gray-800">
                      {(Number(item.price) * item.quantity).toFixed(2)} €
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.size)}
                    className="text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-200 -mt-22"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))}

              {/* Total Summary */}
              <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Skupaj:</span>
                <span className="text-2xl font-bold text-red-700">
                  €{' '}
                  {cart
                    .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>


              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Počisti
                </button>
                <button
                  onClick={() => alert('Proceed to checkout')}
                  className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
