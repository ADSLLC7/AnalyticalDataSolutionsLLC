import { NextRequest, NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { saveOtp } from "@/lib/cms";
import { sendOtpEmail } from "@/lib/mailer";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function hash(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const normalized = String(email || "").trim().toLowerCase();

  const profile = getRecruiterByEmail(normalized);
  if (!profile) {
    return NextResponse.json(
      { error: "This email is not registered for portal access." },
      { status: 403 }
    );
  }

  const code = randomInt(100000, 1000000).toString();
  await saveOtp(normalized, {
    codeHash: hash(code),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  const sent = await sendOtpEmail(normalized, code);

  if (!sent) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without an email provider: surface the code so the
      // flow remains testable. Never happens in production builds.
      console.log(`[dev] OTP for ${normalized}: ${code}`);
      return NextResponse.json({ ok: true, devCode: code });
    }
    return NextResponse.json(
      { error: "Email service is not configured. Contact the administrator." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
