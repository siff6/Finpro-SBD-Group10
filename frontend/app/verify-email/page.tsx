"use client";

import { API_BASE_URL } from "@/lib/api";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("applytics-token");
    if (token) {
        router.push("/dashboard");
    } else {
        setIsChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }

    if (!code.trim()) {
      setError("Kode verifikasi wajib diisi.");
      return;
    }

    if (code.trim().length < 4) {
      setError("Kode verifikasi tidak valid.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verifikasi email gagal. Silakan periksa kembali kode Anda.");
      }

      setSuccess(data.message || "Email berhasil diverifikasi. Anda akan diarahkan ke halaman masuk.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi sebelum mengirim ulang kode verifikasi.");
      return;
    }

    setIsResending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const customError: any = new Error(data.message || "Kode verifikasi gagal dikirim ulang.");
        customError.remainingSeconds = data.remainingSeconds;
        throw customError;
      }
      setSuccess(data.message || "Kode verifikasi baru telah dikirim ke alamat email Anda.");
      setResendCooldown(120);
    } catch (err: any) {
    setError(err.message);
    if (err.remainingSeconds) {
      setResendCooldown(err.remainingSeconds);
    }
    } finally {
      setIsResending(false);
    }
  };

  if (isChecking) {
    return null;
  }

  return (
    <>
      <SiteHeader />

      <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-slate-50 px-4 py-10 text-slate-950">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MailCheck size={24} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Verifikasi Email
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Periksa Kotak Masuk Email Anda
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Kami telah mengirimkan kode verifikasi ke alamat email yang Anda gunakan saat mendaftar.
            Masukkan kode tersebut untuk mengaktifkan akun Anda.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleVerifyEmail}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Alamat Email
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <MailCheck size={18} className="text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@contoh.com"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Kode Verifikasi
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <ShieldCheck size={18} className="text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Masukkan kode verifikasi"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={isVerifying}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Memverifikasi..." : "Verifikasi Email"}
              {!isVerifying && <ArrowRight size={18} />}
            </button>

            <button
              type="button"
              disabled={isResending || resendCooldown > 0}
              onClick={handleResendCode}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={isResending ? "animate-spin" : ""} />
              {isResending
                ? "Mengirim ulang..."
                : resendCooldown > 0
                    ? `Kirim ulang dalam ${resendCooldown} detik`
                    : "Kirim Ulang Kode"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Sudah memverifikasi email?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                Masuk sekarang
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}