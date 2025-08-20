'use client';

import { Dialog } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Image from 'next/image';
import axios from 'axios';

type CartModalProps = {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

type OrderData = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalItems: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  status: string;
};



export default function CartModal({ orderId, isOpen, onClose }: CartModalProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // const handleRemove = () => {
  //   Swal.fire(
  //     'Demo način',
  //     'Odstranjevanje izdelkov ni omogočeno.',
  //     'info'
  //   );
  // };

const handleShipStatus = async (orderId: string) => {
  Swal.fire({
    title: 'Change Order Status',
    text: 'Are you sure you want to mark this order as shipped?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, ship it!',
    cancelButtonText: 'No, cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/api/orders/${orderId}/ship`, {
          status: 'Shipped',
        });

        Swal.fire({
          title: 'Order Shipped',
          text: response.data.message,
          icon: 'success',
        })
        .then(() => {
          onClose();
          fetchOrders();
        });
      } catch (error) {
        console.error('❌ Error updating order:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update order. Please try again.',
          icon: 'error',
        });
      }
    }
  });
};

const handleDeliveredStatus = async (orderId: string) => {
  Swal.fire({
    title: 'Change Order Status',
    text: 'Are you sure you want to mark this order as delivered?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, deliver it!',
    cancelButtonText: 'No, cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/api/orders/${orderId}/deliver`, {
          status: 'Delivered',
        });

        Swal.fire({
          title: 'Order Delivered',
          text: response.data.message,
          icon: 'success',
        })
        .then(() => {
          onClose();
          fetchOrders();
        });
      } catch (error) {
        console.error('❌ Error updating order:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update order. Please try again.',
          icon: 'error',
        });
      }
    }
  });
};

const handleCancelStatus = async (orderId: string) => {
  Swal.fire({
    title: 'Change Order Status',
    text: 'Are you sure you want to cancel this order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/api/orders/${orderId}/cancel`, {
          status: 'Cancelled',
        });

        Swal.fire({
          title: 'Order Cancelled',
          text: response.data.message,
          icon: 'success',
        })
        .then(() => {
          onClose();
          fetchOrders();
        });
      } catch (error) {
        console.error('❌ Error updating order:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update order. Please try again.',
          icon: 'error',
        });
      }
    }
  });
};


  useEffect(() => {
    fetchOrders();
  }, [orderId]);

const fetchOrders = async () => {
  if (!orderId) return;

  setIsLoading(true);
  try {
    const response = await axios.get(`/api/orders/${orderId}`);
    setOrder(response.data);
  } catch (error) {
    console.error('Error fetching order:', error);
  } finally {
    setIsLoading(false);
  }
};


  if (isLoading) {
    return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-2xl p-6 relative overflow-y-auto max-h-[90vh] rounded-2xl animate-pulse">

          {/* Close Button (disabled during loading) */}
          <div className="absolute top-4 right-4 text-gray-300">
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </div>

          {/* Title Placeholder */}
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-6"></div>

          {/* Items Section */}
          <div className="space-y-5">
            <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-300"
              >
                {/* Image Placeholder */}
                <div className="w-20 h-20 bg-gray-300 rounded-md" />

                {/* Text Info Placeholder */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-300 rounded w-1/4" />
                </div>

                {/* Remove Button Placeholder */}
                <div className="w-4 h-4 bg-gray-300 rounded" />
              </div>
            ))}

            {/* Order Summary Placeholder */}
            <div className="mt-6 space-y-3">
              <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col sm:flex-row gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 bg-gray-200 w-20 rounded"></div>
                    <div className="h-4 bg-gray-300 w-24 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info Placeholder */}
            <div className="mt-6 space-y-3">
              <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col sm:flex-row gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 bg-gray-200 w-16 rounded"></div>
                    <div className="h-4 bg-gray-300 w-28 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Placeholder */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-300 rounded w-full sm:w-32"
                ></div>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>

    );
  }

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

          {order?.items.length === 0 ? (
            <p className="text-gray-500 text-center">Vaša košarica je prazna.</p>
          ) : (
            <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-red-700 rounded-sm mr-2"></span>
                    Items Ordered
                </h3>
              {order?.items.map((item, index) => (
                <div
                  key={`${item.name}-${item.size}-${index}`}
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
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  {/* <button
                    onClick={() => handleRemove()}
                    className="text-red-600 hover:text-red-800 mb-15 cursor-pointer transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button> */}
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
                      <span className="text-sm text-gray-700 font-medium">{order?.items.length}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Total Price</span>
                      <span className="text-sm text-gray-700 font-medium">
                        €{order?.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-2 sm:mb-0">
                      <span className="block text-xs text-gray-500">Payment Method</span>
                      <span className="text-sm text-gray-700 font-medium">{order?.paymentMethod.toWellFormed()}</span>
                    </div>
                    <div className="mb-2 sm:mb-0">
                      <span className="block text-xs text-gray-500">Payment Status</span>
                        <span
                        className={`text-sm font-medium ${
                          order?.paymentStatus.toLowerCase() === 'paid'
                          ? 'text-green-700 bg-green-100 px-2 py-1 rounded'
                          : order?.paymentStatus.toLowerCase() === 'pending'
                          ? 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded'
                          : 'text-gray-700'
                        }`}
                        >
                        {order?.paymentStatus
                          ? order.paymentStatus.toUpperCase()
                          : 'N/A'}
                        </span>
                    </div>
                    <div className="mb-2 sm:mb-0">
                      <span className="block text-xs text-gray-500">Delivery Method</span>
                      <span className="text-sm text-gray-700 font-medium">{order?.customer?.address !== "" ? "Home Delivery" : "Pick Up"}</span>
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
                        <span className="text-sm text-gray-700 font-medium">{order?.customer?.name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Email</span>
                        <span className="text-sm text-gray-700 font-medium">{order?.customer?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Address</span>
                        <span className="text-sm text-gray-700 font-medium">
                          {order?.customer?.address || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => orderId && handleShipStatus(orderId)}
                  disabled={order?.status === 'Shipped' || order?.status === 'Delivered'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition w-full sm:w-auto
                  bg-blue-100 text-blue-700 hover:bg-blue-200
                  ${order?.status === 'Shipped' || order?.status === 'Delivered' ? 'opacity-50 cursor-not-allowed hover:bg-blue-100' : ''}
                  `}
                >
                  <i className="fa fa-truck text-blue-500" aria-hidden="true"></i>
                  Shipped
                </button>
                <button
                  onClick={() => orderId && handleDeliveredStatus(orderId)}
                  disabled={order?.status === 'Delivered'}
                  className={`flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition w-full sm:w-auto
                  ${order?.status === 'Delivered' ? 'opacity-50 cursor-not-allowed hover:bg-green-100' : ''}
                  `}
                >
                  <i className="fa fa-check text-green-400" aria-hidden="true"></i>
                  Delivered
                </button>
                <button
                  onClick={() => orderId && handleCancelStatus(orderId)}
                  disabled={order?.status === 'Delivered' || order?.status === 'Shipped'}
                  className={`flex items-center gap-2 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition font-semibold shadow-sm w-full sm:w-auto
                  ${order?.status === 'Delivered' || order?.status === 'Shipped' ? 'opacity-50 cursor-not-allowed hover:bg-white hover:border-red-300' : ''}
                  `}
                  style={{ minWidth: 120 }}
                >
                  <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
                  Cancel Order
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition font-semibold shadow-sm w-full sm:w-auto"
                  style={{ minWidth: 100 }}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
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
