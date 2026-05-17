"use client";

import { API_BASE_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("applytics-token");
    if (token) {
      router.push("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowVerifyLink(false);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Autentikasi gagal. Silakan periksa email dan kata sandi Anda.");
      }
      if (!data.token || !data.user?.username) {
        throw new Error("Respons login tidak valid. Silakan coba lagi.");
      }
      localStorage.setItem("applytics-token", data.token);
      localStorage.setItem("applytics-user", data.user.username);
      router.replace("/dashboard");
    } catch (err: any) {
      const message = err.message || "Autentikasi gagal. Silakan periksa email dan kata sandi Anda.";
      setError(message);
      if (message.toLowerCase().includes("belum diverifikasi")) {
        setShowVerifyLink(true);
      }
    } finally {
      setIsLoading(false);
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
            <LockKeyhole size={24} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Masuk
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Selamat Datang Kembali
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Masuk ke akun Anda untuk mengakses ruang kerja dan melacak lamaran pekerjaan dengan mudah.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <span>{error}</span>
                {showVerifyLink && (
                  <>
                    {" "}
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(email)}`}
                      className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-800"
                    >
                      Klik di sini
                    </Link>
                    <span> untuk membuka halaman verifikasi email.</span>
                  </>
                )}
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
              Kata Sandi
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Memproses..." : "Masuk ke Ruang Kerja"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
            <p className="mt-4 text-center text-sm text-slate-500">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}