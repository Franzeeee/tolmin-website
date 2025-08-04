// components/CardPaymentForm.tsx
'use client';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { useState } from 'react';

interface CardPaymentFormProps {
  clientSecret: string;
  onPaid: () => void;
}

export default function CardPaymentForm({ clientSecret, onPaid }: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      return Swal.fire('Stripe še ni pripravljen…', '', 'warning');
    }

    setIsProcessing(true);
    await elements.submit(); // built-in validation

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    });

    setIsProcessing(false);
    if (result.error) {
      Swal.fire('Napaka pri plačilu', result.error.message || '', 'error');
    } else {
      onPaid();
    }
  };

  return (
    <div className="mt-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <PaymentElement />
      </div>
      <button
        onClick={handlePay}
        className="mt-4 w-full px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50"
        disabled={isProcessing}
      >
        {isProcessing ? 'Obdelujem plačilo …' : 'Potrdi plačilo'}
      </button>
    </div>
  );
}
