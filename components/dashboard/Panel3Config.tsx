"use client";

import { useState } from "react";
import { Save, User, FileText, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserSession } from "@/lib/session";
import { getRecruiterByEmail } from "@/lib/recruiters";

interface Panel3Props {
  session: UserSession;
  onUpdateSession: (s: Partial<UserSession>) => void;
}

function tplKey(recruiterId: string, type: "submit" | "inquiry") {
  return `ads_tpl_${type}_${recruiterId}`;
}

function loadTemplate(recruiterId: string, type: "submit" | "inquiry", fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(tplKey(recruiterId, type)) ?? fallback;
}

function saveTemplate(recruiterId: string, type: "submit" | "inquiry", value: string) {
  localStorage.setItem(tplKey(recruiterId, type), value);
}

export default function Panel3Config({ session, onUpdateSession }: Panel3Props) {
  const profile = getRecruiterByEmail(session.email);
  const rid = session.recruiterId;

  const defaultSubmit = profile?.submitTemplate ?? "";
  const defaultInquiry = profile?.inquiryTemplate ?? "";

  const [name, setName] = useState(session.name);
  const [phone, setPhone] = useState(session.phone);
  const [email, setEmail] = useState(session.email);
  const [role, setRole] = useState(session.role);

  const [submitTemplate, setSubmitTemplate] = useState(() =>
    loadTemplate(rid, "submit", defaultSubmit)
  );
  const [inquiryTemplate, setInquiryTemplate] = useState(() =>
    loadTemplate(rid, "inquiry", defaultInquiry)
  );

  const [submitOpen, setSubmitOpen] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [identitySaved, setIdentitySaved] = useState(false);
  const [submitSaved, setSubmitSaved] = useState(false);
  const [inquirySaved, setInquirySaved] = useState(false);

  const handleSaveIdentity = () => {
    onUpdateSession({ name, phone, email, role });
    setIdentitySaved(true);
    setTimeout(() => setIdentitySaved(false), 1800);
  };

  const handleSaveSubmit = () => {
    saveTemplate(rid, "submit", submitTemplate);
    setSubmitSaved(true);
    setTimeout(() => setSubmitSaved(false), 1800);
  };

  const handleSaveInquiry = () => {
    saveTemplate(rid, "inquiry", inquiryTemplate);
    setInquirySaved(true);
    setTimeout(() => setInquirySaved(false), 1800);
  };

  const handleResetSubmit = () => {
    setSubmitTemplate(defaultSubmit);
    saveTemplate(rid, "submit", defaultSubmit);
  };

  const handleResetInquiry = () => {
    setInquiryTemplate(defaultInquiry);
    saveTemplate(rid, "inquiry", defaultInquiry);
  };

  const signatureLines = [
    "Best regards,",
    name,
    role,
    `📞 ${phone}`,
    ...(session.whatsapp ? [`💬 WhatsApp: ${session.whatsapp}`] : []),
    `✉️ ${email}`,
    "🌐 www.analyticaldatasolution.com",
    "",
    "Building better teams through innovation and integrity.",
    "",
    "Disclaimer: This email and any attachments are confidential and intended solely for the recipient. If you are not the intended recipient, please delete it immediately.",
  ];
  const signature = signatureLines.join("\n");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Panel header */}
      <div className="flex-none px-3 py-2 border-b border-border bg-card">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Configuration
        </span>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-3 py-3 space-y-4">

        {/* Recruiter identity */}
        <div>
          <div className="flex items-center gap-1.5 section-label mb-2">
            <User className="w-3 h-3" />
            Recruiter Identity
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-7 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Title / Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} className="h-7 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-7 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-7 text-[12px]" />
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleSaveIdentity}
            className={`mt-3 h-7 text-[11px] w-full gap-1.5 transition-all ${
              identitySaved
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
            }`}
          >
            <Save className="w-3 h-3" />
            {identitySaved ? "Saved!" : "Save Identity"}
          </Button>
        </div>

        {/* Signature preview */}
        <div>
          <div className="section-label mb-1.5">Email Signature Preview</div>
          <div className="bg-muted/50 border border-border rounded-md p-3 font-mono text-[11px] whitespace-pre text-foreground/80 leading-relaxed">
            {signature}
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center gap-1.5 section-label mb-2">
            <FileText className="w-3 h-3" />
            Message Templates
          </div>
          <p className="text-[9px] text-muted-foreground mb-2">
            Placeholders: <code className="bg-muted px-0.5 rounded">{"{{recruiterName}}"}</code>{" "}
            <code className="bg-muted px-0.5 rounded">{"{{role}}"}</code>{" "}
            <code className="bg-muted px-0.5 rounded">{"{{signature}}"}</code>{" "}
            <code className="bg-muted px-0.5 rounded">{"{{jd}}"}</code>
          </p>

          {/* Submit template */}
          <div className="border border-border rounded-md overflow-hidden mb-2">
            <button
              onClick={() => setSubmitOpen(!submitOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="text-[11px] font-semibold text-foreground">Submit Consultant</span>
              {submitOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
            {submitOpen && (
              <div className="px-3 pb-3 pt-2 border-t border-border space-y-2">
                <Textarea
                  value={submitTemplate}
                  onChange={(e) => setSubmitTemplate(e.target.value)}
                  className="text-[11px] min-h-[160px] resize-none font-mono leading-relaxed"
                />
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={handleSaveSubmit}
                    className={`flex-1 h-7 text-[11px] gap-1.5 transition-all ${
                      submitSaved
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                        : "bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
                    }`}
                  >
                    <Save className="w-3 h-3" />
                    {submitSaved ? "Saved!" : "Save Template"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetSubmit}
                    className="h-7 text-[11px] px-2 gap-1 text-muted-foreground"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Inquiry template */}
          <div className="border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setInquiryOpen(!inquiryOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="text-[11px] font-semibold text-foreground">Inquiry Only</span>
              {inquiryOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
            {inquiryOpen && (
              <div className="px-3 pb-3 pt-2 border-t border-border space-y-2">
                <Textarea
                  value={inquiryTemplate}
                  onChange={(e) => setInquiryTemplate(e.target.value)}
                  className="text-[11px] min-h-[160px] resize-none font-mono leading-relaxed"
                />
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={handleSaveInquiry}
                    className={`flex-1 h-7 text-[11px] gap-1.5 transition-all ${
                      inquirySaved
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                        : "bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
                    }`}
                  >
                    <Save className="w-3 h-3" />
                    {inquirySaved ? "Saved!" : "Save Template"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetInquiry}
                    className="h-7 text-[11px] px-2 gap-1 text-muted-foreground"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* App info */}
        <div className="bg-muted/30 border border-border rounded-md p-2.5">
          <div className="section-label mb-1">About</div>
          <div className="text-[10px] text-muted-foreground space-y-0.5">
            <div>ADS Recruiter Portal v1.0.0</div>
            <div>Analytical Data Solutions LLC</div>
            <div>Internal use only · All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
