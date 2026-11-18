import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { playSound } from "./sound"

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState(null)
  const [stage, setStage] = useState("cart")
  const [receipt, setReceipt] = useState(null)
  const cartRef = useRef([])
  cartRef.current = cart

  const notify = useCallback((message) => {
    setToast({ id: Date.now(), message })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const locked = cartOpen || Boolean(active)

  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [locked])

  useEffect(() => {
    function onKey(event) {
      if (event.key !== "Escape") return
      setCartOpen(false)
      setActive(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const addItem = useCallback(
    (item, { open = false } = {}) => {
      const prev = cartRef.current
      const qty = item.id.startsWith("hunter-")
        ? prev.filter((entry) => entry.id.startsWith("hunter-")).reduce((sum, entry) => sum + entry.qty, 0)
        : (prev.find((entry) => entry.id === item.id)?.qty ?? 0)
      if (item.stock != null && qty >= item.stock) {
        notify(`Stok ${item.name} tinggal ${item.stock}`)
        return
      }
      setCart((current) => {
        const found = current.find((entry) => entry.id === item.id)
        if (!found) return [...current, { ...item, qty: 1 }]
        return current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry))
      })
      notify(`${item.name} ditambah ke troli`)
      playSound("confirm")
      if (open) {
        setCartOpen(true)
        setActive(null)
      }
    },
    [notify],
  )

  const setQty = useCallback(
    (id, qty) => {
      const item = cartRef.current.find((entry) => entry.id === id)
      if (!item) return
      playSound("tick")
      if (qty <= 0) {
        setCart((prev) => prev.filter((entry) => entry.id !== id))
        return
      }
      const cap = item.stock ?? 99
      const next = Math.min(qty, cap)
      if (qty > cap) notify(`Had stok ${item.name}: ${cap}`)
      setCart((prev) => prev.map((entry) => (entry.id === id ? { ...entry, qty: next } : entry)))
    },
    [notify],
  )

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((entry) => entry.id !== id))
    playSound("tick")
  }, [])

  const toggleWish = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]))
    playSound("tick")
  }, [])

  const openCard = useCallback((card) => {
    setActive(card)
    setCartOpen(false)
    playSound("transform")
  }, [])

  const closeCard = useCallback(() => setActive(null), [])

  const openCart = useCallback(() => {
    setCartOpen(true)
    setActive(null)
  }, [])

  const closeCart = useCallback(() => {
    setCartOpen(false)
    window.setTimeout(() => {
      setStage("cart")
      setReceipt(null)
    }, 280)
  }, [])

  const placeOrder = useCallback((buyer, shippingFee) => {
    const current = cartRef.current
    const total = current.reduce((sum, item) => sum + item.price * item.qty, 0)
    setReceipt({
      no: `CYB-${Date.now().toString().slice(-6)}`,
      buyer,
      items: current,
      subtotal: total,
      shipping: shippingFee,
    })
    setCart([])
    setStage("done")
  }, [])

  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const value = useMemo(
    () => ({
      cart,
      count,
      subtotal,
      cartOpen,
      active,
      wishlist,
      toast,
      stage,
      setStage,
      receipt,
      locked,
      addItem,
      setQty,
      removeItem,
      toggleWish,
      openCard,
      closeCard,
      openCart,
      closeCart,
      placeOrder,
      dismissToast: () => setToast(null),
    }),
    [
      cart,
      count,
      subtotal,
      cartOpen,
      active,
      wishlist,
      toast,
      stage,
      receipt,
      locked,
      addItem,
      setQty,
      removeItem,
      toggleWish,
      openCard,
      closeCard,
      openCart,
      closeCart,
      placeOrder,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const value = useContext(ShopContext)
  if (!value) throw new Error("useShop mesti berada dalam ShopProvider")
  return value
}
