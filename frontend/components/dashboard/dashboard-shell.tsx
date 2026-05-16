"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, BriefcaseBusiness, CheckCircle2, Clock3, Send } from "lucide-react";
import { ApplicationCharts } from "@/components/charts/application-charts";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ApplicationTable } from "@/components/table/application-table";
import { MetricCard } from "@/components/ui/metric-card";
import {
  filterApplications,
  getSummaryStats,
} from "@/lib/applications/analytics";
import { defaultApplications } from "@/lib/applications/sample-data";
import type { DashboardFilters, JobApplication } from "@/lib/applications/types";
import { FilterBar } from "./filter-bar";

const storageKey = "applytics-applications";
const userKey = "applytics-user";

export function DashboardShell() {
  const [applications, setApplications] = useState<JobApplication[]>(defaultApplications);
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("Job Hunter");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    status: "All",
    analytics: "Overview",
    dateRange: "All time",
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedApplications = window.localStorage.getItem(storageKey);
        const storedUser = window.localStorage.getItem(userKey);

        if (storedApplications) {
          setApplications(JSON.parse(storedApplications));
        }

        if (storedUser) {
          setUsername(storedUser);
        }
      } catch {
        setApplications(defaultApplications);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(applications));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const filtered = filterApplications(applications, filters);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return filtered;
    }

    return filtered.filter((application) =>
      [
        application.company,
        application.position,
        application.status,
        application.website,
        application.contact,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [applications, filters, query]);

  const stats = useMemo(() => getSummaryStats(filteredApplications), [filteredApplications]);

  function addRow() {
    setApplications((current) => [
      {
        id: `app-${Date.now()}`,
        company: "New Company",
        position: "Role title",
        status: "Applied",
        applicationDate: new Date().toISOString().slice(0, 10),
        salary: 0,
        nextAction: ["Waiting"],
        website: "https://",
        contact: "contact@example.com",
      },
      ...current,
    ]);
  }

  function updateRow(id: string, patch: Partial<JobApplication>) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, ...patch } : application,
      ),
    );
  }

  function deleteRow(id: string) {
    setApplications((current) => current.filter((application) => application.id !== id));
  }

  function login(nextUsername: string) {
    setUsername(nextUsername);
    window.localStorage.setItem(userKey, nextUsername);
  }

  return (
    // <div className="grid min-h-screen bg-[#07090d] text-white lg:grid-cols-[248px_1fr]">
    <div className="flex min-h-screen bg-[#07090d] text-white">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="flex-1 min-w-0">
      {/* <div className="min-w-0"> */}
        <DashboardTopbar 
          username={username} 
          onLogin={login} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <main className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-5 sm:px-6">
          <section className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-200">
              Dashboard
            </span>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Track your job applications smarter
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  A Notion-inspired application database with analytics, filters, and
                  inline editing for every job hunting detail.
                </p>
              </div>
              <span className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-zinc-300">
                {filteredApplications.length} visible rows
              </span>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              icon={<BriefcaseBusiness size={18} />}
              label="Applications"
              value={stats.total}
              caption="Filtered rows"
            />
            <MetricCard
              icon={<Clock3 size={18} />}
              label="Ongoing"
              value={stats.ongoing}
              caption="Applied, interviewed, offer"
            />
            <MetricCard
              icon={<BarChart3 size={18} />}
              label="Interviews"
              value={stats.interviewed}
              caption={`${stats.interviewRate}% interview rate`}
            />
            <MetricCard
              icon={<Send size={18} />}
              label="Offers"
              value={stats.offers}
              caption="Needs decision or follow-up"
            />
            <MetricCard
              icon={<CheckCircle2 size={18} />}
              label="Accepted"
              value={`${stats.acceptanceRate}%`}
              caption={`${stats.accepted} accepted`}
            />
          </section>

          <FilterBar filters={filters} onChange={setFilters} />

          <ApplicationTable
            applications={filteredApplications}
            query={query}
            onQueryChange={setQuery}
            onAddRow={addRow}
            onChange={updateRow}
            onDelete={deleteRow}
          />

          <ApplicationCharts applications={filteredApplications} />
        </main>
      </div>
    </div>
  );
}
