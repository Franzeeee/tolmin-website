'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { BellIcon } from '@heroicons/react/24/outline'

type OrderSummary = {
  _id: string
  customer?: { name?: string; email?: string }
  totalPrice?: number
  orderedAt?: string
  createdAt?: string
}

const STORAGE_KEY = 'admin_last_seen_order'
const POLL_INTERVAL_MS = 45_000

function getOrderTimestamp(order: OrderSummary): number {
  const raw = order.orderedAt || order.createdAt
  return raw ? new Date(raw).getTime() : 0
}

export default function NotificationBell() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [lastSeen, setLastSeen] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [panelOrders, setPanelOrders] = useState<OrderSummary[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setLastSeen(Number(stored))
    } catch {
      // localStorage unavailable — badge just won't persist across reloads
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get<OrderSummary[]>('/api/orders')
      setOrders(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Failed to fetch orders for notifications:', error)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchOrders])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unseenOrders = orders
    .filter((o) => getOrderTimestamp(o) > lastSeen)
    .sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a))

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        // Snapshot what's unseen right now so the panel still shows it after
        // lastSeen updates below (which would otherwise filter it out on the
        // very next render, before the user ever sees it).
        setPanelOrders(unseenOrders);
        if (unseenOrders.length > 0) {
          const newest = Math.max(...orders.map(getOrderTimestamp));
          setLastSeen(newest);
          try {
            localStorage.setItem(STORAGE_KEY, String(newest));
          } catch {
            // ignore
          }
        }
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unseenOrders.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold">
            {unseenOrders.length > 9 ? '9+' : unseenOrders.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 font-semibold text-sm text-gray-700">
            Nova naročila
          </div>
          <div className="max-h-80 overflow-y-auto">
            {panelOrders.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">Ni novih naročil.</div>
            ) : (
              panelOrders.map((order) => (
                <Link
                  key={order._id}
                  href="/admin/shop/orders"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-800 truncate">
                      {order.customer?.name || order.customer?.email || 'Naročilo'}
                    </span>
                    <span className="text-red-600 font-semibold whitespace-nowrap">
                      €{Number(order.totalPrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {order.orderedAt || order.createdAt
                      ? new Date(order.orderedAt || order.createdAt!).toLocaleString('sl-SI')
                      : ''}
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/admin/shop/orders"
            onClick={() => setOpen(false)}
            className="block text-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100"
          >
            Prikaži vsa naročila
          </Link>
        </div>
      )}
    </div>
  )
}
