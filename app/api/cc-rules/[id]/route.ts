import { NextRequest, NextResponse } from "next/server";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { deleteCcRule } from "@/lib/cms";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const email = req.nextUrl.searchParams.get("email") || "";
  if (!getRecruiterByEmail(email)) {
    return NextResponse.json({ error: "Unknown recruiter." }, { status: 403 });
  }
  await deleteCcRule(email, params.id);
  return NextResponse.json({ ok: true });
}
