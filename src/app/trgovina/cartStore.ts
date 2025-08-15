import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  id: string
  name: string
  price: string
  img: string
  size: string | null
  priceWithTax?: string
  quantity: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string) => void
  clearCart: () => void
  paid: boolean
  setPaid: (paid: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      paid: false,
      setPaid: (paid: boolean) => set({ paid }),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (i) => i.id === item.id && i.size === item.size
          )
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          } else {
            return { cart: [...state.cart, item] }
          }
        }),
      removeFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter((item) => !(item.id === id && item.size === size)),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
