import { useReducedMotion } from "framer-motion"
import { motion } from "framer-motion"
import { useState } from "react"
import { factionLabel, formatPower, formatRM, rarityMeta } from "../data"
import { Portrait } from "./portraits"

export const btnPrimary =
  "chamfer cta-shift inline-flex items-center justify-center gap-2 px-6 text-[13px] font-semibold tracking-[0.16em] text-white uppercase disabled:cursor-not-allowed disabled:opacity-40"
export const btnGhost =
  "chamfer inline-flex items-center justify-center gap-2 border border-white/25 px-6 text-[13px] font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:border-autobot hover:text-autobot"

export function Mark({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 2.5 27.5 9v14L16 29.5 4.5 23V9Z" fill="none" stroke="#00f0ff" strokeWidth="1.4" />
      <path d="M16 8.5 22.5 16 16 23.5 9.5 16Z" fill="#00f0ff" />
    </svg>
  )
}

export function RarityBadge({ rarity }) {
  const meta = rarityMeta[rarity]
  return (
    <span className={`border px-1.5 py-0.5 text-[9px] tracking-[0.16em] uppercase ${meta.tone}`}>
      {meta.short}
    </span>
  )
}

export function Eyebrow({ children }) {
  return <p className="text-[11px] font-medium tracking-[0.22em] text-autobot uppercase">{children}</p>
}

export function Reveal({ children, className = "" }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function HoloFrame({ children, className = "" }) {
  const [pos, setPos] = useState({ x: 50, y: 32, on: false })

  function move(event) {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    setPos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      on: true,
    })
  }

  const tilt = pos.on
    ? `rotateX(${((pos.y - 50) / 50) * -9}deg) rotateY(${((pos.x - 50) / 50) * 11}deg)`
    : "rotateX(0deg) rotateY(0deg)"

  return (
    <div className={`[perspective:1100px] ${className}`}>
      <div
        onPointerMove={move}
        onPointerLeave={() => setPos({ x: 50, y: 32, on: false })}
        className="group relative p-[1.5px]"
        style={{
          transform: tilt,
          transformStyle: "preserve-3d",
          transition: pos.on ? "none" : "transform 420ms ease",
        }}
      >
        <div className="holo-ring pointer-events-none absolute inset-0 rounded-[22px]" />
        <div className="relative overflow-hidden rounded-[20px] bg-[#0c1018] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          {children}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: pos.on ? 0.55 : 0.28,
              mixBlendMode: "screen",
              background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,.62), transparent 26%), linear-gradient(115deg, transparent 18%, rgba(0,240,255,.32) 36%, rgba(255,255,255,.55) 48%, rgba(255,31,61,.3) 62%, rgba(245,193,108,.42) 76%, transparent 88%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function CardFace({ card, bare = false }) {
  if (!card) return null
  const low = card.stock > 0 && card.stock <= 5
  if (card.image) {
    return (
      <div className="bg-[#0c1018]">
        <img src={card.image} alt={card.name} className="aspect-[5/7] w-full object-cover" />
        {bare ? null : (
          <div className="flex items-end justify-between gap-2 px-2.5 py-2">
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-xl leading-none text-white">{formatRM(card.price)}</span>
              {card.was ? <span className="text-[11px] text-white/40 line-through">{formatRM(card.was)}</span> : null}
            </p>
            <span className={`text-[10px] tracking-[0.14em] ${low ? "text-optimus" : "text-white/50"}`}>
              {card.stock === 0 ? "HABIS" : low ? `TINGGAL ${card.stock}` : `STOK ${card.stock}`}
            </span>
          </div>
        )}
      </div>
    )
  }
  return (
    <div
      className="relative aspect-[5/7] overflow-hidden"
      style={{
        background: `radial-gradient(90% 58% at 50% 16%, ${card.glow}55, transparent 62%), linear-gradient(180deg, #171c29 0%, #0b0e16 72%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute -right-1 -top-4 font-display text-[5.5rem] leading-none text-white/[0.05]">
        {card.number.slice(0, 2)}
      </div>
      <div className="relative flex h-full flex-col p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <RarityBadge rarity={card.rarity} />
          <span className="font-display text-sm tracking-widest text-white/70">{card.number}</span>
        </div>
        <div className="relative min-h-28 flex-1">
          {card.image ? (
            <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <Portrait id={card.id} />
          )}
        </div>
        <div className="border-t border-white/10 pt-2.5">
          <div className="flex items-center justify-between text-[10px] tracking-[0.16em] text-white/60 uppercase">
            <span>{factionLabel(card.faction)}</span>
            <span>ATK {formatPower(card.power)}</span>
          </div>
          <p className="mt-1 font-display text-[1.15rem] leading-[0.9] text-white uppercase sm:text-[1.35rem]">
            {card.name}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-white/45 uppercase">{card.alt}</p>
          <div className="mt-2 h-1 bg-white/10">
            <div className="h-full" style={{ width: `${card.power / 100}%`, background: card.glow }} />
          </div>
          <div className="mt-2.5 flex items-end justify-between gap-2">
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl leading-none text-white">{formatRM(card.price)}</span>
              {card.was ? (
                <span className="text-[11px] text-white/40 line-through">{formatRM(card.was)}</span>
              ) : null}
            </p>
            <span className={`text-[10px] tracking-[0.14em] ${low ? "text-optimus" : "text-white/50"}`}>
              {card.stock === 0 ? "HABIS" : low ? `TINGGAL ${card.stock}` : `STOK ${card.stock}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
