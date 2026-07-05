"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRecruiterByEmail } from "@/lib/recruiters";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    // Stub auth — any credentials work; match to recruiter profile if known
    await new Promise((r) => setTimeout(r, 700));

    const profile = getRecruiterByEmail(email);
    const name = profile?.name ?? email.split("@")[0]
      .split(".")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");

    localStorage.setItem(
      "ads_session",
      JSON.stringify({
        email,
        name,
        role: profile?.title ?? "Senior Recruiter",
        phone: profile?.phone ?? "+1 (555) 000-0000",
        loggedIn: true,
        recruiterId: profile?.recruiterId ?? "recruiter_0",
        webhookUrl: profile?.webhookUrl ?? "",
      })
    );

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1445] via-[#1e2472] to-[#2a3180] px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-[380px]">
        {/* Card */}
        <div className="bg-white dark:bg-[#1c2230] rounded-xl shadow-2xl shadow-black/30 border border-white/10 overflow-hidden">
          {/* Header strip */}
          <div className="h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b]" />

          <div className="p-8">
            {/* Logo / wordmark */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1e2472] mb-3 shadow-lg">
                <Building2 className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <div className="text-center">
                <h1 className="text-[15px] font-bold text-[#1e2472] tracking-tight leading-tight">
                  ANALYTICAL DATA SOLUTIONS
                </h1>
                <div className="text-[10px] font-semibold tracking-[0.2em] text-[#f59e0b] uppercase mt-0.5">
                  LLC — Recruiter Portal
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="recruiter@adsdatasolutions.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-9 text-sm border-gray-200 focus-visible:ring-[#1e2472] focus-visible:border-[#1e2472]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-9 text-sm pr-9 border-gray-200 focus-visible:ring-[#1e2472] focus-visible:border-[#1e2472]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded px-2.5 py-1.5">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 bg-[#1e2472] hover:bg-[#2a3180] text-white text-sm font-semibold mt-2 transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-[10px] text-gray-400 mt-6">
              Internal use only · ADS LLC © {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Dev hint */}
        <p className="text-center text-[10px] text-white/30 mt-4">
          Demo: any email + password will work
        </p>
      </div>
    </div>
  );
}
