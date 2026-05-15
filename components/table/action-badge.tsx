import { X } from "lucide-react";
import type { NextAction } from "@/lib/applications/types";
import { actionMeta } from "@/lib/applications/types";

export function ActionBadge({
  action,
  onRemove,
}: {
  action: NextAction;
  onRemove?: () => void;
}) {
  const meta = actionMeta[action];

  return (
    <span
      className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium ${meta.bg} ${meta.text}`}
    >
      {action}
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${action}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="grid size-4 place-items-center rounded hover:bg-white/10"
        >
          <X size={12} />
        </button>
      ) : null}
    </span>
  );
}
