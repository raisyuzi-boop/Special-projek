import { useEffect, useState } from "react"

/** Mixkit Sound Effects Free License. Bukan audio dari video YouTube.
 *  tick: Sci-fi click — https://assets.mixkit.co/active_storage/sfx/900/900-preview.mp3
 *  confirm: High tech bleep confirmation — https://assets.mixkit.co/active_storage/sfx/2520/2520-preview.mp3
 *  transform: Mechanical technology movements — https://assets.mixkit.co/active_storage/sfx/3117/3117-preview.mp3
 */
const base = import.meta.env.BASE_URL
const CLIPS = {
  tick: `${base}sfx/tick.mp3`,
  confirm: `${base}sfx/confirm.mp3`,
  transform: `${base}sfx/transform.mp3`,
}

const VOLUME = { tick: 0.22, confirm: 0.28, transform: 0.32 }
const KEY = "cybertron-sound"

const listeners = new Set()
const pool = {}
let enabled = true
let reduced = false
let current = null
let fadeTimer = 0
let capTimer = 0

function readStored() {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === "0") return false
    if (stored === "1") return true
  } catch {
    return true
  }
  return !reduced
}

function publish() {
  const snapshot = { enabled, reduced }
  listeners.forEach((listener) => listener(snapshot))
}

function stop() {
  window.clearInterval(fadeTimer)
  window.clearTimeout(capTimer)
  if (!current) return
  current.pause()
  try {
    current.currentTime = 0
  } catch {
    /* sesetengah pelayar menolak seek sebelum metadata siap */
  }
  current = null
}

if (typeof window !== "undefined") {
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  enabled = readStored()
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  motion.addEventListener?.("change", () => {
    reduced = motion.matches
    if (reduced) stop()
    publish()
  })
}

export function playSound(name) {
  if (!enabled || reduced) return
  const src = CLIPS[name]
  if (!src) return
  let audio = pool[name]
  if (!audio) {
    audio = new Audio(src)
    audio.preload = "auto"
    pool[name] = audio
  }
  stop()
  audio.volume = VOLUME[name] ?? 0.25
  try {
    audio.currentTime = 0
  } catch {
    /* fail masih dimuat */
  }
  current = audio
  audio.play().catch(() => {})
  if (name === "transform") {
    capTimer = window.setTimeout(() => {
      if (current !== audio) return
      fadeTimer = window.setInterval(() => {
        if (current !== audio) {
          window.clearInterval(fadeTimer)
          return
        }
        audio.volume = Math.max(0, audio.volume - 0.08)
        if (audio.volume <= 0.02) stop()
      }, 40)
    }, 850)
  }
}

export function toggleSound() {
  enabled = !enabled
  try {
    localStorage.setItem(KEY, enabled ? "1" : "0")
  } catch {
    /* storan peribadi */
  }
  if (!enabled) stop()
  publish()
  return enabled
}

export function useSoundGate() {
  const [state, setState] = useState({ enabled, reduced })
  useEffect(() => {
    listeners.add(setState)
    return () => listeners.delete(setState)
  }, [])
  return { on: state.enabled, reduced: state.reduced, toggle: toggleSound }
}
