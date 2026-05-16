"use client";

import { useState } from "react";
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // kirim permintaan POST ke endpoint registrasi API
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi.");
      }
      // simpan token otentikasi dan data pengguna ke penyimpanan lokal
      localStorage.setItem("applytics-token", data.token);
      localStorage.setItem("applytics-user", data.user.username);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-[#07090d] px-4 py-10 text-white">
        <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.3)]">
          <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Register</span>
          <h1 className="mt-3 text-3xl font-semibold">Create your Applytics account</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Form ini siap dihubungkan ke database PostgreSQL. Akun yang didaftarkan akan
            dilanjutkan ke dashboard.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleRegister}>
            {/* nampilin pesan kesalahan jika terjadi kegagalan */}
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}
            <label className="grid gap-2 text-sm text-zinc-300">
              Username
              <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
                <UserRound size={18} className="text-zinc-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="jobhunter"
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Email
              <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
                <Mail size={18} className="text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Password
              <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
                <LockKeyhole size={18} className="text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-400 px-5 font-semibold text-black transition hover:bg-blue-300 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Register Now"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
            <p className="mt-4 text-center text-sm text-zinc-400">
              Udah punya akun?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Login di sini
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}