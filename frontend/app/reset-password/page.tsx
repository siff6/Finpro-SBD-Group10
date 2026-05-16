"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isResetting, setIsResetting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("applytics-token");

    if (token) {
      router.push("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }

    if (!code.trim()) {
      setError("Kode reset kata sandi wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Kata sandi baru harus terdiri dari minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak sesuai.");
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset kata sandi gagal. Silakan periksa kembali data Anda.");
      }

      setSuccess(
        data.message || "Kata sandi berhasil diperbarui. Anda akan diarahkan ke halaman masuk."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(
        err.message || "Terjadi kesalahan saat mereset kata sandi."
      );
    } finally {
      setIsResetting(false);
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
            <KeyRound size={24} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Buat Kata Sandi Baru
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Reset Kata Sandi
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Masukkan kode reset yang dikirim ke email Anda, lalu buat kata
            sandi baru untuk akun Applytics Anda.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleResetPassword}>
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

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Kode Reset Kata Sandi
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <ShieldCheck size={18} className="text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Masukkan kode reset"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Kata Sandi Baru
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Konfirmasi Kata Sandi Baru
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={isResetting}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResetting ? "Memperbarui kata sandi..." : "Perbarui Kata Sandi"}
              {!isResetting && <ArrowRight size={18} />}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Belum menerima kode?{" "}
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="font-medium text-blue-600 hover:underline"
              >
                Kirim ulang kode
              </Link>
            </p>

            <p className="text-center text-sm text-slate-500">
              Kembali ke halaman{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                masuk
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}