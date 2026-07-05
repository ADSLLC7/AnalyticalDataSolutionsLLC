"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import CmsShell from "@/components/dashboard/CmsShell";
import type { Job } from "@/lib/cms";

type Draft = {
  id?: string;
  title: string;
  location: string;
  type: string;
  practice: string;
  summary: string;
  responsibilities: string;
  qualifications: string;
};

const EMPTY: Draft = {
  title: "",
  location: "",
  type: "Full-time",
  practice: "",
  summary: "",
  responsibilities: "",
  qualifications: "",
};

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/jobs");
    setJobs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(job: Job) {
    setDraft({
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      practice: job.practice,
      summary: job.summary,
      responsibilities: job.responsibilities.join("\n"),
      qualifications: job.qualifications.join("\n"),
    });
    setError("");
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError("");
    const payload = {
      title: draft.title,
      location: draft.location,
      type: draft.type,
      practice: draft.practice,
      summary: draft.summary,
      responsibilities: draft.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
      qualifications: draft.qualifications.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const res = draft.id
      ? await fetch(`/api/jobs/${draft.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/jobs", {
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

  async function toggleStatus(job: Job) {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: job.status === "open" ? "closed" : "open" }),
    });
    await load();
  }

  async function remove(job: Job) {
    if (!window.confirm(`Delete "${job.title}" permanently? Applications are kept.`)) return;
    await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
    await load();
  }

  return (
    <CmsShell title="Job Postings">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          Postings marked open appear on the public careers page immediately.
        </p>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setDraft({ ...EMPTY }); setError(""); }}>
          <Plus className="w-3.5 h-3.5" /> New posting
        </Button>
      </div>

      {/* Editor */}
      {draft && (
        <div className="border border-border rounded-lg bg-card p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">
              {draft.id ? "Edit posting" : "New posting"}
            </h2>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDraft(null)} aria-label="Close editor">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="job-title" className="text-xs">Title</Label>
              <Input id="job-title" className="mt-1 h-8 text-[13px]" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="job-location" className="text-xs">Location</Label>
              <Input id="job-location" className="mt-1 h-8 text-[13px]" value={draft.location}
                placeholder="Remote (US) / Herndon, VA (Hybrid)"
                onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="job-type" className="text-xs">Employment type</Label>
              <select
                id="job-type"
                className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-[13px]"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                <option>Full-time</option>
                <option>Contract</option>
                <option>Contract-to-hire</option>
              </select>
            </div>
            <div>
              <Label htmlFor="job-practice" className="text-xs">Practice</Label>
              <Input id="job-practice" className="mt-1 h-8 text-[13px]" value={draft.practice}
                placeholder="Cloud Infrastructure"
                onChange={(e) => setDraft({ ...draft, practice: e.target.value })} />
            </div>
          </div>

          <div className="mt-3">
            <Label htmlFor="job-summary" className="text-xs">Summary</Label>
            <Textarea id="job-summary" className="mt-1 text-[13px] min-h-[60px]" value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <Label htmlFor="job-resp" className="text-xs">Responsibilities (one per line)</Label>
              <Textarea id="job-resp" className="mt-1 text-[13px] min-h-[110px]" value={draft.responsibilities}
                onChange={(e) => setDraft({ ...draft, responsibilities: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="job-qual" className="text-xs">Qualifications (one per line)</Label>
              <Textarea id="job-qual" className="mt-1 text-[13px] min-h-[110px]" value={draft.qualifications}
                onChange={(e) => setDraft({ ...draft, qualifications: e.target.value })} />
            </div>
          </div>

          {error && <p className="text-xs text-destructive mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <Button size="sm" className="h-8 text-xs" onClick={save} disabled={saving || !draft.title || !draft.location || !draft.summary}>
              {saving ? "Saving…" : draft.id ? "Save changes" : "Publish posting"}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading postings…</p>
      ) : jobs.length === 0 ? (
        <p className="text-xs text-muted-foreground">No postings yet. Create the first one.</p>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold truncate">{job.title}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      job.status === "open"
                        ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {job.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {job.practice} · {job.location} · {job.type} · posted {job.postedAt}
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toggleStatus(job)}>
                {job.status === "open" ? "Close" : "Reopen"}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(job)} aria-label={`Edit ${job.title}`}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(job)} aria-label={`Delete ${job.title}`}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </CmsShell>
  );
}
