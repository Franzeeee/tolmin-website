'use client';

import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Image from 'next/image';

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Static cart items for demonstration
const staticCart = [
  {
    productId: '1',
    name: 'Majica Tolmin',
    size: 'M',
    quantity: 2,
    price: 19.99,
    image: '/Merch/item1.png',
  },
  {
    productId: '2',
    name: 'Kapa Tolmin',
    size: 'L',
    quantity: 1,
    price: 14.99,
    image: '/Merch/item2.png',
  },
];

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const handleRemove = () => {
    Swal.fire(
      'Demo način',
      'Odstranjevanje izdelkov ni omogočeno.',
      'info'
    );
  };

const clearCart = () => {
    Swal.fire({
        title: 'Ste prepričani?',
        text: 'Ali res želite preklicati naročilo in počistiti košarico?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Da, počisti',
        cancelButtonText: 'Prekliči',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Demo način', 'Počisti košarico ni omogočeno.', 'info');
        }
    });
};


  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]  rounded-2xl">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-700">
            <FontAwesomeIcon icon={faReceipt} />
            Order Info
          </h2>

          {staticCart.length === 0 ? (
            <p className="text-gray-500 text-center">Vaša košarica je prazna.</p>
          ) : (
            <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-red-700 rounded-sm mr-2"></span>
                    Items Ordered
                </h3>
              {staticCart.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-300"
                >
                  {/* Image */}
                    <div className="w-20 h-20 bg-white rounded-md overflow-hidden relative">
                    <Image
                      src={item.image}
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
                    <p className="text-sm text-gray-600">Količina: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1 text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove()}
                    className="text-red-600 hover:text-red-800 mb-15 cursor-pointer transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))}

              {/* Order Summary */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-6 bg-red-700 rounded-sm mr-2"></span>
                  Order Summary
                </h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <div className="mb-2 sm:mb-0">
                      <span className="block text-xs text-gray-500">Total Items</span>
                      <span className="text-sm text-gray-700 font-medium">{staticCart.length}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Total Price</span>
                      <span className="text-sm text-gray-700 font-medium">
                        {staticCart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info  */}

              <div className='w-full border-t border-gray-200'>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-red-700 rounded-sm mr-2"></span>
                    Customer Information
                  </h3>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:gap-8">
                      <div className="mb-2 sm:mb-0">
                        <span className="block text-xs text-gray-500">Name</span>
                        <span className="text-sm text-gray-700 font-medium">Janez Novak</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Email</span>
                        <span className="text-sm text-gray-700 font-medium">janez.novak@example.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                    Cancel Order
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
