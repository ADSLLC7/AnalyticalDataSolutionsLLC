"use client";

import { useState } from "react";
import { Save, User, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserSession } from "@/lib/session";
import { getRecruiterByEmail } from "@/lib/recruiters";
import { SUBMIT_TEMPLATE, INQUIRY_TEMPLATE } from "@/lib/mock-data";

interface Panel3Props {
  session: UserSession;
  onUpdateSession: (s: Partial<UserSession>) => void;
}

export default function Panel3Config({ session, onUpdateSession }: Panel3Props) {
  const profile = getRecruiterByEmail(session.email);
  const [name, setName] = useState(session.name);
  const [phone, setPhone] = useState(session.phone);
  const [email, setEmail] = useState(session.email);
  const [role, setRole] = useState(session.role);
  const [submitTemplate, setSubmitTemplate] = useState(
    profile?.submitTemplate ?? SUBMIT_TEMPLATE
  );
  const [inquiryTemplate, setInquiryTemplate] = useState(
    profile?.inquiryTemplate ?? INQUIRY_TEMPLATE
  );
  const [submitOpen, setSubmitOpen] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSession({ name, phone, email, role });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const signature = `Best regards,\n${name}\n${role}\nAnalytical Data Solutions\n3300 West Dallas Parkway, Suite 200, Plano, Tx 75093.\nPhone: ${phone}\nEmail: ${email}\nBuilding better teams through innovation and integrity`;

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
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Title / Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-7 text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-7 text-[12px]"
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            className={`mt-3 h-7 text-[11px] w-full gap-1.5 transition-all ${
              saved
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white"
            }`}
          >
            <Save className="w-3 h-3" />
            {saved ? "Saved!" : "Save Identity"}
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

          {/* Submit template */}
          <div className="border border-border rounded-md overflow-hidden mb-2">
            <button
              onClick={() => setSubmitOpen(!submitOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="text-[11px] font-semibold text-foreground">Submit Consultant Template</span>
              {submitOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            {submitOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-border">
                <p className="text-[9px] text-muted-foreground mb-1.5">
                  Use <code className="bg-muted px-0.5 rounded">{"{variable}"}</code> placeholders. Available:{" "}
                  {"{senderName}"}, {"{role}"}, {"{company}"}, {"{recruiterName}"}
                </p>
                <Textarea
                  value={submitTemplate}
                  onChange={(e) => setSubmitTemplate(e.target.value)}
                  className="text-[11px] min-h-[140px] resize-none font-mono leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Inquiry template */}
          <div className="border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setInquiryOpen(!inquiryOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="text-[11px] font-semibold text-foreground">Inquiry Only Template</span>
              {inquiryOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            {inquiryOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-border">
                <p className="text-[9px] text-muted-foreground mb-1.5">
                  Use <code className="bg-muted px-0.5 rounded">{"{variable}"}</code> placeholders.
                </p>
                <Textarea
                  value={inquiryTemplate}
                  onChange={(e) => setInquiryTemplate(e.target.value)}
                  className="text-[11px] min-h-[140px] resize-none font-mono leading-relaxed"
                />
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
