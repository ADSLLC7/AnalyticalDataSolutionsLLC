import { NextRequest, NextResponse } from "next/server";
import { saveMessage, type ContactMessage } from "@/lib/cms";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and a message are required." },
      { status: 400 }
    );
  }

  const msg: ContactMessage = {
    id: `msg-${Date.now().toString(36)}`,
    name,
    email,
    company: company || undefined,
    message,
    submittedAt: new Date().toISOString(),
  };
  await saveMessage(msg);
  return NextResponse.json({ ok: true }, { status: 201 });
}
