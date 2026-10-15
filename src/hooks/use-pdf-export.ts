"use client";

import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { trackToolEvent } from "@/lib/analytics";
import { downloadBlob } from "@/lib/browser";

export type ExportMode = "download" | "print";

interface UsePdfExportOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  /** Renders the validated document. Should import the PDF engine lazily. */
  render: (data: T) => Promise<{ blob: Blob; fileName: string }>;
  setAlert: (message: string | null) => void;
  /** Runs before exporting, e.g. to save the document first. */
  onBeforeExport?: () => void;
  /** Runs when validation fails, before focusing the first invalid field (e.g. show the editor tab). */
  onInvalid?: () => void;
  /** Runs after a successful download or print, e.g. to suggest a next step. */
  onExported?: (mode: ExportMode) => void;
}

/** Moves focus to the first invalid field, opening any collapsed section it is in. */
export function focusFirstInvalidField() {
  const field = document.querySelector<HTMLElement>("[aria-invalid='true']");
  field?.closest("details")?.setAttribute("open", "");
  field?.focus();
}

/**
 * Validates the form, then downloads the PDF or opens it in a new tab to print.
 * Shared by every document tool.
 */
export function usePdfExport<T extends FieldValues>({
  form,
  render,
  setAlert,
  onBeforeExport,
  onInvalid,
  onExported,
}: UsePdfExportOptions<T>) {
  const [busy, setBusy] = useState<ExportMode | null>(null);

  const handleInvalid = () => {
    onInvalid?.();
    setAlert("Please fix the highlighted fields before downloading.");
    // Wait for a hidden editor (the mobile Preview tab) to show before focusing.
    setTimeout(focusFirstInvalidField, 50);
  };

  const exportPdf = (mode: ExportMode) =>
    form.handleSubmit(async (data) => {
      setAlert(null);
      onBeforeExport?.();
      // Open the tab synchronously, inside the click, so pop-up blockers allow it.
      const printWindow = mode === "print" ? window.open("", "_blank") : null;
      setBusy(mode);
      try {
        const { blob, fileName } = await render(data);
        if (printWindow) printWindow.location.href = URL.createObjectURL(blob);
        else downloadBlob(blob, fileName);
        const templateId = (data as { templateId?: unknown }).templateId;
        trackToolEvent(mode === "print" ? "PDF Printed" : "PDF Downloaded", {
          template: typeof templateId === "string" ? templateId : "",
        });
        onExported?.(mode);
      } catch (error) {
        console.error("PDF export failed", error);
        printWindow?.close();
        setAlert("Sorry, the PDF could not be created. Please try again.");
      } finally {
        setBusy(null);
      }
    }, handleInvalid)();

  return { busy, exportPdf };
}
