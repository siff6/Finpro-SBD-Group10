"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Send,
} from "lucide-react";
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
  const [applications, setApplications] =
    useState<JobApplication[]>(defaultApplications);
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

  const stats = useMemo(
    () => getSummaryStats(filteredApplications),
    [filteredApplications],
  );

  function addRow() {
    setApplications((current) => [
      {
        id: `app-${Date.now()}`,
        company: "Perusahaan Baru",
        position: "Judul Posisi",
        status: "Applied",
        applicationDate: new Date().toISOString().slice(0, 10),
        salary: 0,
        nextAction: ["Waiting"],
        website: "https://",
        contact: "kontak@example.com",
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
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
  }

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-slate-50 text-slate-950">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <DashboardTopbar
          username={username}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="mx-auto grid w-full max-w-[1500px] min-w-0 gap-5 px-4 py-5 sm:px-6">
          <section className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-600">
              Dashboard
            </span>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                  Pantau lamaran kerja dengan lebih teratur
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Kelola data lamaran, status seleksi, analitik, filter, dan
                  detail penting lainnya dalam satu dashboard.
                </p>
              </div>

              <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                {filteredApplications.length} data ditampilkan
              </span>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              icon={<BriefcaseBusiness size={18} />}
              label="Total Lamaran"
              value={stats.total}
              caption="Data sesuai filter aktif"
            />

            <MetricCard
              icon={<Clock3 size={18} />}
              label="Sedang Berjalan"
              value={stats.ongoing}
              caption="Applied, interview, dan offer"
            />

            <MetricCard
              icon={<BarChart3 size={18} />}
              label="Wawancara"
              value={stats.interviewed}
              caption={`${stats.interviewRate}% rasio wawancara`}
            />

            <MetricCard
              icon={<Send size={18} />}
              label="Penawaran"
              value={stats.offers}
              caption="Perlu keputusan atau tindak lanjut"
            />

            <MetricCard
              icon={<CheckCircle2 size={18} />}
              label="Diterima"
              value={`${stats.acceptanceRate}%`}
              caption={`${stats.accepted} lamaran diterima`}
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