"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { getSession, clearSession, UserSession } from "@/lib/session";
import { ActivityLog } from "@/lib/mock-data";
import TopBar from "@/components/dashboard/TopBar";
import DisclaimerBanner from "@/components/dashboard/DisclaimerBanner";
import Panel1JD from "@/components/dashboard/Panel1JD";
import Panel2Routing from "@/components/dashboard/Panel2Routing";
import Panel3Config from "@/components/dashboard/Panel3Config";
import CollapsedTab from "@/components/dashboard/CollapsedTab";

type PanelId = "p1" | "p2" | "p3";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [, setLogs] = useState<ActivityLog[]>([]);
  const [emailsSent, setEmailsSent] = useState(0);
  const [lastSentTo, setLastSentTo] = useState("");
  const [collapsed, setCollapsed] = useState<Set<PanelId>>(new Set());

  // Shared between Panel1 (JD & Outreach) and Panel2 (CC Routing) so Panel2's
  // "Populate CC" button can match against the current JD without relying on
  // Extract Fields having been clicked first.
  const [jd, setJd] = useState("");
  const [detectedRole, setDetectedRole] = useState("");
  const [ccList, setCcList] = useState<string[]>([]);
  // Bumped whenever Panel2 adds/edits/deletes a CC rule so Panel1 refetches
  // its own copy (used to attach each consultant's resume file ID on send).
  const [ccRulesVersion, setCcRulesVersion] = useState(0);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLog = useCallback((log: Omit<ActivityLog, "id" | "timestamp">) => {
    const entry: ActivityLog = {
      ...log,
      id: Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [entry, ...prev].slice(0, 50));
    if (log.type === "send") {
      setEmailsSent((n) => n + 1);
      const match = log.detail.match(/To: ([^\s·]+)/);
      if (match) setLastSentTo(match[1]);
    }
  }, []);

  const toggleCollapse = (id: PanelId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  const handleUpdateSession = (partial: Partial<UserSession>) => {
    if (!session) return;
    const updated = { ...session, ...partial };
    setSession(updated);
    localStorage.setItem("ads_session", JSON.stringify(updated));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const p1Collapsed = collapsed.has("p1");
  const p2Collapsed = collapsed.has("p2");
  const p3Collapsed = collapsed.has("p3");

  // Panels collapse right-to-left (Configuration first, then CC Routing),
  // each time handing its freed width to whatever remains open — that's
  // just how react-resizable-panels redistributes size when a Panel
  // unmounts, so JD & Outreach fills the rest automatically once Config
  // and/or CC Routing are tucked away. Every panel gets its own chevron so
  // any one of them can also be collapsed directly, independent of that
  // priority order.
  const CollapseButton = ({
    id,
    label,
    side = "right",
  }: {
    id: PanelId;
    label: string;
    side?: "left" | "right";
  }) => (
    <button
      onClick={() => toggleCollapse(id)}
      className={`absolute ${side === "right" ? "right-0 rounded-l" : "left-0 rounded-r"} top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-4 h-8 bg-card border border-border shadow-sm hover:bg-muted transition-colors`}
      aria-label={`Collapse ${label}`}
      title={`Collapse ${label}`}
    >
      {side === "right" ? (
        <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
      ) : (
        <ChevronLeft className="w-2.5 h-2.5 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopBar
        session={session}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onLogout={handleLogout}
      />
      <DisclaimerBanner />

      {/* Main panel area */}
      <div className="flex flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal" className="flex-1">
          {!p1Collapsed && (
            <>
              <Panel defaultSize={45} minSize={25} id="panel1">
                <div className="relative h-full border-r border-border">
                  <Panel1JD
                    session={session}
                    onLog={handleLog}
                    jd={jd}
                    setJd={setJd}
                    detectedRole={detectedRole}
                    setDetectedRole={setDetectedRole}
                    ccList={ccList}
                    setCcList={setCcList}
                    ccRulesVersion={ccRulesVersion}
                  />
                  <CollapseButton id="p1" label="JD & Outreach" />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
            </>
          )}

          {!p2Collapsed && (
            <>
              <Panel defaultSize={25} minSize={18} id="panel2">
                <div className="relative h-full border-r border-border">
                  <Panel2Routing
                    session={session}
                    emailsSent={emailsSent}
                    lastSentTo={lastSentTo}
                    jd={jd}
                    detectedRole={detectedRole}
                    setCcList={setCcList}
                    onRulesChanged={() => setCcRulesVersion((v) => v + 1)}
                  />
                  <CollapseButton id="p2" label="CC Routing" />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
            </>
          )}

          {!p3Collapsed && (
            <Panel defaultSize={30} minSize={18} id="panel3">
              <div className="relative h-full">
                <Panel3Config session={session} onUpdateSession={handleUpdateSession} />
                <CollapseButton id="p3" label="Configuration" side="left" />
              </div>
            </Panel>
          )}
        </PanelGroup>

        {/* Collapsed tabs stack on the right */}
        {p1Collapsed ? (
          <CollapsedTab label="JD & Outreach" onExpand={() => toggleCollapse("p1")} />
        ) : null}
        {p2Collapsed ? (
          <CollapsedTab label="CC Routing" onExpand={() => toggleCollapse("p2")} />
        ) : null}
        {p3Collapsed ? (
          <CollapsedTab label="Config" onExpand={() => toggleCollapse("p3")} />
        ) : null}
      </div>

      {/* Marquee keyframes */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
