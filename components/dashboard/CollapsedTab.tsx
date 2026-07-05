"use client";

import { ChevronLeft } from "lucide-react";

interface CollapsedTabProps {
  label: string;
  onExpand: () => void;
}

export default function CollapsedTab({ label, onExpand }: CollapsedTabProps) {
  return (
    <div
      onClick={onExpand}
      className="h-full flex flex-col items-center justify-center gap-2 cursor-pointer bg-card hover:bg-muted/60 border-l border-border transition-colors group w-8"
      role="button"
      aria-label={`Expand ${label}`}
    >
      <ChevronLeft className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span
        className="text-[10px] font-semibold tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
    </div>
  );
}
