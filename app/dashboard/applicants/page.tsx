"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CmsShell from "@/components/dashboard/CmsShell";
import type { Application } from "@/lib/cms";

export default function ApplicantsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState("all");

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      });
  }, []);

  const jobTitles = useMemo(
    () => Array.from(new Set(apps.map((a) => a.jobTitle))),
    [apps]
  );

  const filtered = useMemo(
    () => (jobFilter === "all" ? apps : apps.filter((a) => a.jobTitle === jobFilter)),
    [apps, jobFilter]
  );

  return (
    <CmsShell title="Applicants">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          {apps.length} application{apps.length === 1 ? "" : "s"} received. Resumes download with the applicant&apos;s original filename.
        </p>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-[12px]"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          {jobTitles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading applications…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-[13px] font-medium">No applications yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Submissions from the public careers page land here the moment they arrive.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {filtered.map((a) => (
            <div key={a.id} className="px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[13px] font-semibold">{a.name}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {a.jobTitle}
                </Badge>
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {new Date(a.submittedAt).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "numeric", minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <a href={`mailto:${a.email}`} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                  <Mail className="w-3 h-3" /> {a.email}
                </a>
                {a.phone && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Phone className="w-3 h-3" /> {a.phone}
                  </span>
                )}
                <a href={`/api/applications/${a.id}/resume`} download>
                  <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1 px-2">
                    <Download className="w-3 h-3" />
                    {a.resumeOriginalName}
                  </Button>
                </a>
              </div>
              {a.note && (
                <p className="text-[12px] text-muted-foreground mt-2 border-l-0 bg-muted rounded px-2.5 py-1.5 max-w-2xl">
                  {a.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </CmsShell>
  );
}
