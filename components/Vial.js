"use client";

import { useId } from "react";

export default function Vial({ scale = 1, compound = "IPAMORELIN", dose = "5MG" }) {
  const uid = useId().replace(/:/g, "");
  const id = (n) => `${n}-${uid}`;
  const W = 150 * scale;

  return (
    <svg
      width={W}
      height={W * 2.9}
      viewBox="0 0 200 580"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`KOVA Compounds ${compound} ${dose} vial`}
      role="img"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="9%" stopColor="#efe9dc" />
          <stop offset="34%" stopColor="#ddd4c1" />
          <stop offset="60%" stopColor="#cabfa6" />
          <stop offset="78%" stopColor="#b3a888" />
          <stop offset="93%" stopColor="#8f8364" />
          <stop offset="100%" stopColor="#bcb094" />
        </linearGradient>

        {/* Liquid / reconstituted contents at the base */}
        <linearGradient id={id("liquid")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0e7d3" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d8c9a6" />
          <stop offset="100%" stopColor="#a8966f" />
        </linearGradient>

        {/* Brushed aluminium cap */}
        <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#787773" />
          <stop offset="10%" stopColor="#bcbbb6" />
          <stop offset="22%" stopColor="#f3f2ee" />
          <stop offset="34%" stopColor="#ffffff" />
          <stop offset="47%" stopColor="#c7c6c1" />
          <stop offset="60%" stopColor="#ededea" />
          <stop offset="75%" stopColor="#a3a29d" />
          <stop offset="89%" stopColor="#d9d8d3" />
          <stop offset="100%" stopColor="#827f79" />
        </linearGradient>

        {/* Label paper */}
        <linearGradient id={id("label")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f1e7" />
          <stop offset="100%" stopColor="#e9e0cf" />
        </linearGradient>

        <linearGradient id={id("labelShade")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="14%" stopColor="#000000" stopOpacity="0" />
          <stop offset="62%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="86%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>

        <radialGradient id={id("ground")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <filter id={id("soft")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={id("drop")} x="-40%" y="-20%" width="180%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#3a2e1c" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="560" rx="78" ry="15" fill={`url(#${id("ground")})`} />

      <g filter={`url(#${id("drop")})`}>
        {/* ---- GLASS BODY + NECK ---- */}
        <path
          d="M72,128 L72,137
             Q44,150 42,180
             L42,512
             C42,540 62,550 100,550
             C138,550 158,540 158,512
             L158,180
             Q156,150 128,137
             L128,128 Z"
          fill={`url(#${id("glass")})`}
          stroke="#7d7256"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* reconstituted liquid at base */}
        <path
          d="M43,470 L157,470 L157,512 C157,539 138,549 100,549 C62,549 43,539 43,512 Z"
          fill={`url(#${id("liquid")})`}
          opacity="0.85"
        />
        <ellipse cx="100" cy="470" rx="57" ry="7" fill="#f3ead6" opacity="0.7" />

        {/* glass base thickness */}
        <path
          d="M48,520 C52,540 70,547 100,547 C130,547 148,540 152,520"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="2"
        />

        {/* bright left highlight (specular) */}
        <rect x="54" y="190" width="9" height="330" rx="5" fill="#ffffff" opacity="0.6" filter={`url(#${id("soft")})`} />
        <rect x="68" y="195" width="3" height="300" rx="2" fill="#ffffff" opacity="0.45" />
        {/* faint right reflection */}
        <rect x="142" y="210" width="5" height="280" rx="3" fill="#ffffff" opacity="0.18" filter={`url(#${id("soft")})`} />

        {/* shoulder highlight */}
        <path d="M70,140 Q100,128 130,140" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" filter={`url(#${id("soft")})`} />

        {/* ---- LABEL ---- */}
        <g>
          <rect x="45" y="250" width="110" height="212" rx="3" fill={`url(#${id("label")})`} />
          {/* top & bottom edge shadows */}
          <rect x="45" y="250" width="110" height="3" fill="#000000" opacity="0.06" />
          <rect x="45" y="459" width="110" height="3" fill="#000000" opacity="0.08" />

          {/* K monogram */}
          <text x="100" y="296" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="800" fontSize="44" fill="#26241f">K</text>
          {/* wordmark */}
          <text x="100" y="324" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="700" fontSize="19" letterSpacing="5" fill="#26241f">KOVA</text>
          <text x="100" y="337" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="600" fontSize="6.5" letterSpacing="4" fill="#7a7468">COMPOUNDS</text>

          <line x1="62" y1="352" x2="138" y2="352" stroke="#26241f" strokeOpacity="0.18" strokeWidth="1" />

          {/* compound */}
          <text x="100" y="376" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="600" fontSize="12.5" letterSpacing="1.5" fill="#8b6914">{compound}</text>

          {/* dose badge */}
          <rect x={100 - dose.length * 6 - 8} y="388" width={dose.length * 12 + 16} height="22" rx="1.5" fill="none" stroke="#26241f" strokeOpacity="0.4" strokeWidth="1" />
          <text x="100" y="403" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="700" fontSize="12" letterSpacing="1.5" fill="#26241f">{dose}</text>

          <text x="100" y="438" textAnchor="middle" fontFamily="var(--font-archivo), Arial" fontWeight="500" fontSize="6.5" letterSpacing="2.5" fill="#a39a89">RESEARCH USE ONLY</text>

          {/* cylindrical shading over the whole label */}
          <rect x="45" y="250" width="110" height="212" rx="3" fill={`url(#${id("labelShade")})`} />
        </g>

        {/* ---- ALUMINIUM CAP ---- */}
        {/* skirt */}
        <rect x="58" y="86" width="84" height="46" rx="4" fill={`url(#${id("metal")})`} />
        {/* crimp seam */}
        <rect x="58" y="118" width="84" height="2" fill="#000000" opacity="0.18" />
        {/* crimp ribs */}
        <g opacity="0.5">
          {Array.from({ length: 17 }).map((_, i) => (
            <rect key={i} x={61 + i * 4.6} y="120" width="1.4" height="12" fill="#5f5e5a" />
          ))}
        </g>
        {/* domed top button */}
        <rect x="70" y="72" width="60" height="22" rx="8" fill={`url(#${id("metal")})`} />
        <ellipse cx="100" cy="76" rx="28" ry="6" fill="#ffffff" opacity="0.55" />
        {/* cap specular highlight */}
        <rect x="74" y="74" width="7" height="54" rx="3" fill="#ffffff" opacity="0.7" filter={`url(#${id("soft")})`} />
        <rect x="120" y="80" width="4" height="46" rx="2" fill="#ffffff" opacity="0.35" />
      </g>
    </svg>
  );
}
