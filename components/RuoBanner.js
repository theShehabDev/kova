import { Flask } from "./icons";

export default function RuoBanner() {
  return (
    <section className="snap-start border-y border-ink/10 bg-sand py-5">
      <div className="container-x flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6 sm:text-left">
        <span className="flex shrink-0 items-center gap-2.5">
          <Flask className="h-5 w-5 text-gold-dark" />
          <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-ink">
            Research Use Only
          </span>
        </span>
        <span className="hidden h-5 w-px bg-ink/20 sm:block" />
        <p className="max-w-2xl text-[12px] font-semibold leading-relaxed text-ink-soft">
          All materials are supplied for laboratory research use only. Not for
          human or veterinary use. KOVA is not a pharmacy and does not provide
          medical advice, prescriptions, or consultations.
        </p>
      </div>
    </section>
  );
}
