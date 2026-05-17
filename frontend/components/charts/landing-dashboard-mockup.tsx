"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
import { StatusBadge } from "@/components/table/status-badge";
import { ActionBadge } from "@/components/table/action-badge";

const getApiBaseUrl = () => {
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }

  return "/api";
};

type ApplicationStatus =
  | "Applied"
  | "Interviewed"
  | "Accepted"
  | "Rejected"
  | "Offer";

type ApplicationItem = {
  id?: string;
  application_id?: string;
  company?: string;
  company_name?: string;
  position?: string;
  status?: ApplicationStatus | string;
  applicationDate?: string;
  application_date?: string;
  nextAction?: string[] | string;
  next_action?: string[] | string;
};

const mockApplications: ApplicationItem[] = [
  {
    company: "Orbit",
    status: "Interviewed",
    nextAction: "Prepare Interview",
    applicationDate: new Date().toISOString(),
  },
  {
    company: "Kirana",
    status: "Offer",
    nextAction: "Decide",
    applicationDate: new Date().toISOString(),
  },
  {
    company: "Sagara",
    status: "Applied",
    nextAction: "Waiting",
    applicationDate: new Date().toISOString(),
  },
];

const statusColorMap: Record<string, string> = {
  Accepted: "#16a34a",
  Interviewed: "#eab308",
  Rejected: "#ef4444",
  Applied: "#2563eb",
  Offer: "#7c3aed",
};

const statusLabelMap: Record<string, string> = {
  Accepted: "Diterima",
  Interviewed: "Wawancara",
  Rejected: "Ditolak",
  Applied: "Dilamar",
  Offer: "Penawaran",
};

const actionLabelMap: Record<string, string> = {
  "Prepare Interview": "Persiapan Wawancara",
  Decide: "Ambil Keputusan",
  Waiting: "Menunggu",
  "Follow up": "Tindak Lanjut",
  "Send email": "Kirim Email",
};

const dayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
});

export function LandingDashboardMockup() {
  const mounted = useClientMounted();
  const [applications, setApplications] = useState<ApplicationItem[]>(mockApplications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      const token = localStorage.getItem("applytics-token");

      if (!token) {
        setIsLoggedIn(false);
        setIsUsingRealData(false);
        setApplications(mockApplications);
        return;
      }

      setIsLoggedIn(true);

      try {
        const response = await fetch(`${getApiBaseUrl()}/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data lamaran.");
        }

        const payload = await response.json();

        const data = Array.isArray(payload)
          ? payload
          : payload.applications ?? payload.data ?? [];

        setApplications(data);
        setIsUsingRealData(true);
      } catch (error) {
        console.error("Gagal memuat data landing dashboard:", error);
        setIsUsingRealData(false);
        setApplications(mockApplications);
      }
    };

    loadApplications();

    window.addEventListener("focus", loadApplications);
    window.addEventListener("storage", loadApplications);

    return () => {
      window.removeEventListener("focus", loadApplications);
      window.removeEventListener("storage", loadApplications);
    };
  }, []);

  const summary = useMemo(() => {
    const totalApplications = applications.length;
    const interviewCount = applications.filter(
      (application) => getStatus(application) === "Interviewed",
    ).length;

    const offerCount = applications.filter((application) =>
      ["Offer", "Accepted"].includes(getStatus(application)),
    ).length;

    const latestApplications = applications.slice(0, 3);

    const statusGroups = ["Accepted", "Interviewed", "Rejected", "Applied", "Offer"]
      .map((status) => ({
        name: status,
        value: applications.filter((application) => getStatus(application) === status).length,
        color: statusColorMap[status],
      }))
      .filter((item) => item.value > 0);

    const pieData =
      statusGroups.length > 0
        ? statusGroups
        : [
            { name: "Applied", value: 1, color: statusColorMap.Applied },
            { name: "Interviewed", value: 1, color: statusColorMap.Interviewed },
            { name: "Offer", value: 1, color: statusColorMap.Offer },
          ];

    const barData = buildBarData(applications);

    return {
      totalApplications,
      interviewCount,
      offerCount,
      latestApplications,
      pieData,
      barData,
    };
  }, [applications]);

  const hasNoRealData = isLoggedIn && isUsingRealData && applications.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative"
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {isLoggedIn ? "Ringkasan Lamaran Anda" : "Ringkasan Lamaran"}
            </h2>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              isUsingRealData
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {isUsingRealData ? "Data Anda" : "Contoh"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Lamaran", String(summary.totalApplications)],
            ["Wawancara", String(summary.interviewCount)],
            ["Penawaran", String(summary.offerCount)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <span className="mt-1 block text-2xl font-semibold text-slate-950">
                {value}
              </span>
            </div>
          ))}
        </div>

        {hasNoRealData ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-900">
              Belum ada lamaran yang tercatat.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Tambahkan lamaran pertama dari dashboard agar ringkasan di halaman
              ini menampilkan data akun Anda.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Perusahaan</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>

              {summary.latestApplications.map((application, index) => {
                const status = normalizeStatus(getStatus(application));
                const action = getAction(application);

                return (
                  <div
                    key={getApplicationKey(application, index)}
                    className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0"
                  >
                    <span className="truncate text-sm font-medium text-slate-800">
                      {getCompany(application)}
                    </span>

                    <StatusBadge status={status} />

                    <ActionBadge action={normalizeAction(action)} />
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3">
              <div className="h-36 min-h-[144px] rounded-2xl border border-slate-200 bg-slate-50 p-2">
                {mounted ? (
                  <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie data={summary.pieData} dataKey="value" innerRadius={32} outerRadius={52}>
                        {summary.pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="size-full rounded-xl bg-slate-100" />
                )}
              </div>

              <div className="h-36 min-h-[144px] rounded-2xl border border-slate-200 bg-slate-50 p-2">
                {mounted ? (
                  <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={summary.barData}>
                      <XAxis dataKey="label" hide />
                      <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 1, 1]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="size-full rounded-xl bg-slate-100" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getApplicationKey(application: ApplicationItem, index: number) {
  return application.id ?? application.application_id ?? `${getCompany(application)}-${index}`;
}

function getCompany(application: ApplicationItem) {
  return application.company ?? application.company_name ?? "Perusahaan";
}

function getStatus(application: ApplicationItem) {
  return application.status ?? "Applied";
}

function getAction(application: ApplicationItem) {
  const action = application.nextAction ?? application.next_action;

  if (Array.isArray(action)) {
    return action[0] ?? "Waiting";
  }

  return action ?? "Waiting";
}

function normalizeStatus(status: string) {
  if (["Applied", "Interviewed", "Accepted", "Rejected", "Offer"].includes(status)) {
    return status as "Applied" | "Interviewed" | "Accepted" | "Rejected" | "Offer";
  }

  return "Applied";
}

function normalizeAction(action: string) {
  if (["Prepare Interview", "Decide", "Waiting", "Follow up", "Send email"].includes(action)) {
    return action as "Prepare Interview" | "Decide" | "Waiting" | "Follow up" | "Send email";
  }

  return "Waiting";
}

function buildBarData(applications: ApplicationItem[]) {
  const today = new Date();

  return Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (4 - index));

    const label = dayFormatter.format(date);
    const dateKey = date.toISOString().slice(0, 10);

    const value = applications.filter((application) => {
      const applicationDate = application.applicationDate ?? application.application_date;

      if (!applicationDate) {
        return false;
      }

      return new Date(applicationDate).toISOString().slice(0, 10) === dateKey;
    }).length;

    return {
      label,
      value,
    };
  });
}

function useClientMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}