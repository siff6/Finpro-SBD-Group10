"use client";

import { Trash2 } from "lucide-react";
import type { JobApplication } from "@/lib/applications/types";
import { DatePickerCell } from "./date-picker-cell";
import { EditableCell } from "./editable-cell";
import { MultiSelectDropdown } from "./multi-select-dropdown";
import { SelectDropdown } from "./select-dropdown";

type TableRowProps = {
  application: JobApplication;
  onChange: (id: string, patch: Partial<JobApplication>) => void;
  onDelete: (id: string) => void;
};

export function TableRow({ application, onChange, onDelete }: TableRowProps) {
  return (
    <tr className="group text-sm text-zinc-200 transition hover:bg-white/[0.035]">
      <td className="w-48 border-b border-white/8 px-3 py-2">
        <EditableCell
          label="Company"
          value={application.company}
          onChange={(company) => onChange(application.id, { company })}
        />
      </td>
      <td className="w-52 border-b border-white/8 px-3 py-2">
        <EditableCell
          label="Position"
          value={application.position}
          onChange={(position) => onChange(application.id, { position })}
        />
      </td>
      <td className="w-44 border-b border-white/8 px-3 py-2">
        <SelectDropdown
          value={application.status}
          onChange={(status) => onChange(application.id, { status })}
        />
      </td>
      <td className="w-44 border-b border-white/8 px-3 py-2">
        <DatePickerCell
          value={application.applicationDate}
          onChange={(applicationDate) => onChange(application.id, { applicationDate })}
        />
      </td>
      <td className="w-36 border-b border-white/8 px-3 py-2">
        <EditableCell
          label="Salary"
          type="number"
          value={application.salary}
          onChange={(salary) => onChange(application.id, { salary: Number(salary) })}
        />
      </td>
      <td className="min-w-64 border-b border-white/8 px-3 py-2">
        <MultiSelectDropdown
          value={application.nextAction}
          onChange={(nextAction) => onChange(application.id, { nextAction })}
        />
      </td>
      <td className="w-56 border-b border-white/8 px-3 py-2">
        <EditableCell
          label="Website"
          type="url"
          value={application.website}
          onChange={(website) => onChange(application.id, { website })}
        />
      </td>
      <td className="w-56 border-b border-white/8 px-3 py-2">
        <EditableCell
          label="Contact"
          type="email"
          value={application.contact}
          onChange={(contact) => onChange(application.id, { contact })}
        />
      </td>
      <td className="w-14 border-b border-white/8 px-3 py-2">
        <button
          type="button"
          aria-label={`Delete ${application.company}`}
          onClick={() => onDelete(application.id)}
          className="grid size-9 place-items-center rounded-md text-zinc-500 opacity-70 transition hover:bg-red-400/10 hover:text-red-200 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
