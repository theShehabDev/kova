// Wholesale application form.
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Arrow, CheckCircle } from "./icons";

const ENTITY_TYPES = [
  "Research laboratory",
  "University or institution",
  "Distributor",
  "Other",
];

const VOLUMES = ["100–249 units", "250–499", "500–999", "1,000+"];

const CADENCES = ["Weekly", "Monthly", "Quarterly", "As needed"];

const EMPTY = {
  fullName: "",
  business: "",
  entityType: "",
  email: "",
  phone: "",
  website: "",
  registration: "",
  compounds: "",
  volume: "",
  cadence: "",
  notes: "",
  consent: false,
  company_url: "",
};

const REQUIRED = [
  "fullName",
  "business",
  "entityType",
  "email",
  "registration",
  "compounds",
  "volume",
];

const fieldBase =
  "w-full border border-ink/20 bg-cream-50 px-4 py-3.5 text-[13px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none";

const selectChevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a1814' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  backgroundSize: "14px",
};

function Field({ id, label, helper, error, children, span }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-label text-ink"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {helper && !error && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">{helper}</p>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function WholesaleForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const set = (key) => (e) => {
    const v = key === "consent" ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    for (const key of REQUIRED) {
      if (!String(values[key]).trim()) next[key] = "Required.";
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "That doesn't look like a valid email.";
    }
    if (!values.consent) {
      next.consent = "We can't process an application without this confirmation.";
    }
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = document.getElementById(Object.keys(found)[0]);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl border border-ink/10 bg-cream-100 p-10 text-center md:p-14"
        role="status"
      >
        <CheckCircle className="mx-auto h-10 w-10 text-gold-dark" />
        <h3 className="display mt-6 text-[clamp(1.6rem,3vw,2.2rem)]">Received.</h3>
        <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-ink-soft">
          Every application is reviewed before pricing is issued. Expect a reply
          within one to two business days from a KOVA account contact.
        </p>
        <p className="mt-4 text-[12px] text-ink-muted">
          If it hasn&apos;t landed, check your spam folder.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company_url">Company URL</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company_url}
          onChange={set("company_url")}
        />
      </div>

      <Field id="fullName" label="Full name *" error={errors.fullName}>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          className={fieldBase}
          value={values.fullName}
          onChange={set("fullName")}
        />
      </Field>

      <Field id="business" label="Business or institution *" error={errors.business}>
        <input
          id="business"
          type="text"
          autoComplete="organization"
          className={fieldBase}
          value={values.business}
          onChange={set("business")}
        />
      </Field>

      <Field id="entityType" label="Entity type *" error={errors.entityType}>
        <select
          id="entityType"
          className={`${fieldBase} cursor-pointer appearance-none pr-10`}
          style={selectChevron}
          value={values.entityType}
          onChange={set("entityType")}
        >
          <option value="">Select one</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field id="email" label="Business email *" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldBase}
          value={values.email}
          onChange={set("email")}
        />
      </Field>

      <Field id="phone" label="Phone" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className={fieldBase}
          value={values.phone}
          onChange={set("phone")}
        />
      </Field>

      <Field id="website" label="Website" error={errors.website}>
        <input
          id="website"
          type="url"
          autoComplete="url"
          className={fieldBase}
          value={values.website}
          onChange={set("website")}
        />
      </Field>

      <Field
        id="registration"
        label="Business registration or license number *"
        helper="Format varies by entity. Enter it as issued."
        error={errors.registration}
        span
      >
        <input
          id="registration"
          type="text"
          className={fieldBase}
          value={values.registration}
          onChange={set("registration")}
        />
      </Field>

      <Field
        id="compounds"
        label="Compounds of interest *"
        helper="Include anything you don't see on our catalog. The storefront is a fraction of what we supply."
        error={errors.compounds}
        span
      >
        <textarea
          id="compounds"
          rows={4}
          className={`${fieldBase} resize-y`}
          value={values.compounds}
          onChange={set("compounds")}
        />
      </Field>

      <Field id="volume" label="Estimated monthly volume *" error={errors.volume}>
        <select
          id="volume"
          className={`${fieldBase} cursor-pointer appearance-none pr-10`}
          style={selectChevron}
          value={values.volume}
          onChange={set("volume")}
        >
          <option value="">Select one</option>
          {VOLUMES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field id="cadence" label="Reorder cadence" error={errors.cadence}>
        <select
          id="cadence"
          className={`${fieldBase} cursor-pointer appearance-none pr-10`}
          style={selectChevron}
          value={values.cadence}
          onChange={set("cadence")}
        >
          <option value="">Select one</option>
          {CADENCES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field id="notes" label="Anything else we should know" error={errors.notes} span>
        <textarea
          id="notes"
          rows={3}
          className={`${fieldBase} resize-y`}
          value={values.notes}
          onChange={set("notes")}
        />
      </Field>

      <div className="sm:col-span-2">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={values.consent}
            onChange={set("consent")}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#8b6914]"
          />
          <span className="text-[12px] leading-relaxed text-ink-soft">
            I confirm I am a qualified researcher or an authorized representative
            of a licensed laboratory or institution, and that all materials
            purchased will be used for laboratory research only, not for human
            or veterinary use.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-2 text-[11px] font-semibold text-red-700">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="border border-red-700/30 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-800 sm:col-span-2"
        >
          That didn&apos;t send. Try again in a moment. If it keeps failing,
          reach us through the contact link in the footer.
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn-primary group disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Request Pricing"}
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <p className="mt-5 text-[11px] leading-relaxed text-ink-muted">
          Wholesale orders are prepaid. Pricing is issued after account
          verification.
        </p>
      </div>
    </form>
  );
}
