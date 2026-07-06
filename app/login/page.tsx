"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Building2, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devHint, setDevHint] = useState("");

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Enter your work email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not send the code. Try again.");
        return;
      }
      if (json.devCode) setDevHint(`Dev mode — your code is ${json.devCode}`);
      setStep("code");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Verification failed. Try again.");
        return;
      }
      localStorage.setItem(
        "ads_session",
        JSON.stringify({ ...json.profile, loggedIn: true })
      );
      router.push("/dashboard");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1445] via-[#1e2472] to-[#2a3180] px-4">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-[380px]">
        <div className="bg-white dark:bg-[#1c2230] rounded-xl shadow-2xl shadow-black/30 border border-white/10 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b]" />

          <div className="p-8">
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

            {step === "email" ? (
              <form onSubmit={requestCode} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@analyticaldatasolution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    className="h-9 text-sm border-gray-200 focus-visible:ring-[#1e2472] focus-visible:border-[#1e2472]"
                  />
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
                      Sending code…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-3.5 h-3.5" />
                      Email me a sign-in code
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="space-y-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-600 bg-gray-50 border border-gray-100 rounded px-2.5 py-2">
                  <MailCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Code sent to <strong>{email}</strong>. It expires in 10 minutes.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    6-digit code
                  </Label>
                  <Input
                    id="code"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                    className="h-10 text-center text-lg tracking-[0.5em] font-semibold border-gray-200 focus-visible:ring-[#1e2472] focus-visible:border-[#1e2472]"
                  />
                </div>

                {devHint && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5">
                    {devHint}
                  </p>
                )}
                {error && (
                  <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded px-2.5 py-1.5">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9 bg-[#1e2472] hover:bg-[#2a3180] text-white text-sm font-semibold transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Verify and sign in"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setDevHint("");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Use a different email
                </button>
              </form>
            )}

            <p className="text-center text-[10px] text-gray-400 mt-6">
              Internal use only · ADS LLC © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
