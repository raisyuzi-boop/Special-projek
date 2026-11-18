import { useEffect, useState } from "react"
import { drop, factionLabel, formatRM, offers, rarityMeta, rarityTiers, steps } from "../data"
import { playSound } from "../sound"
import { useShop } from "../shop"
import { btnPrimary, Eyebrow, RarityBadge, Reveal } from "./visuals"

export function HowItWorks() {
  return (
    <section className="scroll-mt-32 px-5 pb-8" aria-labelledby="cara-tajuk">
      <div className="mx-auto max-w-[1200px] border-y border-white/10 py-10">
        <h2 id="cara-tajuk" className="sr-only">
          Cara pembelian
        </h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="font-display text-3xl text-autobot">{step.n}</span>
              <div>
                <p className="font-display text-2xl tracking-wide text-white uppercase">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Countdown() {
  const time = useCountdown(drop.iso)
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState("")
  const claimed = Math.round((drop.claimed / drop.total) * 100)

  function submit(event) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Masukkan e-mel yang sah.")
      return
    }
    setError("")
    setJoined(true)
    playSound("confirm")
  }

  return (
    <section id="edisi" className="scroll-mt-32 px-5 py-12 md:py-16" aria-labelledby="edisi-tajuk">
      <Reveal>
        <div className="relative mx-auto max-w-[1200px] overflow-hidden border border-white/10 bg-[#0d1018]">
          <div className="banner-stage">
            <img
              src={`${import.meta.env.BASE_URL}banner/performance-robots.png`}
              alt="Barisan robot persembahan: Transformers, mega mech, dan robot sebenar."
              className="banner-film"
            />
            <span className="banner-sheen" />
          </div>
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.05fr_auto_.9fr] lg:items-center">
          <div className="relative z-10">
            <Eyebrow>Drop terhad</Eyebrow>
            <h2 id="edisi-tajuk" className="mt-2 font-display text-5xl leading-[0.9] text-white uppercase md:text-6xl">
              {drop.title}
            </h2>
            <p className="mt-3 text-sm text-mythic">{drop.whenLabel}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{drop.summary}</p>
            <div className="mt-5 h-1 bg-white/10">
              <div className="h-full bg-optimus" style={{ width: `${claimed}%` }} />
            </div>
            <p className="mt-2 text-[11px] tracking-[0.16em] text-white/55 uppercase">
              {drop.claimed}/{drop.total} kotak ditempah
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-4 gap-2" aria-label="Masa berbaki">
            {[
              [time.days, "Hari"],
              [time.hours, "Jam"],
              [time.minutes, "Minit"],
              [time.seconds, "Saat"],
            ].map(([value, label]) => (
              <div key={label} className="min-w-[68px] border border-white/10 bg-black/30 px-2 py-3 text-center">
                <div className="font-display text-4xl leading-none text-white">{String(value).padStart(2, "0")}</div>
                <div className="mt-1 text-[10px] tracking-[0.18em] text-white/55 uppercase">{label}</div>
              </div>
            ))}
          </div>
          <div className="relative z-10">
            {joined ? (
              <p className="text-sm leading-relaxed text-white" role="status">
                Anda dalam senarai. Kami maklumkan 15 minit sebelum drop. {(drop.waitlist + 1).toLocaleString("en-MY")} kolektor sudah mendaftar.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <p className="text-sm text-white/70">
                  {drop.waitlist.toLocaleString("en-MY")} kolektor mahu amaran 15 minit sebelum kotak dibuka.
                </p>
                <label htmlFor="amaran" className="sr-only">
                  E-mel
                </label>
                <input
                  id="amaran"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="emel@anda.com"
                  className="h-12 w-full border border-white/15 bg-white/[0.03] px-4 text-sm outline-none focus:border-autobot"
                />
                {error ? <p className="text-xs text-optimus">{error}</p> : null}
                <button type="submit" className={`${btnPrimary} h-12 w-full`}>
                  Maklumkan saya
                </button>
              </form>
            )}
          </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Offers() {
  const { addItem } = useShop()
  const [faction, setFaction] = useState("autobot")

  return (
    <section id="tawaran" className="scroll-mt-32 px-5 py-8 md:py-12" aria-labelledby="tawaran-tajuk">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>Tiga cara masuk</Eyebrow>
        <h2 id="tawaran-tajuk" className="mt-2 font-display text-5xl text-white uppercase md:text-6xl">
          Pilih tawaran
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className={`relative border p-6 ${offer.emphasis ? "border-mythic bg-[#14110c] lg:-translate-y-3" : "border-white/10 bg-white/[0.02]"}`}
            >
              {offer.badge ? (
                <p className="absolute -top-3 left-6 bg-mythic px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-void uppercase">
                  {offer.badge}
                </p>
              ) : null}
              <h3 className="font-display text-3xl text-white uppercase">{offer.name}</h3>
              <p className="mt-4 flex items-end gap-3">
                <span className="font-display text-5xl leading-none text-white">{formatRM(offer.price)}</span>
                <span className="text-sm text-white/40 line-through">{formatRM(offer.was)}</span>
              </p>
              <p className="mt-1 text-sm text-autobot">Jimat {formatRM(offer.was - offer.price)}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {offer.points.map((point) => (
                  <li key={point} className="border-t border-white/10 pt-2">
                    {point}
                  </li>
                ))}
              </ul>
              {offer.chooseFaction ? (
                <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Pilih faksi">
                  {["autobot", "decepticon"].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setFaction(id)
                        playSound("tick")
                      }}
                      aria-pressed={faction === id}
                      className={`h-10 text-[11px] tracking-[0.14em] uppercase ${faction === id ? "bg-white text-void" : "border border-white/15 text-white/70"}`}
                    >
                      {factionLabel(id)}
                    </button>
                  ))}
                </div>
              ) : null}
              <p className="mt-4 text-[11px] tracking-[0.14em] text-white/50 uppercase">Tinggal {offer.stock}</p>
              <button
                type="button"
                className={`${btnPrimary} mt-4 h-12 w-full`}
                onClick={() =>
                  addItem(
                    {
                      id: offer.chooseFaction ? `${offer.id}-${faction}` : offer.id,
                      name: offer.chooseFaction ? `${offer.name} · ${factionLabel(faction)}` : offer.name,
                      price: offer.price,
                      stock: offer.stock,
                      accent: offer.accent,
                      kind: "bundle",
                    },
                    { open: true },
                  )
                }
              >
                Tambah ke troli
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Rarity() {
  return (
    <section id="nadir" className="scroll-mt-32 px-5 py-12 md:py-16" aria-labelledby="nadir-tajuk">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Kadar set</Eyebrow>
            <h2 id="nadir-tajuk" className="mt-2 font-display text-5xl text-white uppercase">
              Sistem nadir
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Pek rawak. Kotak 24 pek menjamin satu Secret Rare. Angka ini untuk Mythic Matrix Edition.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.03] text-[11px] tracking-[0.16em] text-white/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Kadar tarikan</th>
                <th className="px-4 py-3 font-medium">Nota</th>
              </tr>
            </thead>
            <tbody>
              {rarityTiers.map((tier) => (
                <tr key={tier.id} className="border-t border-white/10">
                  <td className="px-4 py-4">
                    <RarityBadge rarity={tier.id} />
                    <span className="ml-3 text-white">{rarityMeta[tier.id].label}</span>
                  </td>
                  <td className="px-4 py-4 font-display text-2xl tracking-wide text-white">{tier.pull}</td>
                  <td className="px-4 py-4 text-white/65">{tier.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}
