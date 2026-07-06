"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Trash2, Pencil, Check, X, Tags, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSession } from "@/lib/session";
import type { CcRule } from "@/lib/cms";

interface Panel2Props {
  session: UserSession;
  emailsSent: number;
  lastSentTo: string;
  jd: string;
  detectedRole: string;
  setCcList: Dispatch<SetStateAction<string[]>>;
}

export default function Panel2Routing({ session, emailsSent, lastSentTo, jd, detectedRole, setCcList }: Panel2Props) {
  const [rules, setRules] = useState<CcRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKeywords, setEditKeywords] = useState("");
  const [editCc, setEditCc] = useState("");
  const [matchResult, setMatchResult] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/cc-rules?email=${encodeURIComponent(session.email)}`);
    if (res.ok) setRules(await res.json());
    setLoading(false);
  }, [session.email]);

  useEffect(() => {
    load();
  }, [load]);

  async function addRule() {
    if (!keywords.trim() || !ccEmail.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/cc-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.email, keywords: keywords.trim(), ccEmail: ccEmail.trim() }),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Could not save that rule.");
      return;
    }
    setKeywords("");
    setCcEmail("");
    await load();
  }

  function startEdit(rule: CcRule) {
    setEditingId(rule.id);
    setEditKeywords(rule.keywords);
    setEditCc(rule.ccEmail);
  }

  async function saveEdit(rule: CcRule) {
    if (!editKeywords.trim() || !editCc.trim()) return;
    const res = await fetch("/api/cc-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.email,
        id: rule.id,
        keywords: editKeywords.trim(),
        ccEmail: editCc.trim(),
        createdAt: rule.createdAt,
      }),
    });
    if (res.ok) {
      setEditingId(null);
      await load();
    }
  }

  async function removeRule(id: string) {
    await fetch(`/api/cc-rules/${id}?email=${encodeURIComponent(session.email)}`, { method: "DELETE" });
    await load();
  }

  function populateCc() {
    const text = `${detectedRole} ${jd}`.toLowerCase();
    if (!text.trim()) {
      setMatchResult("Paste a job description in the left panel first.");
      return;
    }
    for (const rule of rules) {
      const terms = rule.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      if (terms.some((t) => text.includes(t))) {
        setCcList([rule.ccEmail]);
        setMatchResult(`Matched "${rule.keywords}" → ${rule.ccEmail}`);
        return;
      }
    }
    setMatchResult("No saved rule matched this JD. Add one below.");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Panel header */}
      <div className="flex-none px-3 py-2 border-b border-border bg-card">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          CC Routing
        </span>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-3 py-3 space-y-4">

        {/* Your CC rules */}
        <div>
          <div className="section-label mb-1.5 flex items-center gap-1.5">
            <Tags className="w-3 h-3" />
            Your Tech Stack → CC Rules
          </div>
          <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
            Save an email per tech stack. When you extract a JD, the first
            matching rule auto-fills the CC field.
          </p>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] w-full gap-1.5 mb-1.5"
            onClick={populateCc}
          >
            <Wand2 className="w-3 h-3" />
            Populate CC from JD
          </Button>
          {matchResult && (
            <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">{matchResult}</p>
          )}

          {loading ? (
            <p className="text-[10px] text-muted-foreground">Loading…</p>
          ) : rules.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">
              No rules yet — add one below.
            </p>
          ) : (
            <div className="space-y-1.5">
              {rules.map((r) => (
                <div key={r.id} className="border border-border rounded-md p-2 bg-card">
                  {editingId === r.id ? (
                    <div className="space-y-1.5">
                      <Input
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        placeholder="e.g. .net, c#, blazor"
                        className="h-7 text-[11px]"
                      />
                      <Input
                        value={editCc}
                        onChange={(e) => setEditCc(e.target.value)}
                        placeholder="cc@example.com"
                        className="h-7 text-[11px]"
                      />
                      <div className="flex gap-1">
                        <Button size="sm" className="h-6 text-[10px] px-2 gap-1" onClick={() => saveEdit(r)}>
                          <Check className="w-2.5 h-2.5" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 gap-1"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="w-2.5 h-2.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-foreground truncate">
                          {r.keywords}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{r.ccEmail}</div>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-foreground shrink-0"
                        onClick={() => startEdit(r)}
                        aria-label="Edit rule"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeRule(r.id)}
                        aria-label="Delete rule"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new rule */}
          <div className="mt-2 space-y-1.5 border-t border-border pt-2">
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Tech stack, e.g. .net, c#, blazor"
              className="h-7 text-[11px]"
            />
            <div className="flex gap-1.5">
              <Input
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="cc@example.com"
                className="h-7 text-[11px] flex-1"
                onKeyDown={(e) => e.key === "Enter" && addRule()}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] px-2 gap-1 shrink-0"
                onClick={addRule}
                disabled={saving}
              >
                <Plus className="w-3 h-3" />
                Save
              </Button>
            </div>
            {error && <p className="text-[10px] text-destructive">{error}</p>}
          </div>
        </div>

        {/* Session stats */}
        <div>
          <div className="section-label mb-1.5">Session Stats</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border rounded-md p-2.5">
              <div className="text-[20px] font-bold text-[var(--navy)] dark:text-primary tabular-nums">
                {emailsSent}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Emails sent</div>
            </div>
            <div className="bg-card border border-border rounded-md p-2.5">
              <div className="text-[11px] font-semibold text-foreground truncate">
                {lastSentTo || "—"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Last sent to</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
