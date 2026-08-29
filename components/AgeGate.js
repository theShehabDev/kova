// Research-use-only gate, shown once per visitor.
"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useScrollLock } from "@/lib/useScrollLock";

const STORAGE_KEY = "kova-age-ok";
const EXIT_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLD9egndoWUsU5tvUPDCnCfoErx9EEFTKLOLwzqLuLBqlsDxREBM9vYXE&s=10";

const ROLES = [
  { value: "private", label: "Private Research" },
  { value: "lab", label: "Laboratory / Company" },
  { value: "academic", label: "Academic Institution" },
];

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [useChecked, setUseChecked] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    let verified = false;
    try {
      verified = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
    }
    if (!verified) setOpen(true);
  }, []);

  useScrollLock(open);

  if (!open) return null;

  const canEnter = ageChecked && useChecked && role !== "";

  const confirm = () => {
    if (!canEnter) return;
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
    }
    setOpen(false);
  };

  const deny = () => {
    window.location.href = EXIT_URL;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-cream-50 text-ink"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.14]" />

      {/* top brand bar */}
      <header className="relative flex h-[72px] shrink-0 items-center justify-center border-b border-ink/10">
        <Logo />
      </header>

      {/* centered page content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-[34px] py-16 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
          Research Access
        </p>
        <h1
          id="age-gate-title"
          className="mt-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl"
        >
          Confirm before entering
        </h1>
        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-soft">
          This site provides research-grade products for laboratory and
          research purposes only. Please confirm before entering.
        </p>

        <div className="mt-9 flex w-full max-w-sm flex-col items-start gap-4 text-left">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={ageChecked}
              onChange={(e) => setAgeChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-dark"
            />
            <span className="text-[13px] leading-snug text-ink">
              I am 21 years of age or older
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={useChecked}
              onChange={(e) => setUseChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-dark"
            />
            <span className="text-[13px] leading-snug text-ink">
              I understand these products are for research use only and are
              not for human consumption
            </span>
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="I am entering as"
            className="mt-1 w-full border border-ink/25 bg-cream-50 px-4 py-3 text-[13px] text-ink focus:border-gold-dark focus:outline-none"
          >
            <option value="" disabled>
              I am entering as…
            </option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={deny}
            className="rounded-full border border-ink/30 px-10 py-4 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream-50"
          >
            I Decline
          </button>
          <button
            onClick={confirm}
            disabled={!canEnter}
            className="rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-10 py-4 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
          >
            Enter Site
          </button>
        </div>

        <p className="mt-7 max-w-sm text-[11px] leading-relaxed text-ink-muted">
          By entering, you agree to our terms and acknowledge our
          research-use-only policy.
        </p>
      </div>

      {/* bottom strip */}
      <footer className="relative shrink-0 border-t border-ink/10 py-5 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-ink-muted">
          For Research Use Only · Not for Human Consumption
        </p>
      </footer>
    </div>
  );
}
