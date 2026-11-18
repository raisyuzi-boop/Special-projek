import { useId } from "react"

const looks = {
  "optimus-prime": { body: "#c42736", shadow: "#4c121b", trim: "#1d4e89", light: "#b7ecff", eye: "#e7f8ff", style: "prime" },
  bumblebee: { body: "#f0b429", shadow: "#6d4c0a", trim: "#161616", light: "#ffe7a3", eye: "#f3fbff", style: "scout" },
  ratchet: { body: "#d5dde8", shadow: "#5c6774", trim: "#1f8a4c", light: "#b6ffe0", eye: "#e7fff4", style: "medic" },
  ironhide: { body: "#9a2432", shadow: "#2c0c12", trim: "#141820", light: "#ffb4c0", eye: "#ffd5dc", style: "heavy" },
  jazz: { body: "#c5ccd6", shadow: "#3d4654", trim: "#2f6fed", light: "#c9dcff", eye: "#eef4ff", style: "visor" },
  "sentinel-prime": { body: "#c4552a", shadow: "#4a2010", trim: "#e6d3b0", light: "#ffd0b0", eye: "#ffe7d4", style: "sentinel" },
  arcee: { body: "#d4567a", shadow: "#5a2038", trim: "#f2f4f8", light: "#ffd0e0", eye: "#fff0f6", style: "slim" },
  grimlock: { body: "#c9a15b", shadow: "#4a3818", trim: "#8a2a22", light: "#ffe1a8", eye: "#ffecc8", style: "dino" },
  megatron: { body: "#a7b0be", shadow: "#2c3340", trim: "#6e7684", light: "#ff4d62", eye: "#ff2a3c", style: "bucket" },
  starscream: { body: "#c5ced8", shadow: "#3a4250", trim: "#c81e2b", light: "#ffd0d6", eye: "#ff3348", style: "seeker" },
  soundwave: { body: "#6d7686", shadow: "#1c2230", trim: "#10141c", light: "#00f0ff", eye: "#7af6ff", style: "screen" },
  shockwave: { body: "#6b4ea3", shadow: "#241636", trim: "#c9b6ff", light: "#d8c6ff", eye: "#f4e9ff", style: "cyclops" },
  barricade: { body: "#1c212b", shadow: "#07080c", trim: "#f2f4f8", light: "#7ecbff", eye: "#d7f3ff", style: "police" },
  blackout: { body: "#4a5362", shadow: "#151922", trim: "#9aa3b0", light: "#ffb020", eye: "#ffe0a8", style: "rotor" },
  fallen: { body: "#3a3226", shadow: "#120f0b", trim: "#d4a24a", light: "#ff5a3c", eye: "#ff3b2e", style: "ancient" },
  lockdown: { body: "#465244", shadow: "#161c14", trim: "#e07a2f", light: "#ffb070", eye: "#ffc089", style: "hook" },
}

const dome = {
  prime: "M58 122c0-40 16-66 42-70 26 4 42 30 42 70 0 20-8 36-20 46-8 6-14 8-22 8s-14-2-22-8c-12-10-20-26-20-46z",
  scout: "M64 126c0-34 14-58 36-62 22 4 36 28 36 62 0 16-8 30-16 38-7 6-13 8-20 8s-13-2-20-8c-8-8-16-22-16-38z",
  bucket: "M52 128c0-34 12-52 48-54 36 2 48 20 48 54 0 22-10 40-22 50-9 7-16 10-26 10s-17-3-26-10c-12-10-22-28-22-50z",
  dino: "M66 116c2-34 14-54 34-58 20 4 32 24 34 58l14 28-28 16-20 8-20-8-28-16 14-28z",
  sentinel: "M56 118c0-42 16-64 44-68 28 4 44 26 44 68 0 28-10 48-24 60l-20 16-20-16c-14-12-24-32-24-60z",
}

