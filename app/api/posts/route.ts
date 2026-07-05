import { NextRequest, NextResponse } from "next/server";
import { getPosts, savePost, type Post } from "@/lib/cms";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function GET() {
  return NextResponse.json(await getPosts());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || !body.excerpt || !body.body) {
    return NextResponse.json(
      { error: "title, excerpt, and body are required" },
      { status: 400 }
    );
  }
  const paragraphs: string[] = Array.isArray(body.body)
    ? body.body
    : String(body.body).split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);

  const post: Post = {
    slug: body.slug ? slugify(body.slug) : slugify(body.title),
    title: body.title,
    excerpt: body.excerpt,
    date: body.date || new Date().toISOString().slice(0, 10),
    author: body.author || "ADS Team",
    tag: body.tag || "Tech News",
    readMinutes:
      body.readMinutes ||
      Math.max(2, Math.round(paragraphs.join(" ").split(/\s+/).length / 200)),
    body: paragraphs,
  };

  const existing = await getPosts();
  if (existing.some((p) => p.slug === post.slug) && !body.overwrite) {
    return NextResponse.json(
      { error: `A post with slug "${post.slug}" already exists.` },
      { status: 409 }
    );
  }

  await savePost(post);
  return NextResponse.json(post, { status: 201 });
}
