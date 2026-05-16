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
    <tr className="group text-sm text-slate-700 transition hover:bg-slate-50">
      <td className="w-48 border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Perusahaan"
          value={application.company}
          onChange={(company) => onChange(application.id, { company })}
        />
      </td>

      <td className="w-52 border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Posisi"
          value={application.position}
          onChange={(position) => onChange(application.id, { position })}
        />
      </td>

      <td className="w-44 border-b border-slate-100 px-3 py-2">
        <SelectDropdown
          value={application.status}
          onChange={(status) => onChange(application.id, { status })}
        />
      </td>

      <td className="w-44 border-b border-slate-100 px-3 py-2">
        <DatePickerCell
          value={application.applicationDate}
          onChange={(applicationDate) =>
            onChange(application.id, { applicationDate })
          }
        />
      </td>

      <td className="w-36 border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Gaji"
          type="number"
          value={application.salary}
          onChange={(salary) =>
            onChange(application.id, { salary: Number(salary) })
          }
        />
      </td>

      <td className="min-w-64 border-b border-slate-100 px-3 py-2">
        <MultiSelectDropdown
          value={application.nextAction}
          onChange={(nextAction) => onChange(application.id, { nextAction })}
        />
      </td>

      <td className="w-56 border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Website"
          type="url"
          value={application.website}
          onChange={(website) => onChange(application.id, { website })}
        />
      </td>

      <td className="w-56 border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Kontak"
          type="email"
          value={application.contact}
          onChange={(contact) => onChange(application.id, { contact })}
        />
      </td>

      <td className="w-14 border-b border-slate-100 px-3 py-2">
        <button
          type="button"
          aria-label={`Hapus lamaran ${application.company}`}
          onClick={() => onDelete(application.id)}
          className="grid size-9 place-items-center rounded-md text-slate-400 opacity-70 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}