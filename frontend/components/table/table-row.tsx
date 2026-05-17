"use client";

import { Trash2 } from "lucide-react";
import type { JobApplication, JobType } from "@/lib/applications/types";
import { jobTypeOptions } from "@/lib/applications/types";
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
      <td className="border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Perusahaan"
          value={application.company}
          onChange={(company) => onChange(application.id, { company })}
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Posisi"
          value={application.position}
          onChange={(position) => onChange(application.id, { position })}
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <SelectDropdown
          value={application.status}
          onChange={(status) => onChange(application.id, { status })}
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <DatePickerCell
          value={application.applicationDate}
          onChange={(applicationDate) =>
            onChange(application.id, { applicationDate })
          }
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Gaji"
          type="number"
          value={application.salary}
          onChange={(salary) =>
            onChange(application.id, { salary: Number(salary) })
          }
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <MultiSelectDropdown
          value={application.nextAction}
          onChange={(nextAction) => onChange(application.id, { nextAction })}
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <EditableCell
          label="Sumber"
          value={application.source}
          onChange={(source) => onChange(application.id, { source })}
        />
      </td>

      <td className="border-b border-slate-100 px-3 py-2">
        <select
          aria-label="Jenis kerja"
          value={application.jobType}
          onChange={(event) =>
            onChange(application.id, {
              jobType: event.target.value as JobType,
            })
          }
          className="h-10 w-full min-w-0 truncate rounded-md border border-transparent bg-transparent px-2 text-sm text-slate-700 outline-none transition [color-scheme:light] hover:bg-slate-100 focus:border-blue-400 focus:bg-white focus:text-slate-950"
        >
          {jobTypeOptions.map((jobType) => (
            <option key={jobType} value={jobType}>
              {jobType}
            </option>
          ))}
        </select>
      </td>

      <td className="border-b border-slate-100 px-2 py-2">
        <div className="flex justify-center">
          <button
            type="button"
            aria-label={`Hapus lamaran ${application.company}`}
            onClick={() => onDelete(application.id)}
            className="grid size-9 place-items-center rounded-md text-slate-400 opacity-70 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}