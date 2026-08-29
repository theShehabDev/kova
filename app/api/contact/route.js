// Contact form submission.
import { NextResponse } from "next/server";
import { clientIpFrom, submitForm } from "@/lib/forms";

const SUBJECTS = [
  "Order support",
  "Product or COA question",
  "Wholesale",
  "Something else",
];

const MAX = { name: 120, email: 200, message: 5000 };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (String(body.company_url || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const subject = SUBJECTS.includes(body.subject) ? body.subject : "";

  const errors = {};
  if (!name) errors.name = "Required.";
  if (!email) errors.email = "Required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "That doesn't look like a valid email.";
  }
  if (!message) errors.message = "Required.";
  if (!subject) errors.subject = "Required.";

  for (const [field, limit] of Object.entries(MAX)) {
    const value = { name, email, message }[field];
    if (value && value.length > limit) {
      errors[field] = `Too long. ${limit} characters maximum.`;
    }
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await submitForm({
      type: "contact",
      name,
      email,
      subject,
      message,
      clientIp: clientIpFrom(request),
    });

    if (!result.ok) {
      const status = result.status === 429 ? 429 : 502;
      return NextResponse.json({ error: "Could not send." }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] submit threw:", err.message);
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }
}
