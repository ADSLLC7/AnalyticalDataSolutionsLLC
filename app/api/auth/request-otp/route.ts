import { NextRequest, NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { saveOtp } from "@/lib/cms";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function hash(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from =
    process.env.OTP_FROM_EMAIL || "portal@analyticaldatasolution.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `ADS Recruiter Portal <${from}>`,
      to: [to],
      subject: `Your ADS portal sign-in code: ${code}`,
      text: `Your one-time sign-in code for the ADS Recruiter Portal is:\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    }),
  });
  return res.ok;
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
