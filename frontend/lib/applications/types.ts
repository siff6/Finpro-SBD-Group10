export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Rejected"
  | "Interviewed"
  | "Accepted"
  | "Offer"
  | "Withdrawn";

export type JobType =
  | "Internship"
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance";

export type NextAction =
  | "Follow up"
  | "Waiting"
  | "Prepare Interview"
  | "Send email"
  | "Decide";

export type JobApplication = {
  id: string;
  companyId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  applicationDate: string;
  salary: number;
  nextAction: NextAction[];
  source: string;
  jobType: JobType;
};

export type DashboardFilters = {
  status: "All" | ApplicationStatus;
  analytics: "Overview" | "Interviews" | "Offers";
  dateRange: "All time" | "Last 7 days" | "Last 30 days";
};

export const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Screening",
  "Interviewed",
  "Offer",
  "Accepted",
  "Rejected",
  "Withdrawn",
];

export const jobTypeOptions: JobType[] = [
  "Internship",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
];

export const nextActionOptions: NextAction[] = [
  "Follow up",
  "Waiting",
  "Prepare Interview",
  "Send email",
  "Decide",
];

export const statusMeta: Record<
  ApplicationStatus,
  { dot: string; label: string; text: string; bg: string; chart: string }
> = {
  Applied: {
    dot: "bg-blue-500",
    label: "Dilamar",
    text: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    chart: "#60a5fa",
  },
  Screening: {
    dot: "bg-cyan-500",
    label: "Screening",
    text: "text-cyan-700",
    bg: "bg-cyan-50 border-cyan-200",
    chart: "#22d3ee",
  },
  Interviewed: {
    dot: "bg-amber-500",
    label: "Wawancara",
    text: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    chart: "#facc15",
  },
  Offer: {
    dot: "bg-violet-500",
    label: "Penawaran",
    text: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    chart: "#c084fc",
  },
  Accepted: {
    dot: "bg-emerald-500",
    label: "Diterima",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    chart: "#4ade80",
  },
  Rejected: {
    dot: "bg-red-500",
    label: "Ditolak",
    text: "text-red-700",
    bg: "bg-red-50 border-red-200",
    chart: "#f87171",
  },
  Withdrawn: {
    dot: "bg-slate-500",
    label: "Dibatalkan",
    text: "text-slate-700",
    bg: "bg-slate-100 border-slate-200",
    chart: "#94a3b8",
  },
};

export const actionMeta: Record<
  NextAction,
  { label: string; text: string; bg: string }
> = {
  "Follow up": {
    label: "Tindak Lanjut",
    text: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  Waiting: {
    label: "Menunggu",
    text: "text-slate-700",
    bg: "bg-slate-100 border-slate-200",
  },
  "Prepare Interview": {
    label: "Persiapan Wawancara",
    text: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  "Send email": {
    label: "Kirim Email",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  Decide: {
    label: "Ambil Keputusan",
    text: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
  },
};