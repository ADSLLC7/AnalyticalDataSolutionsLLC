"use client";

import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="flex-none h-7 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-center overflow-hidden px-3 gap-2">
      <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] text-amber-800 dark:text-amber-300 whitespace-nowrap animate-[marquee_40s_linear_infinite]">
          CONFIDENTIAL — FOR INTERNAL USE ONLY · This portal contains proprietary information belonging to Analytical Data Solutions LLC. Unauthorized access, disclosure, or distribution is strictly prohibited. All activities are monitored and logged. By using this system you agree to ADS LLC&apos;s Acceptable Use Policy. · CONFIDENTIAL — FOR INTERNAL USE ONLY · This portal contains proprietary information belonging to Analytical Data Solutions LLC.
        </p>
      </div>
    </div>
  );
}
