"use client";

import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import {
  Zap, Trash2, History, Copy, Send, Eye,
  CheckCircle, Plus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActivityLog } from "@/lib/mock-data";
import { UserSession } from "@/lib/session";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { extractRole, extractName, extractEmail } from "@/lib/jd-extract";
import { composeHtmlMessage } from "@/lib/email-html";
import type { CcRule } from "@/lib/cms";

interface Panel1Props {
  session: UserSession;
  onLog: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
  jd: string;
  setJd: Dispatch<SetStateAction<string>>;
  detectedRole: string;
  setDetectedRole: Dispatch<SetStateAction<string>>;
  ccList: string[];
  setCcList: Dispatch<SetStateAction<string[]>>;
  ccRules: CcRule[];
}

type EmailMode = "submit" | "inquiry";

type SentRecord = { subject: string; role: string; to: string; sentAt: string };

async function loadSendHistory(email: string): Promise<SentRecord[]> {
  try {
    const res = await fetch(`/api/send-history?email=${encodeURIComponent(email)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export default function Panel1JD({
  session,
  onLog,
  jd,
  setJd,
  detectedRole,
  setDetectedRole,
  ccList,
  setCcList,
  ccRules,
}: Panel1Props) {
  const profile = getRecruiterByEmail(session.email);

  const [mode, setMode] = useState<EmailMode>("submit");
  const [extracting, setExtracting] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterRole, setRecruiterRole] = useState("");
  const [subject, setSubject] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  // Count, not a boolean: sends run in the background (the n8n round trip
  // can take 10-20+s) and are fire-and-forget, so a second JD's send must
  // not be blocked just because an earlier one hasn't resolved yet.
  const [pendingSends, setPendingSends] = useState(0);
  const [sendError, setSendError] = useState("");
  const [progress, setProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<SentRecord[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadSendHistory(session.email).then(setHistory);
  }, [session.email]);

  // First rule whose comma-separated keywords appear in the JD text or the
  // detected role wins; recruiters manage this list themselves (Panel2).
  function matchCcRule(text: string): string | null {
    const lower = text.toLowerCase();
    for (const rule of ccRules) {
      const terms = rule.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      if (terms.some((t) => lower.includes(t))) return rule.ccEmail;
    }
    return null;
  }

  const extractFields = async () => {
    if (!jd.trim()) return;
    setExtracting(true);
    setProgress(20);
    await new Promise((r) => setTimeout(r, 900));
    setProgress(60);
    await new Promise((r) => setTimeout(r, 400));

    // Extract role and recruiter name/email from the JD text.
    const role = extractRole(jd) || "Technology Professional";

    const extractedEmail = extractEmail(jd);
    if (extractedEmail && !recruiterEmail) {
      setRecruiterEmail(extractedEmail);
    }

    const extractedName = extractName(jd);
    if (extractedName && !recruiterName) {
      setRecruiterName(extractedName);
    }

    // Auto-fill CC from the recruiter's own saved tech-stack rules (Panel2).
    // Only one CC is populated automatically; recruiters can still add more.
    const matched = matchCcRule(`${role} ${jd}`);
    setCcList(matched ? [matched] : []);
    setDetectedRole(role);

    // Build and compile template
    const tpl = mode === "submit"
      ? (profile?.submitTemplate ?? "Hi {{recruiterName}},\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}")
      : (profile?.inquiryTemplate ?? "Hi {{recruiterName}},\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}");

    const compiled = composeHtmlMessage(
      tpl,
      { recruiterName: recruiterName || extractedName || "Hiring Manager", role, jd: jd.trim() },
      {
        name: session.name,
        title: session.role,
        phone: session.phone,
        whatsapp: session.whatsapp,
        email: session.email,
      }
    );

    setMessage(compiled);

    const modeLabel = mode === "submit" ? "Submission" : "Inquiry";
    setSubject(`Re: ${role} — ADS LLC ${modeLabel}`);
    setProgress(100);
    onLog({ action: "Fields extracted", detail: `Detected role: ${role}`, type: "extract" });
    setTimeout(() => setProgress(0), 800);
    setExtracting(false);
  };

  const addCc = () => {
    const e = ccInput.trim();
    if (e && !ccList.includes(e)) {
      setCcList((prev) => [...prev, e]);
      setCcInput("");
    }
  };

  const removeCc = (e: string) => {
    setCcList((prev) => prev.filter((x) => x !== e));
  };

  const copyMessage = async () => {
    if (message) {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      onLog({ action: "Message copied", detail: "Copied to clipboard", type: "copy" });
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // The n8n workflow behind the webhook downloads the resume, calls Claude,
  // and sends the outbound email before it responds — that can take well
  // over 10 seconds. Waiting for that response before letting the recruiter
  // move on made the UI feel frozen after every send. Instead: snapshot the
  // payload, clear the compose form immediately so the next JD can go in
  // right away, and let the network call resolve in the background —
  // success or failure lands in the Activity Log and History whenever it
  // actually finishes.
  const handleSend = () => {
    if (!message || !recruiterEmail) return;

    const webhookUrl = session.webhookUrl;
    if (!webhookUrl) {
      setSendError("No webhook URL configured for this recruiter.");
      return;
    }

    const consultants = ccList.map((email) => {
      const rule = ccRules.find((r) => r.ccEmail.toLowerCase() === email.toLowerCase());
      return {
        email,
        name: rule?.consultantName || null,
        fileId: rule?.driveFileId || null,
        hasResume: !!rule?.driveFileId,
      };
    });

    const snapshot = { recruiterEmail, subject, detectedRole, message, jd, mode, ccList };
    const payload = {
      email: recruiterEmail,
      name: recruiterName,
      role: detectedRole,
      subject,
      message,
      jd,
      mode,
      cc: ccList.join(","),
      recruiter_id: session.recruiterId,
      consultants,
    };

    // Reset the compose form now — the recruiter can paste the next JD
    // immediately instead of waiting on the background request below.
    setSendError("");
    setJd("");
    setDetectedRole("");
    setMessage("");
    setSubject("");
    setCcList([]);
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterRole("");
    setPendingSends((n) => n + 1);
    setProgress(30);
    setTimeout(() => setProgress(0), 900);

    (async () => {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          // Surface whatever the n8n workflow itself reported (e.g. a node
          // error like "role is not defined"), not just the HTTP status —
          // that's the difference between a recruiter seeing a real reason
          // and a useless "HTTP 500".
          const bodyText = await res.text().catch(() => "");
          const detail = bodyText.slice(0, 300).trim();
          throw new Error(detail ? `HTTP ${res.status}: ${detail}` : `HTTP ${res.status}`);
        }
        onLog({
          action: "Email sent",
          detail: `To: ${snapshot.recruiterEmail} · Subject: ${snapshot.subject}`,
          type: "send",
        });

        const record: SentRecord = {
          subject: snapshot.subject,
          role: snapshot.detectedRole,
          to: snapshot.recruiterEmail,
          sentAt: new Date().toISOString(),
        };
        setHistory((prev) => [record, ...prev].slice(0, 20));
        try {
          const res = await fetch("/api/send-history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.email, ...record }),
          });
          if (res.ok) setHistory(await res.json());
        } catch {
          /* history already updated optimistically above; safe to ignore */
        }
      } catch (err) {
        // A bare "Failed to fetch" TypeError means the browser couldn't even
        // reach webhookUrl — almost always a webhook that's down, or (if it's
        // an ngrok free-tier tunnel) a URL that rotated since it was hardcoded,
        // not something about the recruiter's own network.
        const isNetworkError = err instanceof TypeError;
        const msg = isNetworkError
          ? "Could not reach the webhook URL (it may be offline or the address changed — this isn't specific to your network)."
          : err instanceof Error
            ? err.message
            : "Unknown error";
        setSendError(`Send to ${snapshot.recruiterEmail} failed: ${msg}`);
        onLog({ action: "Send failed", detail: `${snapshot.recruiterEmail}: ${msg}`, type: "info" });
      } finally {
        setPendingSends((n) => Math.max(0, n - 1));
      }
    })();
  };

  const charCount = message.length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Panel header */}
      <div className="flex-none px-3 py-2 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Job Description &amp; Outreach
          </span>
          {detectedRole && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-2 py-0.5">
              <CheckCircle className="w-2.5 h-2.5" />
              {detectedRole}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-3 py-3 space-y-4">

        {/* Email type toggle */}
        <div>
          <div className="section-label mb-1.5">Email Type</div>
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setMode("submit")}
              className={`flex-1 text-[11px] font-semibold py-1.5 transition-colors ${
                mode === "submit"
                  ? "bg-[var(--navy)] text-white"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              Submit Consultant
            </button>
            <button
              onClick={() => setMode("inquiry")}
              className={`flex-1 text-[11px] font-semibold py-1.5 border-l border-border transition-colors ${
                mode === "inquiry"
                  ? "bg-[var(--navy)] text-white"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              Inquiry Only
            </button>
          </div>
        </div>

        {/* JD textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="section-label">Job Description</div>
            <div className="flex gap-1">
              <Button
                size="sm"
                className="h-8 text-[12px] font-semibold px-3 gap-1.5 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white disabled:opacity-50"
                onClick={extractFields}
                disabled={extracting || !jd.trim()}
              >
                {extracting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-[var(--gold)]" />
                )}
                Extract Fields
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2 gap-1 text-muted-foreground"
                onClick={() => { setJd(""); setDetectedRole(""); setCcList([]); setMessage(""); }}
              >
                <Trash2 className="w-2.5 h-2.5" />
                Clear
              </Button>
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 gap-1 text-muted-foreground"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-2.5 h-2.5" />
                  History
                </Button>
                {showHistory && (
                  <div className="absolute right-0 top-7 z-10 w-64 bg-card border border-border rounded-md shadow-lg py-1 max-h-64 overflow-y-auto panel-scroll">
                    {history.length === 0 && (
                      <div className="px-3 py-2 text-[11px] text-muted-foreground">
                        No emails sent yet this session.
                      </div>
                    )}
                    {history.map((h, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 text-[11px] hover:bg-muted text-foreground border-b border-border last:border-0"
                      >
                        <div className="truncate font-medium">{h.role || "Untitled role"}</div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {h.to} · {relativeTime(h.sentAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…"
            className="text-[12px] min-h-[100px] resize-none font-mono leading-relaxed"
          />
        </div>

        {/* CC chips */}
        {ccList.length > 0 && (
          <div>
            <div className="section-label mb-1.5">Auto-detected CC</div>
            <div className="flex flex-wrap gap-1.5">
              {ccList.map((e) => (
                <span key={e} className="chip group">
                  {e}
                  <button onClick={() => removeCc(e)} className="ml-0.5 opacity-50 hover:opacity-100">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter details */}
        <div>
          <div className="section-label mb-1.5">Recruiter Details</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Name</Label>
              <Input
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Jane Smith"
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="jane@company.com"
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Role / Company</Label>
              <Input
                value={recruiterRole}
                onChange={(e) => setRecruiterRole(e.target.value)}
                placeholder="Senior Recruiter @ Acme"
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Subject Line</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Re: Data Engineer Role"
                className="h-7 text-[12px]"
              />
            </div>
          </div>
        </div>

        {/* Custom CC input */}
        <div>
          <div className="section-label mb-1.5">Add CC Recipient</div>
          <div className="flex gap-1.5">
            <Input
              value={ccInput}
              onChange={(e) => setCcInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCc()}
              placeholder="cc@company.com"
              className="h-7 text-[12px] flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] px-2 gap-1 shrink-0"
              onClick={addCc}
            >
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>
        </div>

        {/* Message composer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="section-label">Message (HTML source — use Preview to see it rendered)</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground tabular-nums">{charCount} chars</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2 gap-1 text-muted-foreground"
                onClick={copyMessage}
                disabled={!message}
              >
                {copied ? (
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Extract fields from a JD to auto-populate the message, or type manually…"
            className="text-[12px] min-h-[160px] resize-none leading-relaxed"
          />
        </div>

        {/* Activity log */}
        <div>
          <div className="section-label mb-1.5">Activity Log</div>
          <ActivityLogPanel />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="flex-none border-t border-border bg-card px-3 py-2">
        {/* Progress bar */}
        {progress > 0 && (
          <div className="h-0.5 w-full bg-muted rounded-full mb-2 overflow-hidden">
            <div
              className="h-full bg-[var(--gold)] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {sendError && (
          <p className="text-[10px] text-red-600 mb-1.5 truncate">{sendError}</p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-2 items-center">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                detectedRole ? "bg-emerald-500" : "bg-muted-foreground/30"
              }`}
            />
            <span className="text-[10px] text-muted-foreground">
              {detectedRole ? `Role: ${detectedRole}` : "No role extracted yet"}
            </span>
            {pendingSends > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-2.5 h-2.5 border border-muted-foreground/40 border-t-transparent rounded-full animate-spin" />
                {pendingSends === 1 ? "1 send in progress…" : `${pendingSends} sends in progress…`}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] px-3 gap-1.5"
            onClick={() => setShowPreview(true)}
            disabled={!message}
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Button
            size="sm"
            className="h-7 text-[11px] px-3 gap-1.5 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
            onClick={handleSend}
            disabled={!message || !recruiterEmail}
          >
            <Send className="w-3 h-3" />
            Send
          </Button>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-[13px] font-bold">Email Preview</span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto panel-scroll p-4 space-y-3">
              <PreviewField label="To" value={recruiterEmail || "—"} />
              <PreviewField label="CC" value={ccList.join(", ") || "—"} />
              <PreviewField label="Subject" value={subject || "—"} />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Message (rendered as recipients will see it)
                </div>
                {message ? (
                  <div
                    className="bg-white border border-border rounded-md p-3 text-[13px]"
                    // The message is our own HTML template output (escaped
                    // user input via composeHtmlMessage), not raw third-party
                    // HTML, so rendering it here is safe.
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                ) : (
                  <div className="bg-muted/50 border border-border rounded-md p-3 text-[12px] text-muted-foreground">—</div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
              <Button size="sm" variant="outline" className="h-8 text-[12px]" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button
                size="sm"
                className="h-8 text-[12px] bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white gap-1.5"
                onClick={() => { setShowPreview(false); handleSend(); }}
                disabled={!message || !recruiterEmail}
              >
                <Send className="w-3 h-3" />
                Send Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {label}
      </div>
      <div className="bg-muted/50 border border-border rounded-md px-3 py-2 text-[12px] truncate">
        {value}
      </div>
    </div>
  );
}

function ActivityLogPanel() {
  const entries = [
    { time: "just now", text: "Panel initialized" },
    { time: "—", text: "Waiting for activity…" },
  ];
  return (
    <div className="bg-muted/50 border border-border rounded-md p-2 space-y-1 max-h-24 overflow-y-auto panel-scroll">
      {entries.map((e, i) => (
        <div key={i} className="flex gap-2 text-[10px]">
          <span className="text-muted-foreground w-14 shrink-0">{e.time}</span>
          <span className="text-foreground/70">{e.text}</span>
        </div>
      ))}
    </div>
  );
}
