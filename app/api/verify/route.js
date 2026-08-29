// Batch lookup for the verification page.
import { NextResponse } from "next/server";
import { getBatch } from "@/lib/batches";

export async function GET(request) {
  const number = (request.nextUrl.searchParams.get("batch") || "").trim();

  if (!number) {
    return NextResponse.json(
      { found: false, error: "No batch number supplied." },
      { status: 400 }
    );
  }

  if (number.length > 64) {
    return NextResponse.json({ found: false }, { status: 400 });
  }

  const batch = await getBatch(number);

  return NextResponse.json(batch ? { found: true, batch } : { found: false });
}
