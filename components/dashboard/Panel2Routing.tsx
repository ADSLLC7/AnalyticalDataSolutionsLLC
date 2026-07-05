"use client";

import { useState } from "react";
import { Plus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CONSULTANTS, ROUTING_RULES } from "@/lib/mock-data";

interface Panel2Props {
  emailsSent: number;
  lastSentTo: string;
}

export default function Panel2Routing({ emailsSent, lastSentTo }: Panel2Props) {
  const [customCc, setCustomCc] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Panel header */}
      <div className="flex-none px-3 py-2 border-b border-border bg-card">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          CC Routing &amp; Consultants
        </span>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-3 py-3 space-y-4">

        {/* Routing table */}
        <div>
          <div className="section-label mb-1.5">Role → Consultant Routing</div>
          <div className="border border-border rounded-md overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground w-5"></th>
                  <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">Consultant</th>
                  <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {ROUTING_RULES.map((rule) => {
                  const consultant = CONSULTANTS.find((c) => c.id === rule.consultantId);
                  const isSelected = selectedRows.includes(rule.consultantId);
                  return (
                    <tr
                      key={rule.consultantId}
                      onClick={() => toggleRow(rule.consultantId)}
                      className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/5 dark:bg-primary/10"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <td className="px-2 py-1.5">
                        <div
                          className={`w-3 h-3 rounded border transition-colors ${
                            isSelected
                              ? "bg-[var(--navy)] border-[var(--navy)]"
                              : "border-border"
                          }`}
                        />
                      </td>
                      <td className="px-2 py-1.5 font-medium text-foreground">
                        {rule.role}
                      </td>
                      <td className="px-2 py-1.5 text-muted-foreground truncate max-w-[100px]">
                        {consultant?.name ?? "—"}
                      </td>
                      <td className="px-2 py-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                            consultant?.available
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              consultant?.available ? "bg-emerald-500" : "bg-red-400"
                            }`}
                          />
                          {consultant?.available ? "Available" : "Busy"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {selectedRows.length > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {selectedRows.length} consultant(s) selected for CC routing
            </p>
          )}
        </div>

        {/* Custom CC */}
        <div>
          <div className="section-label mb-1.5">Custom CC</div>
          <div className="flex gap-1.5">
            <Input
              value={customCc}
              onChange={(e) => setCustomCc(e.target.value)}
              placeholder="custom@company.com"
              className="h-7 text-[12px] flex-1"
            />
            <Button size="sm" variant="outline" className="h-7 px-2 shrink-0">
              <Plus className="w-3 h-3" />
            </Button>
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

        {/* Mode guide cards */}
        <div>
          <div className="section-label mb-1.5">Mode Guide</div>
          <div className="space-y-2">
            <ModeCard
              title="Submit Consultant"
              color="navy"
              items={[
                "Attach candidate resume",
                "Include relevant experience summary",
                "CC assigned consultant",
                "Use formal submission language",
              ]}
            />
            <ModeCard
              title="Inquiry Only"
              color="gold"
              items={[
                "Ask for JD details & requirements",
                "Clarify work authorization preferences",
                "Request interview process info",
                "Do not mention specific consultants",
              ]}
            />
          </div>
        </div>

        {/* Consultant quick list */}
        <div>
          <div className="section-label mb-1.5">Consultant Directory</div>
          <div className="space-y-1.5">
            {CONSULTANTS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 p-2 bg-card border border-border rounded-md"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--navy)]/10 dark:bg-[var(--navy)]/30 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[var(--navy)] dark:text-primary">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-foreground truncate">{c.name}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{c.email}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      c.available ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <Mail className="w-3 h-3 text-muted-foreground hover:text-[var(--navy)] cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  color,
  items,
}: {
  title: string;
  color: "navy" | "gold";
  items: string[];
}) {
  return (
    <div
      className={`rounded-md border p-2.5 ${
        color === "navy"
          ? "border-[var(--navy)]/20 bg-[var(--navy)]/5 dark:bg-[var(--navy)]/10"
          : "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20"
      }`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
          color === "navy"
            ? "text-[var(--navy)] dark:text-primary"
            : "text-amber-700 dark:text-amber-400"
        }`}
      >
        {title}
      </div>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
            <span
              className={`mt-0.5 w-1 h-1 rounded-full shrink-0 ${
                color === "navy" ? "bg-[var(--navy)] dark:bg-primary" : "bg-amber-500"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
