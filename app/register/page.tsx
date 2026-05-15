import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-[#07090d] px-4 py-10 text-white">
        <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.3)]">
          <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Register</span>
          <h1 className="mt-3 text-3xl font-semibold">Create your Applytics account</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Form ini siap dihubungkan ke Supabase Auth. Untuk demo frontend, akun lokal
            dilanjutkan ke dashboard.
          </p>

          <form className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-zinc-300">
              Username
              <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3">
                <UserRound size={18} className="text-zinc-500" />
                <input
                  type="text"
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
                  placeholder="Minimal 8 karakter"
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                />
              </span>
            </label>

            <Link
              href="/dashboard"
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-400 px-5 font-semibold text-black transition hover:bg-blue-300"
            >
              Register Now
              <ArrowRight size={18} />
            </Link>
          </form>
        </section>
      </main>
    </>
  );
}
