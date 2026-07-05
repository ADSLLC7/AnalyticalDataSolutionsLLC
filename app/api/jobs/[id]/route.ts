import { NextRequest, NextResponse } from "next/server";
import { getJob, saveJob, deleteJob } from "@/lib/cms";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const job = await getJob(params.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const job = await getJob(params.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const patch = await req.json();
  const updated = { ...job, ...patch, id: job.id };
  await saveJob(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await deleteJob(params.id);
  return NextResponse.json({ ok: true });
}
