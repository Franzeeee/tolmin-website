// CartModal.tsx
'use client';

import { Dialog } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Image from 'next/image';
import { useCartStore } from '@/app/trgovina/cartStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};


interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string | null;
}

interface OrderItem {
  productId: string;
  name: string;
  size: string | null;
  quantity: number;
  price: number | string;
  image: string;
}

interface OrderPayload {
  customer: OrderCustomer;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
  deliveryMethod: string;
  totalPayment: number;
  status: string;
}

/**
 * Main component orchestrating the multi-step cart and payment modal.
 * It tracks a `paid` state so once card payment is confirmed,
 * Step 4 (card UI) is disabled and user is automatically taken to Step 5.
 */
export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | ''>('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const cart = useCartStore(s => s.cart);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const clearCart = useCartStore(s => s.clearCart);

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  useEffect(() => {
    setPaid(useCartStore.getState().paid);
    if (step === 4 && paymentMethod === 'card' && !clientSecret && !paid) {
      (async () => {
        setIsProcessing(true);
        try {
          const resp = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ items: cart, email, deliveryMethod, total }),
          });
          const text = await resp.text();
          console.log('create-payment-intent status:', resp.status);
          console.log('raw body:', text);

          const data = JSON.parse(text);
          if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
          if (!data.clientSecret) throw new Error('Missing clientSecret');
          setClientSecret(data.clientSecret);
        } catch (err: unknown) {
          Swal.fire('Napaka pri pripravi plačila', (err as Error).message, 'error');
        } finally {
          setIsProcessing(false);
        }
      })();
    }
  }, [step, paymentMethod, clientSecret, paid, cart, deliveryMethod, email, total]);

  const handlePaid = () => {
    setPaid(true);
    useCartStore.getState().setPaid(true);
    setStep(5);
  };

  const nextStep = () => {
    if (step === 2 && !email.trim()) {
      return Swal.fire('Vnesite e‑pošto', '', 'warning');
    }
    if (step === 3) {
      if (!deliveryMethod) return Swal.fire('Izberite način dostave', '', 'warning');
      const fields = deliveryMethod === 'pickup'
        ? ['name', 'phone']
        : ['country', 'name', 'phone', 'address', 'city'];
      for (const f of fields) {
        const el = document.querySelector(`[data-step="3"] [name="${f}"]`) as HTMLInputElement | null;
        if (!el || !el.value.trim()) {
          return Swal.fire('Izpolnite polja za dostavo', '', 'warning');
        }
      }
      setStep(4);
      return;
    }
    if (step === 4) {
      if (paid) {
        setStep(5);
        return;
      }
      if (!paymentMethod) return Swal.fire('Izberite način plačila', '', 'warning');
      if (paymentMethod === 'cash') {
        setStep(5);
      }
      // paymentMethod === 'card' => wait for CardPaymentSection to call handlePaid
      return;
    }
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      setStep(prev => prev + 1);
      // Get full address fields if delivery
      let fullAddress = null;
      if (deliveryMethod === 'delivery') {
        const addressEl = document.querySelector('[data-step="3"] [name="address"]') as HTMLInputElement | null;
        const cityEl = document.querySelector('[data-step="3"] [name="city"]') as HTMLInputElement | null;
        const countryEl = document.querySelector('[data-step="3"] [name="country"]') as HTMLInputElement | null;
        fullAddress = {
          address: addressEl?.value || '',
          city: cityEl?.value || '',
          country: countryEl?.value || '',
        };
      }
      axios.post<void, void, OrderPayload>('/api/orders', {
        customer: {
          name: name || '',
          email,
          phone: phone || '',
          address: fullAddress ? `${fullAddress.address}, ${fullAddress.city}, ${fullAddress.country}` : '',
        },
        items: cart.map((item): OrderItem => ({
          productId: item.id, // should be ObjectId in DB
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.img,
        })),
        totalItems: cart.reduce((sum: number, item) => sum + item.quantity, 0),
        totalPrice: Number(total.toFixed(2)),
        paymentMethod: paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card',
        paymentStatus: paid ? 'paid' : 'pending',
        deliveryMethod: deliveryMethod === 'pickup' ? 'Pickup' : 'Home Delivery',
        totalPayment: Number(total.toFixed(2)),
        status: 'Pending',
        // status and orderedAt are set by backend
      }).then(() => {
        Swal.fire('Naročilo uspešno!', 'Hvala za nakup.', 'success');
      }).catch((err: unknown) => {
        console.error('Error creating order:', err);
        Swal.fire('Napaka pri naročilu', 'Poskusite ponovno kasneje.', 'error');
      });
      clearCart();
      setEmail('');
      setDeliveryMethod('');
      setPaymentMethod('');
      setClientSecret(null);
      setPaid(false);
      useCartStore.getState().setPaid(false); // reset paid state in store
    }
  };

  const backStep = () => {
    if (paid && step === 5) return;
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleRemove = (id: string, size: string) => {
    Swal.fire({
      title: 'Ste prepričani?',
      text: 'Izdelek bo odstranjen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, odstrani',
      cancelButtonText: 'Prekliči',
    }).then(res => {
      if (res.isConfirmed) removeFromCart(id, size);
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
    }).then(res => {
      if (res.isConfirmed) clearCart();
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-2xl p-6 relative overflow-y-auto max‑h-[90vh] rounded-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-700">
            <FontAwesomeIcon icon={faShoppingCart} />
            {step === 1 ? 'Košarica' : 'Plačilo'}
          </h2>

          {/* ========== Step 1: Cart ========= */}
          {step === 1 && (
            cart.length === 0 ? (
              <p className="text-gray-500 text-center">Vaša košarica je prazna.</p>
            ) : (
              <div className="space-y-5">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-300">
                    <div className="w-20 h-20 bg-white rounded-md overflow-hidden relative">
                      <Image src={item.img} alt={item.name} fill sizes="80px" className="object-cover" priority />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Velikost: {item.size}</p>
                      <p className="text-sm text-gray-600">Količina: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1 text-gray-800">
                        {(Number(item.price) * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    <button onClick={() => handleRemove(item.id, item.size ?? '')} className="text-red-600 hover:text-red-800">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <span className="text-lg font-semibold text-gray-700">Skupaj:</span>
                  <span className="text-2xl font-bold text-red-700">€ {total.toFixed(2)}</span>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={handleClearCart} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Počisti</button>
                  <button onClick={nextStep} className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition">Nadaljuj</button>
                </div>
              </div>
            )
          )}

          {/* ========== Step 2: Email ========== */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Vnesite vaš e‑naslov …</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </label>
            </div>
          )}

          {/* ========== Step 3: Delivery ========== */}
          {step === 3 && (
            <div className="space-y-4" data-step="3">
              <p className="font-semibold">Način dostave:</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Pickup */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`flex-1 p-4 border rounded-md flex items-center gap-3 transition ${
                      deliveryMethod === 'pickup' ? 'border-red-700 bg-red-50 ring-2 ring-red-200' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="mr-2 accent-red-700" />
                    <span className="font-medium">Osebni prevzem</span>
                  </button>
                  {/* Delivery */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex-1 p-4 border rounded-md flex items-center gap-3 transition ${
                      deliveryMethod === 'delivery' ? 'border-red-700 bg-red-50 ring-2 ring-red-200' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input type="radio" name="delivery" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="mr-2 accent-red-700" />
                    <span className="font-medium">Dostava na dom</span>
                  </button>
                </div>
                <p>Vsa polja so obvezna, razen če so označena kot izbirna.</p>
                {/* Form fields */}
                {deliveryMethod === 'pickup' ? (
                  <form className="flex flex-col gap-3 w-full">
                    <label className="font-semibold">Ime in priimek</label>
                    <input name="name" onChange={(e) => setName(e.target.value)} placeholder="Ime in priimek" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                    <label className="font-semibold">Telefon</label>
                    <input name="phone" onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                  </form>
                ) : deliveryMethod === 'delivery' ? (
                  <form className="flex flex-col gap-3 w-full">
                    <label className="font-semibold">Država</label>
                    <input name="country" id='country' placeholder="Država" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                    <label className="font-semibold">Ime in priimek</label>
                    <input name="name" id='name' placeholder="Ime in priimek" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                    <label className="font-semibold">Telefon</label>
                    <input name="phone" id='phone' placeholder="Telefon" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                    <label className="font-semibold">Naslov</label>
                    <input name="address" id='address' placeholder="Naslov" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                    <label className="font-semibold">Mesto</label>
                    <input name="city" id='city' placeholder="Mesto" className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                  </form>
                ) : null}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="font-semibold">Način plačila:</p>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  disabled={paid}
                  onClick={() => !paid && setPaymentMethod('cash')}
                  className={`flex-1 p-4 border rounded-md flex items-center gap-3 ${
                    paymentMethod === 'cash'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  } ${paid ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    disabled={paid}
                    onChange={() => {}}
                    className="mr-2 accent-red-700"
                  />
                  <span className="font-medium">Plačilo z gotovino</span>
                </button>
                <button
                  type="button"
                  disabled={paid}
                  onClick={() => !paid && setPaymentMethod('card')}
                  className={`flex-1 p-4 border rounded-md flex items-center gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-red-700 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 bg-white'
                  } ${paid ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    disabled={paid}
                    onChange={() => {}}
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
                    rows={3}
                    disabled={paid}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="Komentar k naročilu"
                  />
                </form>
              )}

              {paymentMethod === 'card' && (
                <>
                  {!clientSecret ? (
                    <p className="mt-4 text-gray-600">
                      {isProcessing ? 'Obdelujem …' : 'Priprava plačila …'}
                    </p>
                  ) : (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: 'rgba(220,38,38,1)',
                            colorText: '#1f2937',
                            borderRadius: '0.375rem',
                          },
                        },
                      }}
                    >
                      <CardPaymentSection onPaid={handlePaid} total={total} />
                    </Elements>
                  )}
                </>
              )}
            </div>
          )}

            {/* Step 5: Summary */}
            {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-700 mb-2">Povzetek naročila</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 items-center mb-3">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-white">
                  <Image src={item.img} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">Velikost: {item.size}</div>
                  <div className="text-sm text-gray-600">Količina: {item.quantity}</div>
                </div>
                <div className="font-bold text-gray-800">
                  {(Number(item.price) * item.quantity).toFixed(2)} €
                </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-gray-300 mt-4">
                <span className="text-lg font-semibold text-gray-700">Skupaj:</span>
                <span className="text-2xl font-bold text-red-700">€ {total.toFixed(2)}</span>
              </div>
              </div>
              <div className="mt-4 space-y-2">
              <div>
                <span className="font-semibold">E‑pošta:</span> {email}
              </div>
              <div>
                <span className="font-semibold">Način dostave:</span> {deliveryMethod === 'pickup' ? 'Osebni prevzem' : 'Dostava na dom'}
              </div>
              <div>
                <span className="font-semibold">Način plačila:</span> {paymentMethod === 'cash' ? 'Gotovina' : 'Kartica'}
              </div>
              </div>
            </div>
            )}

            {/* Step 6: Thank you */}
            {step === 6 && (
            <div className="space-y-6 text-center py-8">
              <h3 className="text-2xl font-bold text-red-700 mb-2">Hvala za nakup!</h3>
              <p className="text-lg text-gray-700">Vaše naročilo je bilo uspešno oddano.</p>
              <p className="text-gray-500">Na vaš e‑naslov boste prejeli potrdilo o naročilu.</p>
            </div>
            )}

          {/* Navigation Buttons */}
          {step > 1 && step < 6 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={backStep}
                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${
                  paid && step === 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Nazaj
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                disabled={paymentMethod === 'card' && !paid}
              >
                {step === 5 ? 'Oddaj naročilo' : 'Naprej'}
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}


// 🎯 CardPaymentSection is placed outside but within the same file—can also be extracted
function CardPaymentSection({ onPaid, total }: { onPaid: () => void; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) {
      return Swal.fire('Stripe še ni pripravljen…', '', 'warning');
    }
    setBusy(true);
    await elements.submit(); // built-in validation and wallet flows
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setBusy(false);
    if (error) {
      Swal.fire('Napaka pri plačilu', error.message || 'Napaka', 'error');
    } else if (paymentIntent?.status === 'succeeded') {
      onPaid();
    }
  };

  return (
    <div className="mt-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <PaymentElement />
      </div>
      <button
        onClick={handleClick}
        disabled={busy}
        className="mt-4 w-full px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50"
      >
        {busy
          ? 'Obdelujem plačilo …'
          : `Potrdi plačilo (${total.toFixed(2)} €)`
        }
      </button>
    </div>
  );
}
