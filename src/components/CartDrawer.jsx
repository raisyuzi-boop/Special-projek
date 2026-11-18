import { Minus, Plus, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { formatRM, FREE_SHIPPING, quoteShipping, states, upsells } from "../data"
import { useShop } from "../shop"
import { Portrait } from "./portraits"
import { btnPrimary, Mark } from "./visuals"

export function CartDrawer() {
  const { cartOpen, closeCart, cart, subtotal, setQty, removeItem, addItem, stage, setStage, placeOrder, receipt } =
    useShop()
  const reduce = useReducedMotion()
  const [buyer, setBuyer] = useState({ name: "", phone: "", state: "Selangor", note: "" })
  const [error, setError] = useState("")
  const gap = Math.max(0, FREE_SHIPPING - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100)
  const shipping = quoteShipping(buyer.state, subtotal)
  const suggestion = upsells.find((item) => !cart.some((entry) => entry.id === item.id))

  function update(field, value) {
    setBuyer((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (buyer.name.trim().length < 2) {
      setError("Nama diperlukan.")
      return
    }
    if (buyer.phone.replace(/\D/g, "").length < 9) {
      setError("Nombor telefon tidak lengkap.")
      return
    }
    setError("")
    placeOrder(buyer, shipping.fee)
  }

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            key="cart-backdrop"
            type="button"
            aria-label="Tutup troli"
            className="fixed inset-0 z-50 bg-black/65"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="troli-tajuk"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0c1018]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 id="troli-tajuk" className="font-display text-3xl tracking-wide text-white uppercase">
                {stage === "done" ? "Pesanan" : stage === "details" ? "Butiran" : "Troli"}
              </h2>
              <button type="button" onClick={closeCart} className="grid h-10 w-10 place-items-center border border-white/15" aria-label="Tutup troli">
                <X size={16} />
              </button>
            </div>

            {stage === "done" && receipt ? (
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <p className="text-[11px] tracking-[0.18em] text-autobot uppercase">{receipt.no}</p>
                <p className="mt-3 font-display text-4xl leading-none text-white uppercase">Pratonton direkodkan</p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Aliran bayaran sebenar belum disambung. Skrin ini untuk anda semak medan yang pembeli perlu isi.
                </p>
                <p className="mt-4 text-sm text-white">
                  {receipt.buyer.name} · {receipt.buyer.phone}
                  <br />
                  {receipt.buyer.state}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-white/75">
                  {receipt.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 border-t border-white/10 pt-2">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>{formatRM(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex justify-between font-display text-3xl text-white">
                  <span>Jumlah</span>
                  <span>{formatRM(receipt.subtotal + receipt.shipping)}</span>
                </p>
              </div>
            ) : null}

            {stage === "cart" ? (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5">
                  {cart.length === 0 ? (
                    <div className="py-10">
                      <p className="font-display text-3xl text-white uppercase">Troli kosong</p>
                      <p className="mt-2 text-sm text-white/60">Pek Permulaan ialah laluan paling rendah untuk mula.</p>
                      <a href="#tawaran" onClick={closeCart} className={`${btnPrimary} mt-6 h-12`}>
                        Lihat tawaran
                      </a>
                    </div>
                  ) : (
                    <ul>
                      {cart.map((item) => (
                        <li key={item.id} className="flex gap-3 border-b border-white/10 py-4">
                          <div
                            className="grid h-16 w-12 shrink-0 place-items-center overflow-hidden border border-white/15 bg-[#10131c]"
                            style={{ color: item.accent }}
                          >
                            {item.image ? (
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            ) : item.kind === "card" ? (
                              <Portrait id={item.id} />
                            ) : (
                              <Mark className="h-6 w-6" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-2xl leading-none text-white uppercase">{item.name}</p>
                            <p className="mt-1 text-sm text-white/55">{formatRM(item.price)}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <button type="button" className="grid h-8 w-8 place-items-center border border-white/15" aria-label={`Kurang ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm">{item.qty}</span>
                              <button type="button" className="grid h-8 w-8 place-items-center border border-white/15" aria-label={`Tambah ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeItem(item.id)} className="self-start text-white/50" aria-label={`Buang ${item.name}`}>
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {suggestion && cart.length > 0 ? (
                    <div className="my-4 flex items-center justify-between gap-3 border border-white/10 p-3">
                      <div>
                        <p className="text-[10px] tracking-[0.16em] text-white/45 uppercase">Tambahan</p>
                        <p className="font-display text-xl text-white uppercase">{suggestion.name}</p>
                        <p className="text-sm text-white/60">{formatRM(suggestion.price)}</p>
                      </div>
                      <button
                        type="button"
                        className="h-10 border border-white/15 px-3 text-[11px] tracking-[0.14em] uppercase"
                        onClick={() => addItem(suggestion)}
                      >
                        Tambah
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="border-t border-white/10 px-5 py-4">
                  <p className="text-xs text-white/60">
                    {gap === 0
                      ? "Penghantaran percuma Semenanjung dibuka."
                      : `Tambah ${formatRM(gap)} lagi untuk penghantaran percuma Semenanjung.`}
                  </p>
                  <div className="mt-2 h-1 bg-white/10">
                    <div className="h-full bg-autobot" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-white/40">Sabah, Sarawak dan Labuan: percuma atas RM350.</p>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-sm text-white/60">Subjumlah</span>
                    <span className="font-display text-4xl leading-none text-white">{formatRM(subtotal)}</span>
                  </div>
                  <button
                    type="button"
                    className={`${btnPrimary} mt-4 h-12 w-full`}
                    disabled={cart.length === 0}
                    onClick={() => setStage("details")}
                  >
                    Bayar sekarang
                  </button>
                </div>
              </div>
            ) : null}

            {stage === "details" ? (
              <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
                <Field label="Nama" id="nama">
                  <input id="nama" autoComplete="name" value={buyer.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Telefon" id="telefon">
                  <input id="telefon" autoComplete="tel" inputMode="tel" value={buyer.phone} onChange={(event) => update("phone", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Negeri" id="negeri">
                  <select id="negeri" autoComplete="address-level1" value={buyer.state} onChange={(event) => update("state", event.target.value)} className={fieldClass}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Nota (pilihan)" id="nota">
                  <textarea id="nota" value={buyer.note} onChange={(event) => update("note", event.target.value)} className={`${fieldClass} h-20 py-3`} />
                </Field>
                {error ? <p className="text-sm text-optimus">{error}</p> : null}
                <dl className="mt-4 space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <dt>Subjumlah</dt>
                    <dd>{formatRM(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Penghantaran {shipping.region}</dt>
                    <dd>{shipping.fee === 0 ? "Percuma" : formatRM(shipping.fee)}</dd>
                  </div>
                  <div className="flex justify-between font-display text-3xl text-white">
                    <dt>Jumlah</dt>
                    <dd>{formatRM(subtotal + shipping.fee)}</dd>
                  </div>
                </dl>
                <div className="mt-auto flex gap-2 pt-6">
                  <button type="button" className="h-12 flex-1 border border-white/15 text-[12px] tracking-[0.14em] uppercase" onClick={() => setStage("cart")}>
                    Kembali
                  </button>
                  <button type="submit" className={`${btnPrimary} h-12 flex-1`}>
                    Sahkan pesanan
                  </button>
                </div>
              </form>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

const fieldClass = "h-12 w-full border border-white/15 bg-white/[0.03] px-3 text-sm outline-none focus:border-autobot"

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="mb-3 block text-[11px] tracking-[0.16em] text-white/55 uppercase">
      {label}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
    </label>
  )
}

export function Toast() {
  const { toast, openCart, dismissToast } = useShop()
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          role="status"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-24 left-1/2 z-[70] flex w-[min(92vw,420px)] -translate-x-1/2 items-center justify-between gap-3 border border-white/15 bg-[#121722] px-4 py-3 text-sm shadow-2xl"
        >
          <p>{toast.message}</p>
          <button type="button" className="shrink-0 text-autobot" onClick={() => { dismissToast(); openCart() }}>
            Lihat troli
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
