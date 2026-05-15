export type ApplicationStatus =
  | "Applied"
  | "Rejected"
  | "Interviewed"
  | "Accepted"
  | "Offer";

export type NextAction =
  | "Follow up"
  | "Waiting"
  | "Prepare Interview"
  | "Send email"
  | "Decide";

export type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  applicationDate: string;
  salary: number;
  nextAction: NextAction[];
  website: string;
  contact: string;
};

export type DashboardFilters = {
  status: "All" | ApplicationStatus;
  analytics: "Overview" | "Interviews" | "Offers";
  dateRange: "All time" | "Last 7 days" | "Last 30 days";
};

export const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Rejected",
  "Interviewed",
  "Accepted",
  "Offer",
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
    dot: "bg-blue-300",
    label: "Applied",
    text: "text-blue-100",
    bg: "bg-blue-400/12 border-blue-300/20",
    chart: "#60a5fa",
  },
  Rejected: {
    dot: "bg-red-300",
    label: "Rejected",
    text: "text-red-100",
    bg: "bg-red-400/12 border-red-300/20",
    chart: "#f87171",
  },
  Interviewed: {
    dot: "bg-yellow-300",
    label: "Interviewed",
    text: "text-yellow-100",
    bg: "bg-yellow-400/12 border-yellow-300/20",
    chart: "#facc15",
  },
  Accepted: {
    dot: "bg-green-300",
    label: "Accepted",
    text: "text-green-100",
    bg: "bg-green-400/12 border-green-300/20",
    chart: "#4ade80",
  },
  Offer: {
    dot: "bg-purple-300",
    label: "Offer",
    text: "text-purple-100",
    bg: "bg-purple-400/12 border-purple-300/20",
    chart: "#c084fc",
  },
};

export const actionMeta: Record<NextAction, { text: string; bg: string }> = {
  "Follow up": { text: "text-blue-100", bg: "bg-blue-400/12 border-blue-300/20" },
  Waiting: { text: "text-zinc-100", bg: "bg-zinc-400/12 border-zinc-300/20" },
  "Prepare Interview": {
    text: "text-yellow-100",
    bg: "bg-yellow-400/12 border-yellow-300/20",
  },
  "Send email": { text: "text-green-100", bg: "bg-green-400/12 border-green-300/20" },
  Decide: { text: "text-purple-100", bg: "bg-purple-400/12 border-purple-300/20" },
};
