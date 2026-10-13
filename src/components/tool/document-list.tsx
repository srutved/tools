"use client";

import { Copy, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DocumentListItem {
  id: string;
  title: string;
  /** Second line, e.g. amount and date. */
  details: string;
  updatedAt: number;
}

interface DocumentListProps {
  items: DocumentListItem[];
  activeId: string | null;
  /** Singular noun for labels and the empty state, e.g. "invoice". */
  noun: string;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

/** A tool's saved documents ("My invoices", "My resumes"), newest first. */
export function DocumentList({ items, activeId, noun, onOpen, onDuplicate, onDelete }: DocumentListProps) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-muted">No saved {noun}s yet.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {items.map(({ id, title, details, updatedAt }) => {
        const active = id === activeId;
        return (
          <li key={id} className="flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => onOpen(id)}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-3 rounded-md p-2 text-left hover:bg-subtle",
                active && "bg-brand-soft",
              )}
            >
              <FileText className="size-5 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{title}</span>
                <span className="block text-xs text-muted">
                  {details} · edited {new Date(updatedAt).toLocaleDateString()}
                  {active && " · open now"}
                </span>
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDuplicate(id)}
              aria-label={`Duplicate ${noun} ${title}`}
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              aria-label={`Delete ${noun} ${title}`}
            >
              <Trash2 className="text-danger" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
