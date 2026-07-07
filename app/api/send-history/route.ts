import { NextRequest, NextResponse } from "next/server";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { getSendHistory, addSendHistory, type SendRecord } from "@/lib/cms";

// Same trust model as /api/cc-rules: a recruiter's OTP session email is
// passed through, and they can only ever read or write their own history.

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  if (!getRecruiterByEmail(email)) {
    return NextResponse.json({ error: "Unknown recruiter." }, { status: 403 });
  }
  return NextResponse.json(await getSendHistory(email));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "");
  if (!getRecruiterByEmail(email)) {
    return NextResponse.json({ error: "Unknown recruiter." }, { status: 403 });
  }
  const record: SendRecord = {
    subject: String(body.subject || ""),
    role: String(body.role || ""),
    to: String(body.to || ""),
    sentAt: body.sentAt || new Date().toISOString(),
  };
  const updated = await addSendHistory(email, record);
  return NextResponse.json(updated, { status: 201 });
}
