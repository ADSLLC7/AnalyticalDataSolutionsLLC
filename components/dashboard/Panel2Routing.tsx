"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Trash2, Pencil, Check, X, Tags, Wand2, UserPlus } from "lucide-react";
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
  ccRules: CcRule[];
  setCcRules: Dispatch<SetStateAction<CcRule[]>>;
}

export default function Panel2Routing({ session, emailsSent, lastSentTo, jd, detectedRole, setCcList, ccRules: rules, setCcRules: setRules }: Panel2Props) {
  const [loading, setLoading] = useState(true);
  const [consultantName, setConsultantName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [driveFileId, setDriveFileId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editCc, setEditCc] = useState("");
  const [editDriveFileId, setEditDriveFileId] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [addedFeedback, setAddedFeedback] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await fetch(`/api/cc-rules?email=${encodeURIComponent(session.email)}`);
    if (res.ok) setRules(await res.json());
    setLoading(false);
  }, [session.email, setRules]);

  useEffect(() => {
    load();
  }, [load]);

  async function addRule() {
    setError("");
    setSaveFeedback("");
    if (!keywords.trim() || !ccEmail.trim()) {
      setError("Tech stack keywords and a CC email are both required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/cc-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.email,
          consultantName: consultantName.trim(),
          keywords: keywords.trim(),
          ccEmail: ccEmail.trim(),
          driveFileId: driveFileId.trim(),
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Could not save that rule.");
        return;
      }
      // Use the rule the server just handed back, not a follow-up GET — the
      // blob store isn't guaranteed to read its own write back immediately,
      // so an immediate re-fetch here could still show the old (pre-save)
      // list and make a real save look like it "didn't show up" until a
      // manual refresh minutes later.
      const created: CcRule = await res.json();
      setRules((prev) => [created, ...prev]);
      setSaveFeedback(`Saved${consultantName.trim() ? ` — ${consultantName.trim()}` : ""}.`);
      setTimeout(() => setSaveFeedback(""), 3000);
      setConsultantName("");
      setKeywords("");
      setCcEmail("");
      setDriveFileId("");
    } catch {
      setError("Network error while saving. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(rule: CcRule) {
    setEditingId(rule.id);
    setEditName(rule.consultantName || "");
    setEditKeywords(rule.keywords);
    setEditCc(rule.ccEmail);
    setEditDriveFileId(rule.driveFileId || "");
    setError("");
  }

  async function saveEdit(rule: CcRule) {
    setError("");
    if (!editKeywords.trim() || !editCc.trim()) {
      setError("Tech stack keywords and a CC email are both required.");
      return;
    }
    try {
      const res = await fetch("/api/cc-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.email,
          id: rule.id,
          consultantName: editName.trim(),
          keywords: editKeywords.trim(),
          ccEmail: editCc.trim(),
          driveFileId: editDriveFileId.trim(),
          createdAt: rule.createdAt,
        }),
      });
      if (res.ok) {
        const updated: CcRule = await res.json();
        setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingId(null);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Could not save that rule.");
      }
    } catch {
      setError("Network error while saving. Check your connection and try again.");
    }
  }

  function addToCc(email: string) {
    setCcList((prev) => (prev.includes(email) ? prev : [...prev, email]));
    setAddedFeedback(`Added ${email} to CC.`);
    setTimeout(() => setAddedFeedback(""), 2000);
  }

  async function removeRule(id: string) {
    if (deletingIds.has(id)) return; // already deleting — ignore a fast double-click
    setDeletingIds((prev) => new Set(prev).add(id));
    setRules((prev) => prev.filter((r) => r.id !== id)); // optimistic removal
    try {
      const res = await fetch(`/api/cc-rules/${id}?email=${encodeURIComponent(session.email)}`, { method: "DELETE" });
      if (!res.ok) {
        // Delete actually failed server-side — undo the optimistic removal
        // instead of silently leaving the UI wrong.
        setError("Could not delete that rule. Please try again.");
        await load();
      }
    } catch {
      setError("Network error while deleting. Please try again.");
      await load();
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
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
          {addedFeedback && (
            <p className="text-[10px] text-emerald-600 mb-2 leading-relaxed">{addedFeedback}</p>
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
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Consultant name (optional)"
                        className="h-7 text-[11px]"
                      />
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
                      <Input
                        value={editDriveFileId}
                        onChange={(e) => setEditDriveFileId(e.target.value)}
                        placeholder="Resume file link or ID (optional)"
                        className="h-7 text-[11px]"
                      />
                      {error && <p className="text-[10px] text-destructive">{error}</p>}
                      <div className="flex gap-1">
                        <Button size="sm" className="h-6 text-[10px] px-2 gap-1" onClick={() => saveEdit(r)}>
                          <Check className="w-2.5 h-2.5" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 gap-1"
                          onClick={() => { setEditingId(null); setError(""); }}
                        >
                          <X className="w-2.5 h-2.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-foreground truncate">
                          {r.consultantName || r.ccEmail}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{r.keywords}</div>
                        <div className="text-[10px] text-muted-foreground/80 truncate">{r.ccEmail}</div>
                        {r.driveFileId && (
                          <div className="text-[9px] text-emerald-600/80 truncate mt-0.5">
                            Resume linked
                          </div>
                        )}
                      </div>
                      <button
                        className="flex items-center gap-1.5 h-9 px-3 rounded-md border-2 border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/10 shrink-0 text-[12px] font-semibold"
                        onClick={() => addToCc(r.ccEmail)}
                        aria-label={`Add ${r.ccEmail} to CC`}
                        title="Add to CC"
                      >
                        <UserPlus className="w-4 h-4" />
                        CC
                      </button>
                      <button
                        className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                        onClick={() => startEdit(r)}
                        aria-label="Edit rule"
                        title="Edit rule"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 disabled:opacity-40"
                        onClick={() => removeRule(r.id)}
                        disabled={deletingIds.has(r.id)}
                        aria-label="Delete rule"
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
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
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              placeholder="Consultant name (optional)"
              className="h-7 text-[11px]"
            />
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Tech stack, e.g. .net, c#, blazor"
              className="h-7 text-[11px]"
            />
            <Input
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              placeholder="cc@example.com"
              className="h-7 text-[11px]"
            />
            <div className="flex gap-1.5">
              <Input
                value={driveFileId}
                onChange={(e) => setDriveFileId(e.target.value)}
                placeholder="Resume: Drive link or file ID (optional)"
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
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
            {error && (
              <p className="text-[10px] text-destructive font-medium">{error}</p>
            )}
            {saveFeedback && (
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                {saveFeedback}
              </p>
            )}
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
