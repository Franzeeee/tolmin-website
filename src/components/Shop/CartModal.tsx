'use client';

import { Dialog } from '@headlessui/react';
import { Fragment, useState } from 'react';
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
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

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

  const total = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const nextStep = () => {
    if (step === 2 && !email) {
      Swal.fire('Vnesite e-pošto', '', 'warning');
      return;
    }
    if (step === 3 && !deliveryMethod) {
      Swal.fire('Izberite način dostave', '', 'warning');
      return;
    }
    if (step === 4 && !paymentMethod) {
      Swal.fire('Izberite način plačila', '', 'warning');
      return;
    }
    if (step < 4) setStep(step + 1);
    else {
      Swal.fire('Naročilo poslano!', 'Hvala za nakup.', 'success');
      setStep(1);
      clearCart();
      onClose();
    }
  };

  const backStep = () => setStep((prev) => Math.max(1, prev - 1));

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
            {step !== 1 ? 'Košarica' : 'Plačilo'}
          </h2>

          {/* Tabs */}
          {step === 1 && (
            <>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Vaša košarica je prazna.</p>
              ) : (
                <div className="space-y-5">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-300"
                    >
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
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Velikost: {item.size}</p>
                        <p className="text-sm text-gray-600">Količina: {item.quantity}</p>
                        <p className="text-sm font-bold mt-1 text-gray-800">
                          {(Number(item.price) * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.size)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                    <span className="text-lg font-semibold text-gray-700">Skupaj:</span>
                    <span className="text-2xl font-bold text-red-700">€ {total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleClearCart}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                      Počisti
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                    >
                      Nadaljuj
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Vnesite vaš e-naslov. Nanj boste obvešečeni o spremembah statusa naročil.</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vnesite email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="font-semibold">Način dostave:</p>
              <div className="flex flex-col gap-4">
                <div className='flex flex-col md:flex-row gap-4'>
                <button
                  type="button"
                  className={`flex-1 p-4 border rounded-md flex items-center justify-start gap-3 transition ${
                    deliveryMethod === 'pickup'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setDeliveryMethod('pickup')}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="mr-2 accent-red-700"
                  />
                  <span className="font-medium">Osebni prevzem</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 p-4 border rounded-md flex items-center justify-start gap-3 transition ${
                    deliveryMethod === 'delivery'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setDeliveryMethod('delivery')}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => setDeliveryMethod('delivery')}
                    className="mr-2 accent-red-700"
                  />
                  <span className="font-medium">Dostava na dom</span>
                </button>
                </div>
                <p>Vsa polja so obvezna, razen če so označena kot izbirna.</p>
                {deliveryMethod === 'pickup' ? (
                  <form className="flex flex-col gap-3 w-full ">
                  <label htmlFor="name" className='font-semibold'>Ime in priimek</label>
                  <input
                    type="text"
                    placeholder="Ime in priimek"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <label htmlFor="phone" className='font-semibold'>Telefon</label>
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  </form>
                ) : deliveryMethod === 'delivery' ? (
                  <form className="flex flex-col gap-3 w-full mt-4">
                  <label htmlFor="country" className='font-semibold'>Država</label>
                  <input
                    type="text"
                    placeholder="Država"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <label htmlFor="name" className='font-semibold'>Ime in priimek</label>
                  <input
                    type="text"
                    placeholder="Ime in priimek"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <label htmlFor="phone" className='font-semibold'>Telefon</label>
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <label htmlFor="address" className='font-semibold'>Naslov</label>
                  <input
                    type="text"
                    placeholder="Naslov"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <label htmlFor="postalCode" className='font-semibold'>Poštna številka</label>
                  <input
                    type="text"
                    placeholder="Naziv"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  <label htmlFor="city" className='font-semibold'>Mesto</label>
                  <input
                    type="text"
                    placeholder="Glava"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  </form>
                ) : null}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="font-semibold">Način plačila:</p>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  className={`flex-1 p-4 border rounded-md flex items-center justify-start gap-3 transition text-left ${
                    paymentMethod === 'cash'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="mr-2 accent-red-700"
                  />
                  <span className="font-medium">Plačilo z gotovino</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 p-4 border rounded-md flex items-center justify-start gap-3 transition text-left ${
                    paymentMethod === 'card'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mr-2 accent-red-700"
                  />
                  <span className="font-medium">Plačilo s kartico</span>
                </button>
              </div>
              {paymentMethod === 'cash' && (
                <form className="mt-4 flex flex-col gap-3">
                  <label className="font-semibold" htmlFor="orderComment">
                    Komentar naročila (izbirno)
                  </label>
                  <textarea
                    id="orderComment"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Dodajte komentar k naročilu"
                    rows={3}
                  />
                </form>
              )}
              {paymentMethod === 'card' && (
                <form className="mt-4 flex flex-col gap-3">
                  <label className="font-semibold" htmlFor="cardNumber">
                  Številka kartice
                  </label>
                  <input
                  id="cardNumber"
                  type="text"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  />
                  <div className="flex gap-1">
                  <div className="flex-1">
                    <label className="font-semibold" htmlFor="expDate">
                    Datum veljavnosti
                    </label>
                    <input
                    id="expDate"
                    type="text"
                    className="px-4 py-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold" htmlFor="secCode">
                    Varnostna koda
                    </label>
                    <div className="relative">
                    <input
                      id="secCode"
                      type="text"
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 pr-10 w-full"
                      placeholder="CVC"
                      autoComplete="cc-csc"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <i className="fa-regular fa-credit-card"></i>
                    </span>
                    </div>
                  </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={backStep}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Nazaj
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
              >
                {step === 4 ? 'Oddaj naročilo' : 'Naprej'}
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
