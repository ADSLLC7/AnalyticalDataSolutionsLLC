import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getApplications, readResumeFile } from "@/lib/cms";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".rtf": "application/rtf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apps = await getApplications();
  const app = apps.find((a) => a.id === params.id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await readResumeFile(app.resumeFile);
  if (!data) return NextResponse.json({ error: "File missing" }, { status: 404 });

  const ext = path.extname(app.resumeOriginalName).toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${app.resumeOriginalName.replace(/"/g, "")}"`,
    },
  });
}
