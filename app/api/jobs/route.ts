import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveJob, type Job } from "@/lib/cms";

export async function GET() {
  return NextResponse.json(await getJobs());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || !body.location || !body.summary) {
    return NextResponse.json(
      { error: "title, location, and summary are required" },
      { status: 400 }
    );
  }
  const id =
    body.id ||
    `${body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const job: Job = {
    id,
    title: body.title,
    location: body.location,
    type: body.type || "Full-time",
    practice: body.practice || "General",
    summary: body.summary,
    responsibilities: body.responsibilities || [],
    qualifications: body.qualifications || [],
    status: body.status || "open",
    postedAt: body.postedAt || new Date().toISOString().slice(0, 10),
  };
  await saveJob(job);
  return NextResponse.json(job, { status: 201 });
}
