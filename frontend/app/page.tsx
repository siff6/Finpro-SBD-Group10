import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Filter,
  KanbanSquare,
  Layers3,
  TableProperties,
} from "lucide-react";
import { LandingDashboardMockup } from "@/components/charts/landing-dashboard-mockup";
import { SiteHeader } from "@/components/layout/site-header";

const features = [
  {
    icon: ClipboardList,
    title: "Smart Application Tracking",
    body: "Organize company, position, salary, contact, and next steps in one clean workspace.",
  },
  {
    icon: TableProperties,
    title: "Interactive Spreadsheet",
    body: "Inline editing, date fields, select badges, and searchable cells without spreadsheet clutter.",
  },
  {
    icon: BarChart3,
    title: "Recruitment Analytics",
    body: "Donut and bar charts summarize status ratios, interviews, and acceptance patterns.",
  },
  {
    icon: KanbanSquare,
    title: "Status Workflow",
    body: "Applied, Rejected, Interviewed, Accepted, and Offer states stay readable at a glance.",
  },
  {
    icon: Layers3,
    title: "Multi-Select Actions",
    body: "Track combined tasks like Follow up, Waiting, Prepare Interview, Send email, and Decide.",
  },
  {
    icon: Filter,
    title: "Interview Monitoring",
    body: "Filter by status, analytics focus, and application date to understand your pipeline.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#07090d] text-white">
        <section className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-md border border-blue-300/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-200">
              Modern job tracking workspace
            </span>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl">
              Stop Managing Job Applications with Spreadsheets
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
              Applytics helps you organize applications, track interview progress,
              analyze recruitment outcomes, and simplify the job hunting workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-400 px-5 font-semibold text-black transition hover:bg-blue-300"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 px-5 font-medium text-white transition hover:border-blue-300/70"
              >
                Register Now
              </Link>
            </div>
          </div>

          <LandingDashboardMockup />
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Features</span>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Built like a productivity tool, focused on job hunting
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-blue-300/35 hover:bg-white/[0.065]"
                >
                  <span className="grid size-10 place-items-center rounded-md bg-blue-400/12 text-blue-200">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-green-200">
              Analytics showcase
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              See your recruitment process clearly
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Donut charts highlight accepted, rejected, and ongoing applications.
              Bar charts reveal application volume and interview momentum.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Accepted ratio", "28%", "text-green-200"],
              ["Interview count", "11", "text-yellow-200"],
              ["Open actions", "17", "text-purple-200"],
            ].map(([label, value, color]) => (
              <article key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className={`mt-4 block text-4xl font-semibold ${color}`}>{value}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-200">Comparison</span>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ComparisonCard
                title="Spreadsheet biasa"
                items={[
                  "Manual status tracking",
                  "No workflow context",
                  "Hard to read analytics",
                  "Next actions mixed with notes",
                ]}
              />
              <ComparisonCard
                title="Applytics"
                items={[
                  "Structured job application database",
                  "Status and multi-action badges",
                  "Realtime analytics filters",
                  "Dashboard built for repeated use",
                ]}
                highlighted
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border border-blue-300/20 bg-blue-400/10 p-8 text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Track Your Job Applications Smarter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
              Replace scattered spreadsheets with a modern dashboard for fresh graduates,
              internship seekers, and active job hunters.
            </p>
            <Link
              href="/dashboard"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 font-semibold text-black transition hover:bg-blue-100"
            >
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function ComparisonCard({
  title,
  items,
  highlighted = false,
}: {
  title: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={`rounded-lg border p-5 ${
        highlighted
          ? "border-blue-300/25 bg-blue-400/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
            <CheckCircle2 size={16} className={highlighted ? "text-blue-200" : "text-zinc-600"} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
