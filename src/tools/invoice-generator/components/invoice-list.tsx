"use client";

import { Copy, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { computeInvoice } from "../lib/calculations";
import type { SavedInvoice } from "../store";

interface InvoiceListProps {
  invoices: SavedInvoice[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

/** "My invoices": everything saved on this device, newest first. */
export function InvoiceList({ invoices, activeId, onOpen, onDuplicate, onDelete }: InvoiceListProps) {
  if (invoices.length === 0) {
    return <p className="py-8 text-center text-muted">No saved invoices yet.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {invoices.map(({ id, invoice, updatedAt }) => {
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
                <span className="block truncate font-semibold">
                  {invoice.number || "Untitled"} · {invoice.to.name || "No client yet"}
                </span>
                <span className="block text-xs text-muted">
                  {formatMoney(computeInvoice(invoice).totals.total, invoice.currency)} ·{" "}
                  {invoice.issueDate ? formatDate(invoice.issueDate) : "No date"} · edited{" "}
                  {new Date(updatedAt).toLocaleDateString()}
                  {active && " · open now"}
                </span>
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDuplicate(id)}
              aria-label={`Duplicate invoice ${invoice.number}`}
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              aria-label={`Delete invoice ${invoice.number}`}
            >
              <Trash2 className="text-danger" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
