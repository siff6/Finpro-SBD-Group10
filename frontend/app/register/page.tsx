"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal. Silakan coba lagi.");
      }
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
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
            <UserRound size={24} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Daftar
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Buat Akun Anda
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Bergabunglah dengan Applytics untuk menyederhanakan proses pencarian kerja dan
            mengelola lamaran Anda secara efisien.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Nama Pengguna
              <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <UserRound size={18} className="text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="cth., pencarikerja"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Membuat akun..." : "Daftar Sekarang"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
            <p className="mt-4 text-center text-sm text-slate-500">
              Sudah memiliki akun?{" "}
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