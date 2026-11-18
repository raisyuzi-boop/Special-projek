import { ArrowRight, Star } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { cards, offers } from "../data"
import { useShop } from "../shop"
import { btnGhost, btnPrimary, CardFace, HoloFrame } from "./visuals"

const proof = [
  { id: "ar", name: "Aiman" },
  { id: "nh", name: "Nurul" },
  { id: "dt", name: "Darren" },
  { id: "fi", name: "Farah" },
]

export function Hero() {
  const reduce = useReducedMotion()
  const { addItem, openCard } = useShop()
  const prime = cards.find((card) => card.id === "optimus-leader")
  const mega = cards.find((card) => card.id === "mirage")
  const bee = cards.find((card) => card.id === "bumblebee")
  const starter = offers[0]

  return (
    <section id="utama" className="scroll-mt-32 relative overflow-hidden px-5 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="pointer-events-none absolute top-1/2 right-[-12%] hidden h-[560px] w-[560px] -translate-y-1/2 rounded-full border border-autobot/15 lg:block" />
      <div className="pointer-events-none absolute top-1/2 right-[-4%] hidden h-[400px] w-[400px] -translate-y-1/2 rounded-full border border-dashed border-white/10 lg:block" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          <motion.p
            variants={child}
            className="text-[11px] font-medium tracking-[0.22em] text-autobot uppercase"
          >
            Set 04 · Foil holografik
          </motion.p>
          <motion.h1
            variants={child}
            className="mt-4 font-display text-[clamp(3.3rem,8vw,6.4rem)] leading-[0.84] font-extrabold tracking-[-0.02em] uppercase"
          >
            <span className="metal block">Miliki kuasa</span>
            <span className="block text-autobot">Cybertron.</span>
            <span className="metal block">Koleksi kad eksklusif.</span>
          </motion.h1>
          <motion.div variants={child} className="my-8 lg:hidden">
            <HeroStack prime={prime} mega={mega} bee={bee} onOpen={openCard} />
          </motion.div>
          <motion.p variants={child} className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Dapatkan kad dagangan Transformers rasmi dengan kemasan foil holografik, edisi terhad, dan status
            Secret Rare. Setiap kad gred Near Mint, dimasukkan sleeve, dan dihantar dengan penjejakan.
          </motion.p>
          <motion.div variants={child} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#koleksi" className={`${btnPrimary} h-12`}>
              Terokai Koleksi <ArrowRight size={16} />
            </a>
            <button
              type="button"
              className={`${btnGhost} h-12`}
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
          </motion.div>
          <motion.div variants={child} className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2">
              {proof.map((person) => (
                <span
                  key={person.id}
                  className="grid h-8 w-8 place-items-center border border-white/20 bg-[#151a26] text-[10px] tracking-wider text-white uppercase"
                  title={person.name}
                >
                  {person.id}
                </span>
              ))}
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm text-white">
                <Star size={14} className="fill-mythic text-mythic" />
                4.9/5 daripada 2,400+ kolektor
              </p>
              <p className="text-xs text-white/55">Dihantar dalam 24 jam di Semenanjung</p>
            </div>
          </motion.div>
          <motion.dl variants={child} className="mt-8 grid grid-cols-3 border-y border-white/10">
            {[
              [String(cards.length), "Kad dalam set"],
              ["1:96", "Kadar Secret"],
              ["NM", "Gred dijamin"],
            ].map(([value, label]) => (
              <div key={label} className="py-4 pr-2">
                <dt className="text-[10px] tracking-[0.16em] text-white/45 uppercase">{label}</dt>
                <dd className="font-display text-3xl text-white sm:text-4xl">{value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
        <div className="hidden lg:block">
          <HeroStack prime={prime} mega={mega} bee={bee} onOpen={openCard} />
        </div>
      </div>
    </section>
  )
}

const child = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function HeroStack({ prime, mega, bee, onOpen }) {
  const reduce = useReducedMotion()
  if (!prime || !mega || !bee) return null
  return (
    <motion.div
      className="relative mx-auto h-[520px] w-[min(100%,340px)] sm:h-[640px]"
      animate={reduce ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute top-8 left-0 w-[72%] -rotate-12 opacity-80">
        <CardFace card={mega} />
      </div>
      <div className="absolute top-14 right-0 w-[72%] rotate-[10deg] opacity-80">
        <CardFace card={bee} />
      </div>
      <div className="absolute inset-x-8 top-0 z-10">
        <HoloFrame>
          <button type="button" className="block w-full text-left" onClick={() => onOpen(prime)} aria-label={`Lihat ${prime.name}`}>
            <CardFace card={prime} />
          </button>
        </HoloFrame>
        <p className="mt-4 text-center text-[11px] tracking-[0.18em] text-white/50 uppercase">
          Gerakkan kursor pada kad
        </p>
      </div>
      <div className="absolute right-10 -bottom-2 left-10 h-8 rounded-full bg-autobot/20 blur-2xl" />
    </motion.div>
  )
}
