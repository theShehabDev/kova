// Signed form submissions to WordPress.
import "server-only";

import { createHmac } from "crypto";

const BASE = process.env.WOO_STORE_URL;
const SECRET = process.env.KOVA_CART_SECRET;

export async function submitForm({ type, name, email, phone = "", subject = "", message, extra = {}, clientIp = "" }) {
  if (!BASE || !SECRET) {
    throw new Error(
      "Form delivery not configured. Check WOO_STORE_URL and KOVA_CART_SECRET."
    );
  }

  const payload = JSON.stringify({ type, name, email, phone, subject, message, extra });
  const signature = createHmac("sha256", SECRET).update(payload).digest("hex");

  const res = await fetch(`${BASE}/wp-json/kova/v1/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kova-Signature": signature,
      "X-Kova-Client-Ip": clientIp,
    },
    body: payload,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`[forms] ${type} submit failed ${res.status}:`, data?.message || "");
    return { ok: false, status: res.status, mailed: false };
  }

  return { ok: true, status: 200, mailed: Boolean(data.mailed) };
}

export function clientIpFrom(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "";
}
