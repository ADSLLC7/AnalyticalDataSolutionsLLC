"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Building2, LogOut, LayoutGrid, Briefcase, Inbox, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession, clearSession, UserSession } from "@/lib/session";

const NAV = [
  { href: "/dashboard", label: "JD Routing", icon: LayoutGrid },
  { href: "/dashboard/jobs", label: "Job Postings", icon: Briefcase },
  { href: "/dashboard/applicants", label: "Applicants", icon: Inbox },
  { href: "/dashboard/posts", label: "Blog Posts", icon: PenSquare },
];

export default function CmsShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex-none h-11 flex items-center border-b border-border bg-[var(--navy)] text-white px-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-[#fbbf24] shrink-0" />
          <span className="font-bold text-[13px] tracking-tight whitespace-nowrap">
            Analytical Data Solutions
            <span className="text-[#fbbf24] ml-1">LLC</span>
          </span>
        </div>

        <nav className="flex items-center gap-1 ml-4">
          {NAV.map((n) => {
            const active =
              n.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <span className="hidden sm:block text-[11px] text-white/70 font-medium">
          {session.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearSession();
            router.replace("/login");
          }}
          className="h-7 text-[11px] text-white/70 hover:text-white hover:bg-white/10 gap-1.5 px-2"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-lg font-bold tracking-tight mb-4">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
