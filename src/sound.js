import { useEffect, useState } from "react"

/** Fail baharu dalam public/sfx/New, dimainkan pada kelajuan asal.
 *  tick: satu pukulan awal transformers-sound (1.75s, puncak 0.14s).
 *  confirm: hentakan whoosh science-fiction-effect-10 (10.5s, puncak 0.28s).
 *  transform: rentak mekanikal transformers-sound, pudar selepas 0.85s.
 *  Growling 21s tidak dipakai: tenaganya hanya memuncak pada saat ke-15.
 */
const base = import.meta.env.BASE_URL
const mechanical = `${base}sfx/New/freesound_community-transformers-sound-43700.mp3`
const whoosh = `${base}sfx/New/freesound_community-science-fiction-effect-10-100364.mp3`
const CLIPS = {
  tick: mechanical,
  confirm: whoosh,
  transform: mechanical,
}
const CUE = {
  tick: { start: 0, hold: 140, step: 0.4, volume: 0.85 },
  confirm: { start: 0.1, hold: 280, step: 0.1, volume: 0.38 },
  transform: { start: 0, hold: 850, step: 0.08, volume: 0.8 },
}
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
  const cue = CUE[name]
  stop()
  audio.volume = cue.volume
  current = audio
  const start = () => {
    if (current !== audio) return
    try {
      audio.currentTime = cue.start
    } catch {
      /* metadata belum siap */
    }
    audio.play().catch(() => {})
  }
  if (audio.readyState >= 1) start()
  else audio.addEventListener("loadedmetadata", start, { once: true })
  capTimer = window.setTimeout(() => {
    if (current !== audio) return
    fadeTimer = window.setInterval(() => {
      if (current !== audio) {
        window.clearInterval(fadeTimer)
        return
      }
      audio.volume = Math.max(0, audio.volume - cue.step)
      if (audio.volume <= 0.02) stop()
    }, 30)
  }, cue.hold)
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
