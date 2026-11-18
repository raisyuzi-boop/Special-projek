import { Menu, ShoppingCart, Volume2, VolumeX, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { offers, navLinks } from "../data"
import { playSound, useSoundGate } from "../sound"
import { useShop } from "../shop"
import { btnPrimary, Mark } from "./visuals"

export function Header() {
  const { count, openCart } = useShop()
  const { on: soundOn, reduced: soundReduced, toggle } = useSoundGate()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40">
      <div className="flex h-9 items-center justify-center gap-3 border-b border-white/10 bg-[#070910] px-4 text-[11px] tracking-[0.16em] text-white/80 uppercase">
        <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-optimus" />
        <p className="truncate">Mythic Matrix · 400 kotak · 21 Nov, 9 malam</p>
        <a href="#edisi" className="shrink-0 text-autobot">
          Dapatkan amaran
        </a>
      </div>
      <div className="border-b border-white/10 bg-void/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-4 px-5">
          <a href="#utama" className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center">
              <span className="absolute inset-0 rounded-full bg-autobot/25 blur-md" />
              <Mark className="relative h-8 w-8" />
            </span>
            <span className="font-display text-xl tracking-[0.16em] text-white">
              CYBERTRON <span className="hidden text-autobot sm:inline">CARDS</span>
            </span>
          </a>
          <nav className="ml-6 hidden items-center gap-6 md:flex" aria-label="Utama">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-[13px] text-white/70 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a href="#tawaran" className={`${btnPrimary} h-11 px-4 text-[12px] max-md:!hidden`}>
              Beli Sekarang
            </a>
            <button
              type="button"
              disabled={soundReduced}
              aria-pressed={soundOn && !soundReduced}
              aria-label={
                soundReduced ? "Bunyi dimatikan bersama animasi sistem" : soundOn ? "Senyapkan bunyi" : "Hidupkan bunyi"
              }
              className="grid h-11 w-11 place-items-center border border-white/15 disabled:opacity-40"
              onClick={() => {
                const next = toggle()
                if (next) playSound("tick")
              }}
            >
              {soundOn && !soundReduced ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative grid h-11 w-11 place-items-center border border-white/15"
              aria-label={`Troli, ${count} item`}
            >
              <ShoppingCart size={18} />
              {count > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center bg-optimus px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center border border-white/15 md:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => {
                setOpen((value) => !value)
                playSound("tick")
              }}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            key="menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute inset-x-0 border-b border-white/10 bg-[#0a0c14] px-5 py-4 md:hidden"
            aria-label="Menu mudah alih"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3 text-sm tracking-[0.14em] text-white uppercase"
                >
                  {link.label}
                </a>
              ))}
              <a href="#tawaran" onClick={() => setOpen(false)} className={`${btnPrimary} mt-4 h-12`}>
                Beli Sekarang
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export function MobileBar() {
  const { addItem } = useShop()
  const starter = offers[0]
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0c14]/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-white/55">PEK PERMULAAN</p>
          <p className="font-display text-2xl leading-none text-white">RM 89</p>
        </div>
        <button
          type="button"
          className={`${btnPrimary} h-11 px-4 text-[12px]`}
          onClick={() =>
            addItem(
              {
                id: starter.id,
                name: starter.name,
                price: starter.price,
                stock: starter.stock,
                accent: starter.accent,
                kind: "bundle",
              },
              { open: true },
            )
          }
        >
          Beli Pek
        </button>
      </div>
    </div>
  )
}
