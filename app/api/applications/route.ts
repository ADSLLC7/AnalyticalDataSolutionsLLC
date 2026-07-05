import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  getApplications,
  saveApplication,
  saveResumeFile,
  getJob,
  type Application,
} from "@/lib/cms";

const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_EXT = new Set([".pdf", ".doc", ".docx", ".txt", ".rtf"]);

export async function GET() {
  return NextResponse.json(await getApplications());
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const jobId = String(form.get("jobId") || "");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const note = String(form.get("note") || "").trim();
  const resume = form.get("resume");

  if (!name || !email || !jobId || !(resume instanceof File)) {
    return NextResponse.json(
      { error: "Name, email, and a resume file are required." },
      { status: 400 }
    );
  }

  const job = await getJob(jobId);
  if (!job || job.status !== "open") {
    return NextResponse.json(
      { error: "This role is no longer accepting applications." },
      { status: 404 }
    );
  }

  if (resume.size === 0 || resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json(
      { error: "Resume must be a non-empty file under 8 MB." },
      { status: 400 }
    );
  }

  const ext = path.extname(resume.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Accepted formats: PDF, DOC, DOCX, TXT, RTF." },
      { status: 400 }
    );
  }

  const id = `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const safeName = `${id}${ext}`;
  const buffer = Buffer.from(await resume.arrayBuffer());
  const resumeRef = await saveResumeFile(
    safeName,
    buffer,
    resume.type || "application/octet-stream"
  );

  const application: Application = {
    id,
    jobId,
    jobTitle: job.title,
    name,
    email,
    phone: phone || undefined,
    note: note || undefined,
    resumeFile: resumeRef,
    resumeOriginalName: resume.name,
    submittedAt: new Date().toISOString(),
  };
  await saveApplication(application);

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
