import { BadgeCheck, ShieldCheck, Truck } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import {
  faqs,
  formatRM,
  guarantees,
  offers,
  payments,
  reasons,
  reviews,
  shippingRates,
  socials,
  ticker,
} from "../data"
import { playSound } from "../sound"
import { useShop } from "../shop"
import { btnGhost, btnPrimary, Eyebrow, Reveal } from "./visuals"

const reasonIcons = [BadgeCheck, ShieldCheck, Truck]
const reviewFilters = [
  { id: "semua", label: "Semua" },
  { id: "secret", label: "Secret Rare" },
  { id: "penghantaran", label: "Penghantaran" },
  { id: "keadaan", label: "Keadaan kad" },
]

export function Guarantee() {
  return (
    <section id="jaminan" className="scroll-mt-32 px-5" aria-label="Jaminan">
      <div className="mx-auto grid max-w-[1200px] border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((item) => (
          <div key={item.title} className="border-white/10 px-5 py-5 not-last:border-b sm:odd:border-r lg:border-r lg:border-b-0 lg:last:border-r-0">
            <p className="font-display text-2xl text-white uppercase">{item.title}</p>
            <p className="mt-1 text-sm text-white/55">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function WhyUs() {
  return (
    <section className="scroll-mt-32 px-5 py-16 md:py-24" aria-labelledby="nilai-tajuk">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>Nilai tawaran</Eyebrow>
        <h2 id="nilai-tajuk" className="mt-2 max-w-3xl font-display text-5xl leading-[0.9] text-white uppercase md:text-6xl">
          Mengapa kolektor memilih kami
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reasonIcons[index]
            return (
              <Reveal key={reason.title}>
                <article className="h-full border border-white/10 bg-white/[0.02] p-6">
                  <Icon className={index === 1 ? "text-mythic" : index === 2 ? "text-optimus" : "text-autobot"} size={22} />
                  <h3 className="mt-5 font-display text-3xl leading-none text-white uppercase">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{reason.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Ticker() {
  const loop = [...ticker, ...ticker]
  return (
    <div className="ticker overflow-hidden border-y border-white/10" aria-label="Aktiviti terkini">
      <div className="ticker-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-3 px-6 py-3 text-[11px] tracking-[0.16em] whitespace-nowrap text-white/70 uppercase">
            <span className="h-1.5 w-1.5 bg-autobot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Reviews() {
  const [filter, setFilter] = useState("semua")
  const list = reviews.filter((review) => filter === "semua" || review.tag === filter)
  return (
    <section id="ulasan" className="scroll-mt-32 px-5 py-16 md:py-24" aria-labelledby="ulasan-tajuk">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>Ulasan kolektor</Eyebrow>
        <h2 id="ulasan-tajuk" className="mt-2 font-display text-5xl text-white uppercase md:text-6xl">
          Dari meja kolektor
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {reviewFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id)
                playSound("tick")
              }}
              className={`h-9 px-3 text-[11px] tracking-[0.14em] uppercase ${filter === item.id ? "bg-white text-void" : "border border-white/15 text-white/70"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((review) => (
            <article key={review.id} className="border border-white/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-mythic" aria-label={`${review.stars} daripada 5 bintang`}>
                  {"★".repeat(review.stars)}
                  <span className="text-white/25">{"★".repeat(5 - review.stars)}</span>
                </p>
                <p className="text-[11px] tracking-[0.14em] text-white/40 uppercase">{review.date}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">{review.text}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="grid h-9 w-9 place-items-center bg-white/5 text-[11px] text-white">
                  {review.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm text-white">
                    {review.name} · {review.city}
                  </p>
                  <p className="text-[11px] tracking-[0.12em] text-white/45 uppercase">{review.bought}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Shipping() {
  return (
    <section id="penghantaran" className="scroll-mt-32 px-5 pb-8" aria-labelledby="hantar-tajuk">
      <div className="mx-auto grid max-w-[1200px] gap-8 border border-white/10 p-6 md:p-8 lg:grid-cols-2">
        <div>
          <Eyebrow>Logistik</Eyebrow>
          <h2 id="hantar-tajuk" className="mt-2 font-display text-4xl text-white uppercase">
            Penghantaran
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead className="text-[11px] tracking-[0.14em] text-white/45 uppercase">
                <tr>
                  <th className="py-2 font-medium">Wilayah</th>
                  <th className="py-2 font-medium">Kadar</th>
                  <th className="py-2 font-medium">Masa</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((row) => (
                  <tr key={row.region} className="border-t border-white/10">
                    <td className="py-3 text-white">
                      {row.region}
                      <span className="block text-xs text-white/45">{row.free}</span>
                    </td>
                    <td className="py-3">{row.fee}</td>
                    <td className="py-3 text-white/70">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <Eyebrow>Bayaran</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-white uppercase">Saluran selamat</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {payments.map((pay) => (
              <span key={pay} className="border border-white/15 px-3 py-2 text-[12px] tracking-[0.12em] text-white/80 uppercase">
                {pay}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Bayaran penuh untuk preorder. Jika drop dibatalkan, wang dipulangkan dalam 3 hari bekerja ke kaedah asal.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="soalan" className="scroll-mt-32 px-5 py-16 md:py-24" aria-labelledby="soalan-tajuk">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <Eyebrow>Soalan lazim</Eyebrow>
          <h2 id="soalan-tajuk" className="mt-2 font-display text-5xl leading-[0.9] text-white uppercase">
            Sebelum anda bayar
          </h2>
        </div>
        <div className="border-t border-white/10">
          {faqs.map((item, index) => {
            const expanded = open === index
            return (
              <div key={item.q} className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={expanded}
                  onClick={() => {
                    setOpen(expanded ? -1 : index)
                    playSound("tick")
                  }}
                >
                  <span className="font-display text-2xl text-white uppercase">{item.q}</span>
                  <span className="text-autobot">{expanded ? "–" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-4 text-sm leading-relaxed text-white/65">{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  const { addItem } = useShop()
  const starter = offers[0]
  return (
    <section className="px-5 pb-16" aria-labelledby="tutup-tajuk">
      <div className="mx-auto max-w-[1200px] border border-white/10 bg-[linear-gradient(120deg,rgba(255,31,61,0.16),rgba(10,12,20,0.1)_42%,rgba(0,240,255,0.14))] px-6 py-12 md:px-12">
        <p className="text-[11px] tracking-[0.2em] text-autobot uppercase">Pek Permulaan · {formatRM(starter.price)}</p>
        <h2 id="tutup-tajuk" className="mt-3 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.88] text-white uppercase">
          Mula dengan dua belas kad. Satu Rare dijamin.
        </h2>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className={`${btnPrimary} h-12`}
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
            Dapatkan Pek Permulaan
          </button>
          <a href="#koleksi" className={`${btnGhost} h-12`}>
            Lihat kad tunggal
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer id="pengaki" className="border-t border-white/10 px-5 pt-12 pb-28 lg:pb-10">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <p className="font-display text-3xl tracking-[0.14em] text-white">CYBERTRON CARDS</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
            Kad dagangan Transformers dengan foil holografik, edisi terhad, dan perlindungan penghantaran.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socials.map((name) => (
              <a key={name} href="#pengaki" className="text-[12px] tracking-[0.14em] text-white/70 uppercase hover:text-autobot">
                {name}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/40 uppercase">Dokumen</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-autobot" href="#terma">Terma perkhidmatan</a></li>
            <li><a className="hover:text-autobot" href="#penghantaran">Penghantaran & pemulangan</a></li>
            <li><a className="hover:text-autobot" href="#jaminan">Ketulenan</a></li>
            <li><a className="hover:text-autobot" href="#privasi">Privasi</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/40 uppercase">Bayaran selamat</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {payments.map((pay) => (
              <span key={pay} className="border border-white/15 px-2 py-1 text-[10px] tracking-[0.12em] text-white/70 uppercase">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div id="terma" className="mx-auto mt-10 grid max-w-[1200px] gap-6 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45 md:grid-cols-2">
        <p>
          Pesanan yang sudah dibuka sleeve tidak dipulangkan kecuali kad tidak tulen atau rosak semasa transit. Had preorder
          Mythic Matrix ialah 2 kotak seorang pelanggan.
        </p>
        <p id="privasi">
          E-mel senarai drop hanya digunakan untuk amaran edisi itu. Angka ulasan, stok, dan nama pada halaman ini ialah data
          contoh untuk pratonton rekaan.
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-[1200px] text-[11px] text-white/35">
        © 2026 Cybertron Cards. Transformers dan nama watak adalah tanda dagangan pemilik masing-masing.
      </p>
    </footer>
  )
}
