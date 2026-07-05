"use client";

import { useState, useRef } from "react";
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

interface Panel1Props {
  session: UserSession;
  onLog: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
}

type EmailMode = "submit" | "inquiry";

export default function Panel1JD({ session, onLog }: Panel1Props) {
  const profile = getRecruiterByEmail(session.email);

  const [mode, setMode] = useState<EmailMode>("submit");
  const [jd, setJd] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [detectedRole, setDetectedRole] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterRole, setRecruiterRole] = useState("");
  const [subject, setSubject] = useState("");
  const [ccList, setCcList] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [progress, setProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history] = useState<string[]>([
    "Sr. Data Engineer @ TechCorp — sent 2h ago",
    "ML Scientist @ FinanceCo — sent yesterday",
  ]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const buildSignature = () => {
    const n = session.name;
    const t = session.role;
    const p = session.phone;
    const e = session.email;
    return `Best regards,\n${n}\n${t}\nAnalytical Data Solutions\n3300 West Dallas Parkway, Suite 200, Plano, Tx 75093.\nPhone: ${p}\nEmail: ${e}\nBuilding better teams through innovation and integrity`;
  };

  const extractFields = async () => {
    if (!jd.trim()) return;
    setExtracting(true);
    setProgress(20);
    await new Promise((r) => setTimeout(r, 900));
    setProgress(60);
    await new Promise((r) => setTimeout(r, 400));

    // Extract role from JD text using simple heuristics
    const lower = jd.toLowerCase();
    const rolePatterns: [RegExp, string][] = [
      [/dynamics 365|\.net full stack/i, "Microsoft Dynamics 365 & .NET Developer"],
      [/\.net|dotnet|asp\.net/i, ".NET Developer"],
      [/data engineer/i, "Data Engineer"],
      [/data analyst/i, "Data Analyst"],
      [/business analyst/i, "Business Analyst"],
      [/network engineer|cisco|ccna/i, "Network Engineer"],
      [/devops|kubernetes|terraform/i, "DevOps Engineer"],
      [/golang|go developer/i, "Golang Developer"],
      [/cyber|security analyst|infosec/i, "Security Analyst"],
      [/power bi|tableau|snowflake/i, "BI / Analytics Engineer"],
      [/java\b/i, "Java Developer"],
      [/python/i, "Python Developer"],
      [/react|frontend|front-end/i, "Frontend Developer"],
      [/node\.?js|backend/i, "Backend Developer"],
      [/scrum master|product owner/i, "Scrum Master / PM"],
      [/aws|azure|gcp|cloud/i, "Cloud Engineer"],
      [/salesforce/i, "Salesforce Developer"],
      [/workday/i, "Workday Consultant"],
    ];

    let role = "Technology Professional";
    for (const [pat, label] of rolePatterns) {
      if (pat.test(lower)) { role = label; break; }
    }

    // Extract recruiter email if not set
    const emailMatch = jd.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[a-z]{2,}\b/);
    if (emailMatch && !recruiterEmail) {
      setRecruiterEmail(emailMatch[0]);
    }

    // Auto-detect CC from recruiter profile
    const cc = profile ? profile.getCCForRole(role) : "";
    const ccEmails = cc ? cc.split(",").map(e => e.trim()).filter(Boolean) : [];
    setCcList(ccEmails);
    setDetectedRole(role);

    // Build and compile template
    const tpl = mode === "submit"
      ? (profile?.submitTemplate ?? "Hi {{recruiterName}},\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}")
      : (profile?.inquiryTemplate ?? "Hi {{recruiterName}},\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}");

    const compiled = tpl
      .replace(/\{\{recruiterName\}\}/g, recruiterName || "[Recruiter Name]")
      .replace(/\{\{role\}\}/g, role)
      .replace(/\{\{signature\}\}/g, buildSignature())
      .replace(/\{\{jd\}\}/g, jd.trim());

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

  const handleSend = async () => {
    if (!message || !recruiterEmail) return;
    setSending(true);
    setSendError("");
    setProgress(10);

    const webhookUrl = session.webhookUrl;
    if (!webhookUrl) {
      setSendError("No webhook URL configured for this recruiter.");
      setSending(false);
      setProgress(0);
      return;
    }

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
    };

    try {
      setProgress(40);
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setProgress(90);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProgress(100);
      onLog({
        action: "Email sent",
        detail: `To: ${recruiterEmail} · Subject: ${subject}`,
        type: "send",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSendError(`Send failed: ${msg}`);
      onLog({ action: "Send failed", detail: msg, type: "info" });
    } finally {
      setTimeout(() => { setProgress(0); setSending(false); }, 600);
    }
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
                variant="outline"
                className="h-6 text-[10px] px-2 gap-1"
                onClick={extractFields}
                disabled={extracting || !jd.trim()}
              >
                {extracting ? (
                  <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-2.5 h-2.5 text-[var(--gold)]" />
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
                  <div className="absolute right-0 top-7 z-10 w-56 bg-card border border-border rounded-md shadow-lg py-1">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-foreground truncate"
                        onClick={() => setShowHistory(false)}
                      >
                        {h}
                      </button>
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
            <div className="section-label">Message</div>
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
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] px-3 gap-1.5"
            onClick={() => console.log("Preview modal (stub)")}
            disabled={!message}
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Button
            size="sm"
            className="h-7 text-[11px] px-3 gap-1.5 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
            onClick={handleSend}
            disabled={sending || !message || !recruiterEmail}
          >
            {sending ? (
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {sending ? "Sending…" : "Send"}
          </Button>
        </div>
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
