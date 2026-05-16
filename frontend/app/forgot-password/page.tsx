"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("applytics-token");

    if (token) {
      router.push("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
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
        throw new Error(data.message || "Kode reset kata sandi gagal dikirim.");
      }

      setSuccess(
        data.message || "Kode reset kata sandi telah dikirim ke alamat email Anda."
      );

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1200);
    } catch (err: any) {
      setError(
        err.message || "Terjadi kesalahan saat mengirim kode reset kata sandi."
      );
    } finally {
      setIsSending(false);
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
            <Mail size={24} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Reset Kata Sandi
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Lupa Kata Sandi?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan kode
            reset kata sandi ke email Anda.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleForgotPassword}>
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
                <Mail size={18} className="text-slate-400" />
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

            <button
              type="submit"
              disabled={isSending}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Mengirim kode..." : "Kirim Kode Reset"}
              {isSending ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Ingat kata sandi Anda?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}