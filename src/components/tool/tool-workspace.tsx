"use client";

import { Eye, PencilLine } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type WorkspaceTab = "edit" | "preview";

interface ToolWorkspaceProps {
  /** Actions shown above the editor (desktop) and in a bar pinned to the bottom (mobile). */
  toolbar: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
  /** Shown above the editor and preview, whichever mobile tab is open (e.g. "PDF ready"). */
  notice?: ReactNode;
  /** Optionally control the mobile tab, e.g. to jump back to the editor when validation fails. */
  tab?: WorkspaceTab;
  onTabChange?: (tab: WorkspaceTab) => void;
}

/**
 * The shared editor + live preview layout used by every document tool.
 * Desktop: editor on the left, preview pinned on the right. Mobile: Edit / Preview tabs.
 */
export function ToolWorkspace({ toolbar, editor, preview, notice, tab, onTabChange }: ToolWorkspaceProps) {
  const [internalTab, setInternalTab] = useState<WorkspaceTab>("edit");
  const mobileTab = tab ?? internalTab;
  const setMobileTab = onTabChange ?? setInternalTab;

  return (
    <div className="bg-subtle/60">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-10">
        <div className="mb-4 hidden flex-wrap items-center justify-end gap-2 lg:flex">{toolbar}</div>

        <div
          role="tablist"
          aria-label="Editor view"
          className="mb-4 grid grid-cols-2 rounded-lg bg-white p-1 shadow-xs lg:hidden"
        >
          {(
            [
              { id: "edit", label: "Edit", icon: PencilLine },
              { id: "preview", label: "Preview", icon: Eye },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={mobileTab === tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold",
                mobileTab === tab.id ? "bg-brand text-white" : "text-muted",
              )}
            >
              <tab.icon className="size-4" aria-hidden />
              {tab.label}
            </button>
          ))}
        </div>

        {notice && <div className="mb-4">{notice}</div>}

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className={cn("space-y-4", mobileTab !== "edit" && "hidden lg:block")}>{editor}</div>
          <div className={cn("lg:sticky lg:top-20", mobileTab !== "preview" && "hidden lg:block")}>
            {preview}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 overflow-x-auto border-t border-border bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
        {toolbar}
      </div>
    </div>
  );
}
