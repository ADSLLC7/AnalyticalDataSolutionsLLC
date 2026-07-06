import { NextRequest, NextResponse } from "next/server";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { getCcRules, saveCcRule, type CcRule } from "@/lib/cms";

// These endpoints trust the recruiter's own email the same way the rest of
// the dashboard does (the OTP-issued session, held client-side) — there is
// no separate admin concern here, since a recruiter can only ever read or
// write their own CC rules, keyed by their own email.

// Accepts either a bare Drive file ID or a full share URL
// (https://drive.google.com/file/d/<ID>/view, ?id=<ID>, /open?id=<ID>).
// Folder links are rejected: n8n downloads a single file by ID, so a folder
// URL silently can't work — share the resume file itself instead.
function extractDriveFileId(input: string): { fileId?: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return {};
  if (/\/folders\//.test(trimmed)) {
    return {
      error:
        "That's a Drive folder link, not a file link. Open the resume file itself in Drive, click Share, and paste that file's link instead.",
    };
  }
  const m =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  return { fileId: m ? m[1] : trimmed };
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  if (!getRecruiterByEmail(email)) {
    return NextResponse.json({ error: "Unknown recruiter." }, { status: 403 });
  }
  return NextResponse.json(await getCcRules(email));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "");
  if (!getRecruiterByEmail(email)) {
    return NextResponse.json({ error: "Unknown recruiter." }, { status: 403 });
  }
  const keywords = String(body.keywords || "").trim();
  const ccEmail = String(body.ccEmail || "").trim();
  if (!keywords || !ccEmail) {
    return NextResponse.json(
      { error: "Both tech-stack keywords and a CC email are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ccEmail)) {
    return NextResponse.json({ error: "That CC email doesn't look valid." }, { status: 400 });
  }

  const { fileId: driveFileId, error: driveError } = extractDriveFileId(String(body.driveFileId || ""));
  if (driveError) {
    return NextResponse.json({ error: driveError }, { status: 400 });
  }

  const consultantName = String(body.consultantName || "").trim();

  const rule: CcRule = {
    id: body.id || `cc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    ...(consultantName ? { consultantName } : {}),
    keywords,
    ccEmail,
    ...(driveFileId ? { driveFileId } : {}),
    createdAt: body.createdAt || new Date().toISOString(),
  };
  await saveCcRule(email, rule);
  return NextResponse.json(rule, { status: 201 });
}
