"use client";

import Link from "next/link";
import { Building2, Moon, Sun, LogOut, Wifi, User, Briefcase, Inbox, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSession } from "@/lib/session";

interface TopBarProps {
  session: UserSession;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
}

export default function TopBar({ session, darkMode, onToggleDark, onLogout }: TopBarProps) {
  return (
    <header className="flex-none h-11 flex items-center border-b border-border bg-[var(--navy)] text-white px-4 gap-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <Building2 className="w-4 h-4 text-[#fbbf24] shrink-0" />
        <span className="font-bold text-[13px] tracking-tight whitespace-nowrap">
          Analytical Data Solutions
          <span className="text-[#fbbf24] ml-1">LLC</span>
        </span>
        <span className="hidden sm:block text-white/30 text-[10px] ml-1 font-medium tracking-wider uppercase">
          · Recruiter Portal
        </span>
      </div>

      {/* CMS links */}
      <nav className="flex items-center gap-1 ml-3">
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Briefcase className="w-3 h-3" />
          <span className="hidden md:inline">Job Postings</span>
        </Link>
        <Link
          href="/dashboard/applicants"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Inbox className="w-3 h-3" />
          <span className="hidden md:inline">Applicants</span>
        </Link>
        <Link
          href="/dashboard/posts"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <PenSquare className="w-3 h-3" />
          <span className="hidden md:inline">Blog Posts</span>
        </Link>
      </nav>

      <div className="flex-1" />

      {/* Status pill */}
      <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 text-[10px] font-medium">
        <Wifi className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-300">Online</span>
      </div>

      {/* User badge */}
      <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
        <User className="w-3 h-3 text-[#fbbf24]" />
        <div className="hidden sm:block text-right">
          <div className="text-[11px] font-semibold leading-none">{session.name}</div>
          <div className="text-[9px] text-white/50 leading-none mt-0.5">{session.role}</div>
        </div>
      </div>

      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleDark}
        className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </Button>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="h-7 text-[11px] text-white/70 hover:text-white hover:bg-white/10 gap-1.5 px-2"
      >
        <LogOut className="w-3 h-3" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  );
}
