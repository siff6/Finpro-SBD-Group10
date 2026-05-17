"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Database,
  Globe2,
  LogOut,
  Palette,
  Send,
  ShieldCheck,
  UserRound,
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
  JobType,
} from "@/lib/applications/types";
import {
  jobTypeOptions,
  statusMeta,
  statusOptions,
} from "@/lib/applications/types";
import { FilterBar } from "./filter-bar";

const tokenKey = "applytics-token";
const userKey = "applytics-user";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");

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
  jobType: JobType;
  source: string;
};

type CreateCompanyForm = {
  companyName: string;
  website: string;
  industry: string;
  location: string;
  contact: string;
};

const validStatuses: ApplicationStatus[] = statusOptions;

function normalizeStatus(status: string): ApplicationStatus {
  if (validStatuses.includes(status as ApplicationStatus)) {
    return status as ApplicationStatus;
  }

  return "Applied";
}

function normalizeJobType(jobType: string | null): JobType {
  if (jobTypeOptions.includes(jobType as JobType)) {
    return jobType as JobType;
  }

  return "Full-time";
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

function createInitialCompanyForm(): CreateCompanyForm {
  return {
    companyName: "",
    website: "",
    industry: "",
    location: "",
    contact: "",
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
    source: application.source || "-",
    jobType: normalizeJobType(application.job_type),
  };
}

function createUpdatePayload(application: JobApplication) {
  return {
    company_id: application.companyId,
    position: application.position,
    status: application.status,
    application_date: application.applicationDate,
    salary: Number(application.salary || 0),
    job_type: application.jobType,
    source: application.source === "-" ? null : application.source,
  };
}

type DashboardShellProps = {
  view?: "dashboard" | "lamaran" | "analitik" | "pengaturan";
};

export function DashboardShell({ view = "dashboard" }: DashboardShellProps) {
  const isApplicationsPage = view === "lamaran";
  const isAnalyticsPage = view === "analitik";
  const isSettingsPage = view === "pengaturan";
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
  const [createCompanyForm, setCreateCompanyForm] =
    useState<CreateCompanyForm>(createInitialCompanyForm);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [createCompanyError, setCreateCompanyError] = useState("");
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

  const fetchCompanies = useCallback(async (): Promise<BackendCompany[]> => {
    try {
      const token = window.localStorage.getItem(tokenKey);

      if (!token) {
        setCompanies([]);
        return [];
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

      const companiesData = Array.isArray(data)
        ? data
        : data?.companies || data?.data || [];

      setCompanies(companiesData);
      return companiesData;
    } catch {
      setCompanies([]);
      return [];
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

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCreateModalOpen]);

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
        application.source,
        application.jobType,
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
    setCreateCompanyError("");
    setCreateCompanyForm(createInitialCompanyForm());
    setCreateForm({
      ...createInitialApplicationForm(),
      companyId: companies[0]?.company_id || "",
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isCreatingApplication || isCreatingCompany) {
      return;
    }

    setIsCreateModalOpen(false);
    setCreateApplicationError("");
    setCreateCompanyError("");
  }

  function updateCreateForm(patch: Partial<CreateApplicationForm>) {
    setCreateForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateCreateCompanyForm(patch: Partial<CreateCompanyForm>) {
    setCreateCompanyForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  async function createCompany() {
  try {
    setIsCreatingCompany(true);
    setCreateCompanyError("");
    setCreateApplicationError("");

    const token = window.localStorage.getItem(tokenKey);

    if (!token) {
      throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
    }

    const companyName = createCompanyForm.companyName.trim();

    if (!companyName) {
      throw new Error("Nama perusahaan wajib diisi.");
    }

    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_name: companyName,
        website: createCompanyForm.website.trim() || null,
        industry: createCompanyForm.industry.trim() || null,
        location: createCompanyForm.location.trim() || null,
        contact: createCompanyForm.contact.trim() || null,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Gagal menambahkan perusahaan.");
    }

    const updatedCompanies = await fetchCompanies();
    const createdCompany = data?.company || data?.data || data;

    const selectedCompany =
      updatedCompanies.find(
        (company) => company.company_id === createdCompany?.company_id,
      ) ||
      updatedCompanies.find(
        (company) =>
          company.company_name.toLowerCase() === companyName.toLowerCase(),
      );

    if (selectedCompany) {
      updateCreateForm({ companyId: selectedCompany.company_id });
    }

    setCreateCompanyForm(createInitialCompanyForm());
      } catch (error) {
        setCreateCompanyError(
          error instanceof Error
            ? error.message
            : "Gagal menambahkan perusahaan.",
        );
      } finally {
        setIsCreatingCompany(false);
      }
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
          job_type: createForm.jobType,
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

  function handleLogout() {
    window.localStorage.removeItem(tokenKey);
    window.localStorage.removeItem(userKey);
    window.location.href = "/login";
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
          searchQuery={query}
          onSearchQueryChange={setQuery}
        />

        <main className="mx-auto grid w-full max-w-[1500px] min-w-0 gap-5 px-4 py-5 sm:px-6">
          <section className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-600">
              {isApplicationsPage
                ? "Lamaran"
                : isAnalyticsPage
                  ? "Analitik"
                  : isSettingsPage
                    ? "Pengaturan"
                    : "Dashboard"}
            </span>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                  {isApplicationsPage
                    ? "Kelola semua lamaran kerja Anda"
                    : isAnalyticsPage
                      ? "Analisis perkembangan lamaran kerja Anda"
                      : isSettingsPage
                        ? "Atur akun dan preferensi workspace"
                        : "Pantau lamaran kerja dengan lebih teratur"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {isApplicationsPage
                    ? "Lihat, cari, tambah, perbarui, dan hapus data lamaran kerja dalam satu halaman yang lebih fokus."
                    : isAnalyticsPage
                      ? "Pahami status lamaran, peluang wawancara, penawaran, dan hasil akhir dari proses pencarian kerja Anda."
                      : isSettingsPage
                        ? "Lihat informasi akun, preferensi tampilan, status data, dan akses keluar dari akun."
                        : "Kelola data lamaran, status seleksi, analitik, filter, dan detail penting lainnya dalam satu dashboard."}
                </p>
              </div>

              <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                {isApplicationsPage
                  ? `${filteredApplications.length} lamaran ditemukan`
                  : isAnalyticsPage
                    ? `${filteredApplications.length} data dianalisis`
                    : isSettingsPage
                      ? "Pengaturan akun"
                      : `${filteredApplications.length} data ditampilkan`}
              </span>
            </div>
          </section>

          {!isSettingsPage && isLoadingApplications ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Memuat data lamaran...
            </div>
          ) : null}

          {!isSettingsPage && applicationsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              {applicationsError}
            </div>
          ) : null}

          {!isSettingsPage &&
          !isLoadingApplications &&
          !applicationsError &&
          applications.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Belum ada data lamaran. Tambahkan lamaran pertama Anda untuk
              mulai memantau progres.
            </div>
          ) : null}

          {!isApplicationsPage && !isSettingsPage ? (
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
          ) : null}

          {!isSettingsPage ? (
            <FilterBar filters={filters} onChange={setFilters} />
          ) : null}

          {!isAnalyticsPage && !isSettingsPage ? (
            <ApplicationTable
              applications={filteredApplications}
              onAddRow={openCreateModal}
              onChange={updateRow}
              onDelete={deleteRow}
            />
          ) : null}

          {isAnalyticsPage ? (
            <section className="grid gap-3 md:grid-cols-3">
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-medium text-slate-500">
                  Rasio Wawancara
                </span>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">
                  {stats.interviewRate}%
                </strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Persentase lamaran yang sudah masuk tahap wawancara.
                </p>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-medium text-slate-500">
                  Rasio Diterima
                </span>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">
                  {stats.acceptanceRate}%
                </strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Persentase lamaran yang berhasil diterima.
                </p>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-medium text-slate-500">
                  Proses Berjalan
                </span>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">
                  {stats.ongoing}
                </strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Lamaran yang masih perlu dipantau atau ditindaklanjuti.
                </p>
              </article>
            </section>
          ) : null}

          {isSettingsPage ? (
            <SettingsPanel
              username={username}
              totalApplications={applications.length}
              totalCompanies={companies.length}
              onLogout={handleLogout}
            />
          ) : null}

          {!isApplicationsPage && !isSettingsPage ? (
            <ApplicationCharts applications={filteredApplications} />
          ) : null}
        </main>
      </div>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-4xl items-start justify-center">
            <div className="flex max-h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="shrink-0 flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
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
                  className="grid size-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Tutup form tambah lamaran"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={createApplication}
                className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
              >
                <div className="grid gap-4">
                  {createApplicationError ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {createApplicationError}
                    </div>
                  ) : null}

                  <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-950">
                      Tambah Perusahaan Baru
                    </summary>

                    <div className="mt-3 grid gap-3">
                      <p className="text-xs leading-5 text-slate-600">
                        Jika perusahaan belum tersedia di pilihan, tambahkan data
                        perusahaan terlebih dahulu.
                      </p>

                      {createCompanyError ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {createCompanyError}
                        </div>
                      ) : null}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5 text-sm">
                          <span className="font-medium text-slate-700">
                            Nama Perusahaan
                          </span>
                          <input
                            value={createCompanyForm.companyName}
                            onChange={(event) =>
                              updateCreateCompanyForm({
                                companyName: event.target.value,
                              })
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void createCompany();
                              }
                            }}
                            placeholder="Contoh: Tokopedia"
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>

                        <label className="grid gap-1.5 text-sm">
                          <span className="font-medium text-slate-700">
                            Website
                          </span>
                          <input
                            value={createCompanyForm.website}
                            onChange={(event) =>
                              updateCreateCompanyForm({
                                website: event.target.value,
                              })
                            }
                            placeholder="Contoh: https://tokopedia.com"
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>

                        <label className="grid gap-1.5 text-sm">
                          <span className="font-medium text-slate-700">
                            Industri
                          </span>
                          <input
                            value={createCompanyForm.industry}
                            onChange={(event) =>
                              updateCreateCompanyForm({
                                industry: event.target.value,
                              })
                            }
                            placeholder="Contoh: Teknologi"
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>

                        <label className="grid gap-1.5 text-sm">
                          <span className="font-medium text-slate-700">Lokasi</span>
                          <input
                            value={createCompanyForm.location}
                            onChange={(event) =>
                              updateCreateCompanyForm({
                                location: event.target.value,
                              })
                            }
                            placeholder="Contoh: Jakarta"
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>

                        <label className="grid gap-1.5 text-sm sm:col-span-2">
                          <span className="font-medium text-slate-700">Kontak</span>
                          <input
                            value={createCompanyForm.contact}
                            onChange={(event) =>
                              updateCreateCompanyForm({
                                contact: event.target.value,
                              })
                            }
                            placeholder="Contoh: HRD atau email perusahaan"
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                          />
                        </label>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={createCompany}
                          disabled={isCreatingCompany}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isCreatingCompany
                            ? "Menambahkan..."
                            : "Tambah Perusahaan"}
                        </button>
                      </div>
                    </div>
                  </details>

                  {companies.length === 0 ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      Belum ada data perusahaan. Tambahkan perusahaan terlebih dahulu
                      sebelum membuat lamaran.
                    </div>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium text-slate-700">Perusahaan</span>
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
                          updateCreateForm({
                            applicationDate: event.target.value,
                          })
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
                          updateCreateForm({
                            jobType: event.target.value as JobType,
                          })
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
                      disabled={isCreatingApplication || isCreatingCompany}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={
                        isCreatingApplication ||
                        isCreatingCompany ||
                        companies.length === 0
                      }
                      className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreatingApplication ? "Menyimpan..." : "Simpan Lamaran"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SettingsPanel({
  username,
  totalApplications,
  totalCompanies,
  onLogout,
}: {
  username: string;
  totalApplications: number;
  totalCompanies: number;
  onLogout: () => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-5">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">
              <UserRound size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-950">
                Profil Akun
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Informasi dasar akun yang sedang digunakan di workspace Applytics.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Nama Pengguna
              </span>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {username || "Job Hunter"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Status Sesi
              </span>
              <p className="mt-2 text-sm font-semibold text-emerald-700">
                Aktif
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
              <ShieldCheck size={20} />
            </span>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Keamanan Akun
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Gunakan fitur lupa kata sandi jika ingin mengganti kata sandi akun.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="text-sm font-semibold text-slate-950">
              Verifikasi email
            </span>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Akun yang dapat masuk ke dashboard adalah akun yang sudah berhasil diverifikasi.
            </p>
          </div>
        </article>
      </div>

      <div className="grid gap-5">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-200 bg-violet-50 text-violet-700">
              <Palette size={20} />
            </span>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Preferensi Tampilan
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Pengaturan tampilan dasar yang digunakan di dashboard.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <SettingRow
              icon={<Palette size={17} />}
              label="Tema"
              value="Light"
            />
            <SettingRow
              icon={<Globe2 size={17} />}
              label="Bahasa"
              value="Indonesia"
            />
            <SettingRow
              icon={<Database size={17} />}
              label="Format Mata Uang"
              value="Rupiah"
            />
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Ringkasan Data
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Jumlah data yang sudah tercatat di akun Anda.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Total Lamaran
              </span>
              <strong className="mt-1 block text-2xl font-semibold text-slate-950">
                {totalApplications}
              </strong>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Total Perusahaan
              </span>
              <strong className="mt-1 block text-2xl font-semibold text-slate-950">
                {totalCompanies}
              </strong>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-red-900">
            Keluar dari Akun
          </h2>
          <p className="mt-1 text-sm leading-6 text-red-700">
            Gunakan tombol ini jika ingin mengakhiri sesi login di perangkat ini.
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <LogOut size={17} />
            Keluar dari Akun
          </button>
        </article>
      </div>
    </section>
  );
}

function SettingRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="text-slate-500">{icon}</span>
        <span>{label}</span>
      </div>

      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}