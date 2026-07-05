"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import CmsShell from "@/components/dashboard/CmsShell";
import type { Post } from "@/lib/cms";

type Draft = {
  slug?: string;
  title: string;
  tag: string;
  author: string;
  excerpt: string;
  body: string;
};

const EMPTY: Draft = {
  title: "",
  tag: "Tech News",
  author: "ADS Team",
  excerpt: "",
  body: "",
};

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/posts");
    setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(post: Post) {
    setDraft({
      slug: post.slug,
      title: post.title,
      tag: post.tag,
      author: post.author,
      excerpt: post.excerpt,
      body: post.body.join("\n\n"),
    });
    setError("");
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError("");
    const payload = {
      title: draft.title,
      tag: draft.tag,
      author: draft.author,
      excerpt: draft.excerpt,
      body: draft.body,
    };
    const res = draft.slug
      ? await fetch(`/api/posts/${draft.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Save failed.");
      return;
    }
    setDraft(null);
    await load();
  }

  async function remove(post: Post) {
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;
    await fetch(`/api/posts/${post.slug}`, { method: "DELETE" });
    await load();
  }

  return (
    <CmsShell title="Blog Posts">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          Posts publish to the public blog immediately. Newest date appears first and featured.
        </p>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setDraft({ ...EMPTY }); setError(""); }}>
          <Plus className="w-3.5 h-3.5" /> New post
        </Button>
      </div>

      {/* Editor */}
      {draft && (
        <div className="border border-border rounded-lg bg-card p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">{draft.slug ? "Edit post" : "New post"}</h2>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDraft(null)} aria-label="Close editor">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Label htmlFor="post-title" className="text-xs">Title</Label>
              <Input id="post-title" className="mt-1 h-8 text-[13px]" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="post-tag" className="text-xs">Tag</Label>
              <Input id="post-tag" className="mt-1 h-8 text-[13px]" value={draft.tag}
                placeholder="AI in Practice"
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div>
              <Label htmlFor="post-author" className="text-xs">Author</Label>
              <Input id="post-author" className="mt-1 h-8 text-[13px]" value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="post-excerpt" className="text-xs">Excerpt (1-2 sentence teaser)</Label>
              <Input id="post-excerpt" className="mt-1 h-8 text-[13px]" value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
            </div>
          </div>

          <div className="mt-3">
            <Label htmlFor="post-body" className="text-xs">
              Body (separate paragraphs with a blank line)
            </Label>
            <Textarea id="post-body" className="mt-1 text-[13px] min-h-[220px]" value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </div>

          {error && <p className="text-xs text-destructive mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <Button size="sm" className="h-8 text-xs" onClick={save}
              disabled={saving || !draft.title || !draft.excerpt || !draft.body}>
              {saving ? "Saving…" : draft.slug ? "Save changes" : "Publish post"}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-xs text-muted-foreground">No posts yet. Publish the first one.</p>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {posts.map((post) => (
            <div key={post.slug} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold truncate">{post.title}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{post.tag}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {post.author} · {post.date} · {post.readMinutes} min read
                </p>
              </div>
              <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`View ${post.title} on the site`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(post)} aria-label={`Edit ${post.title}`}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(post)} aria-label={`Delete ${post.title}`}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </CmsShell>
  );
}
