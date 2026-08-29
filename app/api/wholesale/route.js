// Wholesale application submission.
import { NextResponse } from "next/server";
import { clientIpFrom, submitForm } from "@/lib/forms";

const WEBHOOK = process.env.KOVA_WHOLESALE_WEBHOOK;

const TEXT_FIELDS = [
  "fullName",
  "business",
  "entityType",
  "email",
  "phone",
  "website",
  "registration",
  "compounds",
  "volume",
  "cadence",
  "notes",
];

const REQUIRED = [
  "fullName",
  "business",
  "entityType",
  "email",
  "registration",
  "compounds",
  "volume",
];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (String(body.company_url || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const payload = {};
  for (const key of TEXT_FIELDS) {
    payload[key] = String(body[key] ?? "").trim().slice(0, 5000);
  }
  payload.consent = body.consent === true;
  payload.submittedAt = new Date().toISOString();

  const missing = REQUIRED.filter((k) => !payload[k]);
  if (missing.length || !payload.consent) {
    return NextResponse.json({ error: "Incomplete submission." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const results = await Promise.allSettled([
    submitForm({
      type: "wholesale",
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      subject: `Wholesale — ${payload.business}`,
      message: payload.notes || `${payload.compounds} · ${payload.volume} · ${payload.cadence}`,
      extra: {
        business: payload.business,
        entity_type: payload.entityType,
        website: payload.website,
        registration: payload.registration,
        compounds: payload.compounds,
        volume: payload.volume,
        cadence: payload.cadence,
        consent: payload.consent ? "Yes" : "No",
        submitted_at: payload.submittedAt,
      },
      clientIp: clientIpFrom(request),
    }),
    WEBHOOK
      ? fetch(WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((res) => {
          if (!res.ok) throw new Error(`Zapier responded ${res.status}`);
          return { ok: true };
        })
      : Promise.resolve(null),
  ]);

  const [wp, zap] = results;
  const wpOk = wp.status === "fulfilled" && wp.value?.ok;
  const zapOk = zap.status === "fulfilled" && zap.value?.ok;

  if (wp.status === "rejected") {
    console.error("[wholesale] WordPress delivery threw:", wp.reason?.message);
  }
  if (zap.status === "rejected") {
    console.error("[wholesale] Zapier delivery failed:", zap.reason?.message);
  }

  if (!wpOk && !zapOk) {
    console.error("[wholesale] no destination accepted the submission:", payload);
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