export function Portrait({ id }) {
  const look = looks[id] || looks["optimus-prime"]
  const uid = useId().replace(/:/g, "")
  const head = dome[look.style] || dome.prime
  const slim = look.style === "slim" || look.style === "scout"
  const hideFace = look.style === "screen" || look.style === "dino" || look.style === "cyclops" || look.style === "visor"

  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.body} />
          <stop offset="1" stopColor={look.shadow} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="38%" r="58%">
          <stop offset="0" stopColor={look.light} stopOpacity="0.5" />
          <stop offset="1" stopColor={look.light} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-lamp`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="100" cy="112" rx="78" ry="64" fill={`url(#${uid}-glow)`} />

      {look.style === "seeker" ? (
        <g fill={look.trim} opacity="0.9">
          <path d="M18 146 78 112l8 28-52 24z" />
          <path d="M182 146 122 112l-8 28 52 24z" />
        </g>
      ) : null}
      {look.style === "rotor" ? (
        <g fill="none" stroke={look.trim} strokeWidth="3">
          <ellipse cx="100" cy="78" rx="74" ry="16" />
          <path d="M100 62v32M28 78h144" />
        </g>
      ) : null}
      {look.style === "ancient" ? (
        <g fill={look.trim}>
          <path d="M70 70 78 38l10 32z" />
          <path d="M96 62 100 28l6 34z" />
          <path d="M120 70 130 36l8 34z" />
        </g>
      ) : null}

      <g transform={slim ? "translate(100 168) scale(0.84 1) translate(-100 -168)" : undefined}>
        <path
          d="M16 176c20-34 46-46 70-34l14 8 14-8c24-12 50 0 70 34l12 40H4l12-40z"
          fill={`url(#${uid}-metal)`}
        />
        <path d="M36 176c16-18 34-22 52-12M164 176c-16-18-34-22-52-12" fill="none" stroke={look.trim} strokeWidth="3" />
      </g>

      <path d="M70 162h60l10 50H60l10-50z" fill={look.shadow} />
      <path d="M84 174h32l6 24H78l6-24z" fill={look.trim} />
      {look.style === "medic" ? (
        <path d="M100 180v16M92 188h16" stroke={look.light} strokeWidth="3" />
      ) : (
        <rect x="93" y="182" width="14" height="12" fill={look.light} filter={`url(#${uid}-lamp)`} />
      )}

      {look.style === "bucket" || look.style === "cyclops" ? (
        <g fill={look.shadow}>
          <path d="M150 150h34v12h-34z" />
          <circle cx="184" cy="156" r="7" fill={look.light} />
        </g>
      ) : null}
      {look.style === "hook" ? (
        <path d="M42 150c-16 8-22 24-12 34 8 8 18 2 18-8" fill="none" stroke={look.trim} strokeWidth="4" />
      ) : null}
      {look.style === "police" ? (
        <g>
          <rect x="62" y="148" width="76" height="10" rx="2" fill={look.trim} />
          <circle cx="82" cy="153" r="3.5" fill="#ff3348" />
          <circle cx="118" cy="153" r="3.5" fill="#3ec6ff" />
        </g>
      ) : null}

      <path d="M84 146h32v22H84z" fill={look.shadow} />
      <path d={head} fill={`url(#${uid}-metal)`} />
      <path d="M78 86c8-10 36-12 46 2" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />

      {look.style === "prime" ? (
        <g fill={look.trim} stroke={look.body} strokeWidth="1">
          <path d="M64 96 72 42l12 54z" />
          <path d="M136 96 128 42l-12 54z" />
        </g>
      ) : null}
      {look.style === "scout" ? (
        <g>
          <path d="M78 96 84 58l8 38zM122 96l-6-38-8 38z" fill={look.shadow} />
          <path d="M70 112h60" stroke={look.trim} strokeWidth="6" />
        </g>
      ) : null}
      {look.style === "seeker" ? <path d="M100 46 112 78H88z" fill={look.trim} /> : null}
      {look.style === "heavy" ? <path d="M68 112h64v8H68z" fill={look.shadow} /> : null}

      {look.style === "screen" ? (
        <rect x="74" y="108" width="52" height="40" rx="3" fill="#071016" />
      ) : null}
      {look.style === "screen" ? (
        <g fill={look.light} filter={`url(#${uid}-lamp)`}>
          <rect x="80" y="116" width="28" height="3" />
          <rect x="80" y="124" width="40" height="3" />
          <rect x="80" y="132" width="18" height="3" />
        </g>
      ) : null}

      {look.style === "cyclops" ? (
        <circle cx="100" cy="124" r="14" fill="#120818" />
      ) : null}
      {look.style === "cyclops" ? (
        <circle cx="100" cy="124" r="7" fill={look.eye} filter={`url(#${uid}-lamp)`} />
      ) : null}

      {look.style === "dino" ? (
        <g>
          <path d="M78 132h44l10 18H68z" fill="#1a120c" />
          <path d="M82 140h8l-2 8zm12 0h8l-2 8zm12 0h8l-2 8z" fill={look.light} />
        </g>
      ) : null}

      {look.style === "visor" ? (
        <rect x="72" y="116" width="56" height="8" rx="2" fill={look.eye} filter={`url(#${uid}-lamp)`} />
      ) : null}

      {!hideFace ? (
        <g>
          <path d="M74 114c4 20 12 32 26 32s22-12 26-32c-8 6-18 8-26 8s-18-2-26-8z" fill="#0b0e14" />
          <rect x="80" y="120" width="14" height="4" rx="1" fill={look.eye} filter={`url(#${uid}-lamp)`} />
          <rect x="106" y="120" width="14" height="4" rx="1" fill={look.eye} filter={`url(#${uid}-lamp)`} />
          <path
            d={look.style === "sentinel" ? "M78 136h44l-6 22H84z" : "M82 134h36l-4 12H86z"}
            fill={look.trim}
          />
        </g>
      ) : null}
    </svg>
  )
}
