"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import type { ApplicationStatus } from "@/lib/applications/types";
import { statusOptions } from "@/lib/applications/types";
import { StatusBadge } from "./status-badge";

type SelectDropdownProps = {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const DROPDOWN_OPEN_EVENT = "applytics:table-dropdown-open";
const DROPDOWN_WIDTH = 300;
const DROPDOWN_HEIGHT = 340;
const DROPDOWN_GAP = 8;
const VIEWPORT_PADDING = 12;

export function SelectDropdown({ value, onChange }: SelectDropdownProps) {
  const dropdownId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: DROPDOWN_WIDTH,
  });

  const filteredOptions = useMemo(
    () =>
      statusOptions.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery("");
  };

  const updatePosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const nextWidth = Math.max(DROPDOWN_WIDTH, rect.width);
    const maxLeft = viewportWidth - nextWidth - VIEWPORT_PADDING;

    const left = Math.min(
      Math.max(rect.left, VIEWPORT_PADDING),
      Math.max(maxLeft, VIEWPORT_PADDING),
    );

    const hasEnoughSpaceBelow =
      rect.bottom + DROPDOWN_GAP + DROPDOWN_HEIGHT <= viewportHeight;

    const top = hasEnoughSpaceBelow
      ? rect.bottom + DROPDOWN_GAP
      : Math.max(
          VIEWPORT_PADDING,
          rect.top - DROPDOWN_GAP - DROPDOWN_HEIGHT,
        );

    setPosition({
      top,
      left,
      width: nextWidth,
    });
  };

  const openDropdown = () => {
    updatePosition();

    window.dispatchEvent(
      new CustomEvent(DROPDOWN_OPEN_EVENT, {
        detail: {
          id: dropdownId,
        },
      }),
    );

    setIsOpen(true);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (buttonRef.current?.contains(target)) {
        return;
      }

      if (menuRef.current?.contains(target)) {
        return;
      }

      closeDropdown();
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleOtherDropdownOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;

      if (customEvent.detail?.id !== dropdownId) {
        closeDropdown();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener(DROPDOWN_OPEN_EVENT, handleOtherDropdownOpen);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener(DROPDOWN_OPEN_EVENT, handleOtherDropdownOpen);
    };
  }, [dropdownId, isOpen]);

  const dropdownStyle: CSSProperties = {
    top: position.top,
    left: position.left,
    width: position.width,
  };

  const dropdownMenu =
    isMounted && isOpen
      ? createPortal(
          <div
            ref={menuRef}
            style={dropdownStyle}
            className="fixed z-[9999] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-300/70"
          >
            <label className="mb-2 flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-blue-400 focus-within:bg-white">
              <Search size={15} />
              <input
                aria-label="Cari status"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeDropdown();
                  }
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Cari status"
              />
            </label>

            <div
              role="listbox"
              className="grid max-h-64 gap-1 overflow-y-auto pr-1"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={option === value}
                    onClick={() => {
                      onChange(option);
                      closeDropdown();
                    }}
                    className="flex items-center rounded-lg px-2 py-2 text-left transition hover:bg-slate-100"
                  >
                    <StatusBadge status={option} />
                  </button>
                ))
              ) : (
                <div className="rounded-lg px-2 py-2 text-sm text-slate-500">
                  Status tidak ditemukan.
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeDropdown();
          }
        }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md px-2 transition hover:bg-slate-100"
      >
        <StatusBadge status={value} />
        <ChevronDown size={15} className="text-slate-400" />
      </button>

      {dropdownMenu}
    </>
  );
}