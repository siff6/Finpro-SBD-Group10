import type { ApplicationStatus, DashboardFilters, JobApplication } from "./types";
import { statusOptions } from "./types";

export function filterApplications(
  applications: JobApplication[],
  filters: DashboardFilters,
) {
  return applications.filter((application) => {
    const matchesStatus =
      filters.status === "All" || application.status === filters.status;
    const matchesDate = isInsideRange(application.applicationDate, filters.dateRange);

    return matchesStatus && matchesDate;
  });
}

export function getStatusCounts(applications: JobApplication[]) {
  return statusOptions.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length,
  }));
}

export function getSummaryStats(applications: JobApplication[]) {
  const total = applications.length;
  const accepted = countByStatus(applications, "Accepted");
  const rejected = countByStatus(applications, "Rejected");
  const interviewed = countByStatus(applications, "Interviewed");
  const offers = countByStatus(applications, "Offer");
  const ongoing = applications.filter(
    (application) => !["Accepted", "Rejected"].includes(application.status),
  ).length;

  return {
    total,
    accepted,
    rejected,
    interviewed,
    offers,
    ongoing,
    acceptanceRate: total === 0 ? 0 : Math.round((accepted / total) * 100),
    interviewRate: total === 0 ? 0 : Math.round((interviewed / total) * 100),
  };
}

export function getMonthlyApplications(applications: JobApplication[]) {
  const grouped = new Map<string, number>();

  for (const application of applications) {
    const date = new Date(`${application.applicationDate}T00:00:00`);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  }

  return Array.from(grouped.entries()).map(([date, applicationsCount]) => ({
    date,
    applications: applicationsCount,
  }));
}

function countByStatus(applications: JobApplication[], status: ApplicationStatus) {
  return applications.filter((application) => application.status === status).length;
}

function isInsideRange(applicationDate: string, range: DashboardFilters["dateRange"]) {
  if (range === "All time") {
    return true;
  }

  const days = range === "Last 7 days" ? 7 : 30;
  const now = new Date("2026-05-14T00:00:00");
  const date = new Date(`${applicationDate}T00:00:00`);
  const diff = now.getTime() - date.getTime();

  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}
