"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Send,
  X,
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
import type {
  ApplicationStatus,
  DashboardFilters,
  JobApplication,
} from "@/lib/applications/types";
import { statusMeta, statusOptions } from "@/lib/applications/types";
import { FilterBar } from "./filter-bar";

const tokenKey = "applytics-token";
const userKey = "applytics-user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type BackendApplication = {
  application_id: string;
  company_id: string;
  company_name: string;
  position: string;
  status: string;
  application_date: string;
  salary: number | string | null;
  job_type: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
};

type BackendCompany = {
  company_id: string;
  company_name: string;
  website: string | null;
  industry: string | null;
  location: string | null;
  contact: string | null;
  created_at: string;
};

type CreateApplicationForm = {
  companyId: string;
  position: string;
  status: ApplicationStatus;
  applicationDate: string;
  salary: string;
  jobType: string;
  source: string;
};

const validStatuses: ApplicationStatus[] = statusOptions;

const jobTypeOptions = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
] as const;

function normalizeStatus(status: string): ApplicationStatus {
  if (validStatuses.includes(status as ApplicationStatus)) {
    return status as ApplicationStatus;
  }

  return "Applied";
}

function formatDateForInput(value: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createInitialApplicationForm(): CreateApplicationForm {
  return {
    companyId: "",
    position: "",
    status: "Applied",
    applicationDate: new Date().toISOString().slice(0, 10),
    salary: "0",
    jobType: "Full-time",
    source: "LinkedIn",
  };
}

function mapBackendApplication(application: BackendApplication): JobApplication {
  return {
    id: application.application_id,
    companyId: application.company_id,
    company: application.company_name,
    position: application.position,
    status: normalizeStatus(application.status),
    applicationDate: formatDateForInput(application.application_date),
    salary: Number(application.salary ?? 0),
    nextAction: ["Waiting"],
    website: application.source || "-",
    contact: application.job_type || "-",
  };
}

function createUpdatePayload(application: JobApplication) {
  return {
    company_id: application.companyId,
    position: application.position,
    status: application.status,
    application_date: application.applicationDate,
    salary: Number(application.salary || 0),
    job_type: application.contact,
    source: application.website === "-" ? null : application.website,
  };
}

export function DashboardShell() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<BackendCompany[]>([]);
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("Job Hunter");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  const [createApplicationError, setCreateApplicationError] = useState("");
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateApplicationForm>(
    createInitialApplicationForm,
  );
  const [filters, setFilters] = useState<DashboardFilters>({
    status: "All",
    analytics: "Overview",
    dateRange: "All time",
  });

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoadingApplications(true);
      setApplicationsError("");

      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        setApplicationsError("Sesi login tidak ditemukan. Silakan login ulang.");
        setApplications([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Gagal mengambil data lamaran dari server.",
        );
      }

      setApplications(data.map(mapBackendApplication));
    } catch (error) {
      setApplications([]);
      setApplicationsError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data lamaran dari server.",
      );
    } finally {
      setIsLoadingApplications(false);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        setCompanies([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal mengambil data perusahaan.");
      }

      setCompanies(data);
    } catch {
      setCompanies([]);
    }
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(userKey);

    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchCompanies();
  }, [fetchApplications, fetchCompanies]);

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

  function openCreateModal() {
    setCreateApplicationError("");
    setCreateForm({
      ...createInitialApplicationForm(),
      companyId: companies[0]?.company_id || "",
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isCreatingApplication) {
      return;
    }

    setIsCreateModalOpen(false);
    setCreateApplicationError("");
  }

  function updateCreateForm(patch: Partial<CreateApplicationForm>) {
    setCreateForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  async function createApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsCreatingApplication(true);
      setCreateApplicationError("");

      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      }

      if (!createForm.companyId) {
        throw new Error("Perusahaan wajib dipilih.");
      }

      if (!createForm.position.trim()) {
        throw new Error("Posisi wajib diisi.");
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_id: createForm.companyId,
          position: createForm.position.trim(),
          status: createForm.status,
          application_date: createForm.applicationDate,
          salary: Number(createForm.salary || 0),
          job_type: createForm.jobType.trim() || "Full-time",
          source: createForm.source.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menambahkan lamaran.");
      }

      setIsCreateModalOpen(false);
      setCreateForm(createInitialApplicationForm());

      await fetchApplications();
    } catch (error) {
      setCreateApplicationError(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan lamaran.",
      );
    } finally {
      setIsCreatingApplication(false);
    }
  }

  async function updateRow(id: string, patch: Partial<JobApplication>) {
    const selectedApplication = applications.find(
      (application) => application.id === id,
    );

    if (!selectedApplication) {
      return;
    }

    const updatedApplication = {
      ...selectedApplication,
      ...patch,
    };

    const previousApplications = applications;

    try {
      setApplicationsError("");
      // optimistic update, biar UI langsung terasa responsif
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? updatedApplication : application,
        ),
      );

      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createUpdatePayload(updatedApplication)),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memperbarui lamaran.");
      }

      await fetchApplications();
    } catch (error) {
      // rollback kalau gagal
      setApplications(previousApplications);
      setApplicationsError(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui lamaran.",
      );
    }
  }

  async function deleteRow(id: string) {
    const selectedApplication = applications.find(
      (application) => application.id === id,
    );

    const confirmed = window.confirm(
      `Yakin ingin menghapus lamaran ${
        selectedApplication
          ? `${selectedApplication.position} di ${selectedApplication.company}`
          : "ini"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    if (deletingApplicationId) {
      return;
    }

    try {
      setDeletingApplicationId(id);
      setApplicationsError("");

      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus lamaran.");
      }

      setApplications((current) =>
        current.filter((application) => application.id !== id),
      );
    } catch (error) {
      setApplicationsError(
        error instanceof Error ? error.message : "Gagal menghapus lamaran.",
      );
    } finally {
      setDeletingApplicationId(null);
    }
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

          {isLoadingApplications ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Memuat data lamaran...
            </div>
          ) : null}

          {applicationsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              {applicationsError}
            </div>
          ) : null}

          {!isLoadingApplications &&
          !applicationsError &&
          applications.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Belum ada data lamaran. Tambahkan lamaran pertama Anda untuk
              mulai memantau progres.
            </div>
          ) : null}

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
            onAddRow={openCreateModal}
            onChange={updateRow}
            onDelete={deleteRow}
          />

          <ApplicationCharts applications={filteredApplications} />
        </main>
      </div>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Tambah Lamaran
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Isi detail lamaran baru, lalu simpan ke database.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Tutup form tambah lamaran"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createApplication} className="grid gap-4 px-5 py-5">
              {createApplicationError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {createApplicationError}
                </div>
              ) : null}

              {companies.length === 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Belum ada data perusahaan. Tambahkan perusahaan terlebih
                  dahulu sebelum membuat lamaran.
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">
                    Perusahaan
                  </span>
                  <select
                    value={createForm.companyId}
                    onChange={(event) =>
                      updateCreateForm({ companyId: event.target.value })
                    }
                    disabled={companies.length === 0}
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition [color-scheme:light] focus:border-blue-400 focus:bg-white"
                  >
                    {companies.length === 0 ? (
                      <option value="">Belum ada perusahaan</option>
                    ) : null}

                    {companies.map((company) => (
                      <option
                        key={company.company_id}
                        value={company.company_id}
                      >
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">Posisi</span>
                  <input
                    value={createForm.position}
                    onChange={(event) =>
                      updateCreateForm({ position: event.target.value })
                    }
                    placeholder="Contoh: Frontend Developer"
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">Status</span>
                  <select
                    value={createForm.status}
                    onChange={(event) =>
                      updateCreateForm({
                        status: event.target.value as ApplicationStatus,
                      })
                    }
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition [color-scheme:light] focus:border-blue-400 focus:bg-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusMeta[status].label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">
                    Tanggal Lamaran
                  </span>
                  <input
                    type="date"
                    value={createForm.applicationDate}
                    onChange={(event) =>
                      updateCreateForm({ applicationDate: event.target.value })
                    }
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition [color-scheme:light] focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">Gaji</span>
                  <input
                    type="number"
                    min="0"
                    value={createForm.salary}
                    onChange={(event) =>
                      updateCreateForm({ salary: event.target.value })
                    }
                    placeholder="Contoh: 8000000"
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-slate-700">
                    Jenis Kerja
                  </span>
                  <select
                    value={createForm.jobType}
                    onChange={(event) =>
                      updateCreateForm({ jobType: event.target.value })
                    }
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition [color-scheme:light] focus:border-blue-400 focus:bg-white"
                  >
                    {jobTypeOptions.map((jobType) => (
                      <option key={jobType} value={jobType}>
                        {jobType}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium text-slate-700">Sumber</span>
                  <input
                    value={createForm.source}
                    onChange={(event) =>
                      updateCreateForm({ source: event.target.value })
                    }
                    placeholder="Contoh: LinkedIn, Glints, JobStreet"
                    className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreatingApplication}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isCreatingApplication || companies.length === 0}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingApplication ? "Menyimpan..." : "Simpan Lamaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}