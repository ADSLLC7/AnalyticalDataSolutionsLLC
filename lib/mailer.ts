// Sends the OTP email via whichever provider is configured. Checked in order:
//   1. SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS) — e.g. an Office 365 mailbox.
//   2. Resend (RESEND_API_KEY) — kept as a fallback/alternative.
// Returns false (never throws) so the caller can decide how to degrade.

async function sendViaSmtp(to: string, subject: string, text: string): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.default.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS on 587; set SMTP_PORT=465 + this true for SSL
    auth: { user, pass },
  });

  try {
    await transport.sendMail({
      from: `ADS Recruiter Portal <${process.env.OTP_FROM_EMAIL || user}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (err) {
    console.error("SMTP send failed:", err);
    return false;
  }
}

async function sendViaResend(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.OTP_FROM_EMAIL || "portal@analyticaldatasolution.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: `ADS Recruiter Portal <${from}>`, to: [to], subject, text }),
  });
  return res.ok;
}

export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const subject = `Your ADS portal sign-in code: ${code}`;
  const text = `Your one-time sign-in code for the ADS Recruiter Portal is:\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.`;

  if (await sendViaSmtp(to, subject, text)) return true;
  if (await sendViaResend(to, subject, text)) return true;
  return false;
}
