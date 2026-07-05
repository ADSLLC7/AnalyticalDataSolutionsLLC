import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, savePost, deletePost } from "@/lib/cms";

type Params = { params: { slug: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const post = await getPostBySlug(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const post = await getPostBySlug(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const patch = await req.json();
  if (typeof patch.body === "string") {
    patch.body = patch.body.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  }
  const updated = { ...post, ...patch, slug: post.slug };
  await savePost(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await deletePost(params.slug);
  return NextResponse.json({ ok: true });
}
