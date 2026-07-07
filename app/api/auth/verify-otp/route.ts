import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { getOtp, updateOtp } from "@/lib/cms";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const normalized = String(email || "").trim().toLowerCase();
  const submitted = String(code || "").trim();

  const profile = getRecruiterByEmail(normalized);
  if (!profile || !submitted) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = await getOtp(normalized);
  if (!record || record.expiresAt < Date.now()) {
    return NextResponse.json(
      { error: "Code expired. Request a new one." },
      { status: 401 }
    );
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    await updateOtp(normalized, null);
    return NextResponse.json(
      { error: "Too many attempts. Request a new code." },
      { status: 429 }
    );
  }

  const submittedHash = createHash("sha256").update(submitted).digest("hex");
  if (submittedHash !== record.codeHash) {
    await updateOtp(normalized, { ...record, attempts: record.attempts + 1 });
    return NextResponse.json(
      { error: "Incorrect code. Check your email and try again." },
      { status: 401 }
    );
  }

  await updateOtp(normalized, null); // single use

  return NextResponse.json({
    ok: true,
    profile: {
      email: profile.email,
      name: profile.name,
      role: profile.title,
      phone: profile.phone,
      ...(profile.whatsapp ? { whatsapp: profile.whatsapp } : {}),
      recruiterId: profile.recruiterId,
      // Central override so the JD-routing webhook is managed from Vercel env,
      // not code. Falls back to the per-recruiter default.
      webhookUrl: process.env.JD_WEBHOOK_URL || profile.webhookUrl,
    },
  });
}
