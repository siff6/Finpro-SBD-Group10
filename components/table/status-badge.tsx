import type { ApplicationStatus } from "@/lib/applications/types";
import { statusMeta } from "@/lib/applications/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = statusMeta[status];

  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-xs font-medium ${meta.bg} ${meta.text}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
