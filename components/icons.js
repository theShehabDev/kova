const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Shield(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function Flask(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

export function Badge(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="10" r="6" />
      <path d="M9 10l2 2 4-4" />
      <path d="M9 15l-1.5 6 4.5-2.5L16.5 21 15 15" />
    </svg>
  );
}

export function Cap(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M2 8l10-4 10 4-10 4L2 8z" />
      <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 8v5" />
    </svg>
  );
}

export function Community(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="8" cy="9" r="2.4" />
      <circle cx="16" cy="9" r="2.4" />
      <path d="M3 19c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" />
      <path d="M13 15c.9-.6 2-.9 3-.9 2.8 0 5 1.6 5 4.2" />
    </svg>
  );
}

export function Lock(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  );
}

export function Headset(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19a4 4 0 0 1-4 3h-2" />
    </svg>
  );
}

export function Star(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.6 6.6 19.4l1-6.1L3.2 9l6.1-.9L12 2.5z" />
    </svg>
  );
}

export function Arrow(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function User(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
    </svg>
  );
}

export function Bag(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function Spark(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z" />
    </svg>
  );
}

export function Bolt(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" />
    </svg>
  );
}

export function Pulse(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M3 12h4l2 6 4-12 2 6h6" />
    </svg>
  );
}

export function Brain(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function Plane(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M10 4l8 8-3 8-3-6-6-3 7-3-3-3 0-1z" />
    </svg>
  );
}

export function Heart(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7-1.3C19 11.7 12 20 12 20z" />
    </svg>
  );
}

export function Gem(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 4h12l3 5-9 11L3 9l3-5z" />
      <path d="M3 9h18M9 4l-3 5 6 11 6-11-3-5" />
    </svg>
  );
}

export function Book(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V5z" />
      <path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V5z" />
    </svg>
  );
}

export function CheckCircle(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.4 2.4 4.6-5.4" />
    </svg>
  );
}

export function Building(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21" />
      <path d="M3 21h18" />
      <path d="M9.5 7h1M13.5 7h1M9.5 10.5h1M13.5 10.5h1M9.5 14h1M13.5 14h1" />
      <path d="M10 21v-3.5h4V21" />
    </svg>
  );
}

export function Microscope(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 18h8" />
      <path d="M4 21h16" />
      <path d="M14 21a6.5 6.5 0 1 0 0-13h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2H9z" />
      <path d="M12 6V4a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v2" />
    </svg>
  );
}

export function FileCheck(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5" />
      <path d="M9 14.5l2 2 4-4.5" />
    </svg>
  );
}

export function Bell(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function Tag(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  );
}

export function ChevronLeft(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </svg>
  );
}

export function ChevronRight(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </svg>
  );
}

export function Instagram(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function XSocial(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M5 4l14 16M19 4L5 20" />
    </svg>
  );
}

export function Mail(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </svg>
  );
}

export function Search(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

export function Globe(p) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z" />
    </svg>
  );
}

export function FlagUS(p) {
  return (
    <svg viewBox="0 0 24 16" {...p}>
      <rect width="24" height="16" rx="1.5" fill="#b22234" />
      <g fill="#f5f0e8">
        <rect y="1.8" width="24" height="1.35" />
        <rect y="4.5" width="24" height="1.35" />
        <rect y="7.2" width="24" height="1.35" />
        <rect y="9.9" width="24" height="1.35" />
        <rect y="12.6" width="24" height="1.35" />
      </g>
      <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H10.5v8.6H0V1.5z" fill="#3c3b6e" />
      <g fill="#f5f0e8">
        <circle cx="2.2" cy="2" r="0.55" />
        <circle cx="5.2" cy="2" r="0.55" />
        <circle cx="8.2" cy="2" r="0.55" />
        <circle cx="3.7" cy="4.2" r="0.55" />
        <circle cx="6.7" cy="4.2" r="0.55" />
        <circle cx="2.2" cy="6.4" r="0.55" />
        <circle cx="5.2" cy="6.4" r="0.55" />
        <circle cx="8.2" cy="6.4" r="0.55" />
      </g>
    </svg>
  );
}
