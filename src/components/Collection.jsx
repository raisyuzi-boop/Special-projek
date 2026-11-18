import { Heart, Search, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { cards, factionLabel, formatPower, formatRM, rarityMeta } from "../data"
import { playSound } from "../sound"
import { useShop } from "../shop"
import { btnPrimary, CardFace, Eyebrow, HoloFrame, RarityBadge } from "./visuals"

const filters = [
  { id: "semua", label: "Semua" },
  { id: "heroic", label: "Heroic" },
  { id: "mythical", label: "Mythical" },
  { id: "epic", label: "Epic" },
  { id: "rare", label: "Rare" },
]

function toCart(card) {
  return {
    id: card.id,
    name: card.name,
    price: card.price,
    stock: card.stock,
    accent: card.glow,
    kind: "card",
    image: card.image,
  }
}

export function Collection() {
  const { addItem, openCard, toggleWish, wishlist } = useShop()
  const [filter, setFilter] = useState("semua")
  const [sort, setSort] = useState("featured")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = cards.filter((card) => {
      const tierOk = filter === "semua" || card.rarity === filter
      const queryOk = !q || `${card.name} ${card.alt} ${card.mode} ${card.number}`.toLowerCase().includes(q)
      return tierOk && queryOk
    })
    const sorted = [...list]
    if (sort === "rarity") sorted.sort((a, b) => rarityMeta[b.rarity].rank - rarityMeta[a.rarity].rank)
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price)
    if (sort === "power") sorted.sort((a, b) => (b.power || 0) - (a.power || 0))
    return sorted
  }, [filter, query, sort])

  return (
    <section id="koleksi" className="scroll-mt-32 px-5 py-12 md:py-16" aria-labelledby="koleksi-tajuk">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Kad tunggal</Eyebrow>
            <h2 id="koleksi-tajuk" className="mt-2 font-display text-5xl text-white uppercase md:text-6xl">
              Koleksi
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            {visible.length} kad dari fail anda. Cari nama, nombor, atau mod. Klik kad untuk butiran alt.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Tapis tier">
            {filters.map((item) => {
              const count = item.id === "semua" ? cards.length : cards.filter((card) => card.rarity === item.id).length
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id)
                    playSound("tick")
                  }}
                  className="relative px-4 py-2 text-[12px] tracking-[0.14em] text-white uppercase"
                  aria-pressed={filter === item.id}
                >
                  {filter === item.id ? (
                    <motion.span layoutId="filter-chip" className="absolute inset-0 border border-autobot/50 bg-autobot/10" />
                  ) : null}
                  <span className="relative">
                    {item.label} <span className="text-white/40">{count}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <label htmlFor="cari" className="sr-only">
                Cari kad
              </label>
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/45" />
              <input
                id="cari"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari Mirage, 555, alt..."
                className="h-11 w-full border border-white/15 bg-transparent pr-3 pl-10 text-sm outline-none focus:border-autobot sm:w-64"
              />
            </div>
            <label htmlFor="susun" className="sr-only">
              Susun kad
            </label>
            <select
              id="susun"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 border border-white/15 bg-void px-3 text-sm outline-none focus:border-autobot"
            >
              <option value="featured">Pilihan editor</option>
              <option value="rarity">Nadir tertinggi</option>
              <option value="price-asc">Harga rendah</option>
              <option value="price-desc">Harga tinggi</option>
              <option value="power">Kuasa tertinggi</option>
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 border border-dashed border-white/15 px-6 py-12 text-center">
            <p className="text-white">Tiada kad untuk carian ini.</p>
            <button
              type="button"
              className="mt-4 text-sm text-autobot"
              onClick={() => {
                setFilter("semua")
                setQuery("")
              }}
            >
              Set semula tapisan
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4 md:gap-x-5">
            <AnimatePresence mode="popLayout">
              {visible.map((card) => {
                const wished = wishlist.includes(card.id)
                return (
                  <motion.article
                    layout
                    key={card.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <HoloFrame>
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={() => openCard(card)}
                        aria-label={`Lihat ${card.name}`}
                      >
                        <CardFace card={card} />
                      </button>
                    </HoloFrame>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={card.stock === 0}
                        className={`${btnPrimary} chamfer-sm h-11 flex-1 px-2 text-[11px]`}
                        onClick={() =>
                          addItem(toCart(card))
                        }
                      >
                        <span className="sm:hidden">{card.stock === 0 ? "Habis" : "Tambah"}</span>
                        <span className="hidden sm:inline">{card.stock === 0 ? "Habis dijual" : "Tambah ke Troli"}</span>
                      </button>
                      <button
                        type="button"
                        aria-pressed={wished}
                        aria-label={wished ? `Buang ${card.name} daripada simpanan` : `Simpan ${card.name}`}
                        onClick={() => toggleWish(card.id)}
                        className="grid h-11 w-11 shrink-0 place-items-center border border-white/15"
                      >
                        <Heart size={16} className={wished ? "fill-optimus text-optimus" : ""} />
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

export function CardModal() {
  const { active, closeCard, addItem, wishlist, toggleWish, openCard } = useShop()
  const reduce = useReducedMotion()
  const [showDetail, setShowDetail] = useState(false)
  useEffect(() => {
    setShowDetail(false)
  }, [active?.id])
  const face = active && showDetail && active.detail ? { ...active, image: active.detail } : active
  const related = active
    ? cards.filter((card) => card.id !== active.id && card.rarity === active.rarity).slice(0, 3)
    : []

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key={active.id}
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-[#05070d]/80" aria-label="Tutup butiran kad" onClick={closeCard} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-title"
            initial={reduce ? false : { y: 24 }}
            animate={{ y: 0 }}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-white/10 bg-[#0d111a] p-5 sm:p-6"
          >
            <button
              type="button"
              onClick={closeCard}
              autoFocus
              className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center border border-white/15 bg-[#0d111a]"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div>
                {active.detail ? (
                  <div className="mb-3 flex gap-2" role="group" aria-label="Pilih muka kad">
                    <button
                      type="button"
                      aria-pressed={!showDetail}
                      onClick={() => {
                        setShowDetail(false)
                        playSound("transform")
                      }}
                      className={`h-9 flex-1 text-[11px] tracking-[0.14em] uppercase ${showDetail ? "border border-white/15 text-white/70" : "bg-white text-void"}`}
                    >
                      Kad
                    </button>
                    <button
                      type="button"
                      aria-pressed={showDetail}
                      onClick={() => {
                        setShowDetail(true)
                        playSound("transform")
                      }}
                      className={`h-9 flex-1 text-[11px] tracking-[0.14em] uppercase ${showDetail ? "bg-white text-void" : "border border-white/15 text-white/70"}`}
                    >
                      Butiran
                    </button>
                  </div>
                ) : null}
                <HoloFrame>
                  <CardFace card={face} bare />
                </HoloFrame>
              </div>
              <div className="lg:pt-2">
                <RarityBadge rarity={active.rarity} />
                <h2 id="card-title" className="mt-3 font-display text-5xl leading-none text-white uppercase">
                  {active.name}
                </h2>
                <p className="mt-2 text-sm tracking-[0.16em] text-white/55 uppercase">
                  {factionLabel(active.faction)} · {showDetail && active.detailMode ? active.detailMode : active.mode} · {active.alt}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-white/40 uppercase">
                  {active.film} · {rarityMeta[active.rarity].label}
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{active.blurb}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4 sm:grid-cols-4">
                  <div>
                    <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">ATK</dt>
                    <dd className="font-display text-3xl text-white">{active.power ? formatPower(active.power) : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">HP</dt>
                    <dd className="font-display text-3xl text-white">{active.hp ? formatPower(active.hp) : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">Stok</dt>
                    <dd className="font-display text-3xl text-white">{active.stock}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">Harga</dt>
                    <dd className="font-display text-3xl text-white">{formatRM(active.price)}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-white/50">Disarung · Near Mint · Siri pada Secret Rare dan Mythic.</p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    disabled={active.stock === 0}
                    className={`${btnPrimary} h-12 flex-1`}
                    onClick={() =>
                      addItem(toCart(active), { open: true })
                    }
                  >
                    {active.stock === 0 ? "Habis dijual" : "Tambah ke Troli"}
                  </button>
                  <button
                    type="button"
                    className="h-12 border border-white/15 px-4 text-[12px] tracking-[0.14em] uppercase"
                    aria-pressed={wishlist.includes(active.id)}
                    onClick={() => toggleWish(active.id)}
                  >
                    {wishlist.includes(active.id) ? "Disimpan" : "Simpan"}
                  </button>
                </div>
                {related.length > 0 ? (
                  <div className="mt-8">
                    <p className="text-[11px] tracking-[0.16em] text-white/45 uppercase">Kolektor juga melihat</p>
                    <div className="mt-3 grid gap-2">
                      {related.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => openCard(card)}
                          className="flex items-center justify-between border border-white/10 px-3 py-2 text-left hover:border-autobot/40"
                        >
                          <span>
                            <span className="block font-display text-xl text-white uppercase">{card.name}</span>
                            <span className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                              {rarityMeta[card.rarity].label}
                            </span>
                          </span>
                          <span className="font-display text-xl text-white">{formatRM(card.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
