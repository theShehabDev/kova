// Contact form.
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Arrow, CheckCircle } from "./icons";

const SUBJECTS = [
  "Order support",
  "Product or COA question",
  "Wholesale",
  "Something else",
];

const EMPTY = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company_url: "",
};

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

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | throttled

  const set = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Required.";
    if (!values.email.trim()) next.email = "Required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "That doesn't look like a valid email.";
    }
    if (!values.subject) next.subject = "Required.";
    if (!values.message.trim()) next.message = "Required.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 429) {
        setStatus("throttled");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) {
          setErrors(data.errors);
          setStatus("idle");
          document.getElementById(Object.keys(data.errors)[0])?.focus();
          return;
        }
        throw new Error(String(res.status));
      }
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
        <h3 className="display mt-6 text-[clamp(1.6rem,3vw,2.2rem)]">Message sent.</h3>
        <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-ink-soft">
          Research support has your message and will reply by email. If this is
          about an existing order, quoting the order number in your reply will
          get it answered faster.
        </p>
        <p className="mt-4 text-[12px] text-ink-muted">
          If the reply hasn&apos;t landed, check your spam folder.
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

      <Field id="name" label="Full name *" error={errors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={fieldBase}
          value={values.name}
          onChange={set("name")}
        />
      </Field>

      <Field id="email" label="Email *" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldBase}
          value={values.email}
          onChange={set("email")}
        />
      </Field>

      <Field id="subject" label="What's this about? *" span error={errors.subject}>
        <select
          id="subject"
          className={`${fieldBase} appearance-none pr-10`}
          style={selectChevron}
          value={values.subject}
          onChange={set("subject")}
        >
          <option value="">Select one</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="message"
        label="Message *"
        span
        helper="Including a batch number or order number, where relevant, saves a round trip."
        error={errors.message}
      >
        <textarea
          id="message"
          rows={7}
          className={`${fieldBase} resize-y`}
          value={values.message}
          onChange={set("message")}
        />
      </Field>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary group disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {status === "throttled" && (
          <p role="alert" className="mt-4 text-[12px] font-semibold text-red-700">
            That&apos;s several messages in a short space of time. Give it a few
            minutes and try again.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-4 text-[12px] leading-relaxed text-red-700">
            <span className="font-semibold">That didn&apos;t send.</span> Nothing
            you typed has been lost. Try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}
