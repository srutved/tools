"use client";

import { Download, FilePlus2, FolderOpen, LoaderCircle, Palette, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExportMode } from "@/hooks/use-pdf-export";

interface DocumentToolbarProps {
  templateName: string;
  onTemplates: () => void;
  /** e.g. "My invoices". */
  libraryLabel: string;
  libraryCount: number;
  onLibrary: () => void;
  /** e.g. "New invoice". */
  newLabel: string;
  onNew: () => void;
  busy: ExportMode | null;
  onExport: (mode: ExportMode) => void;
}

// On phones and small tablets the secondary actions are icon-only (labels stay available to screen readers),
// so every action - including Download PDF - fits in the bottom bar without scrolling.
const label = "sr-only md:not-sr-only";
const iconOnMobile = "max-md:px-3";

/** The actions above every document editor: template, saved documents, new, print and download. */
export function DocumentToolbar({
  templateName,
  onTemplates,
  libraryLabel,
  libraryCount,
  onLibrary,
  newLabel,
  onNew,
  busy,
  onExport,
}: DocumentToolbarProps) {
  return (
    <>
      <Button variant="outline" className={iconOnMobile} onClick={onTemplates} title="Choose template">
        <Palette />
        <span className={label}>
          <span className="hidden lg:inline">Template: </span>
          {templateName}
        </span>
      </Button>
      <Button variant="outline" className={iconOnMobile} onClick={onLibrary} title={libraryLabel}>
        <FolderOpen />
        <span className={label}>{libraryLabel}</span>
        <span aria-hidden className="text-muted">
          {libraryCount}
        </span>
      </Button>
      <Button variant="outline" className={iconOnMobile} onClick={onNew} title={newLabel}>
        <FilePlus2 />
        <span className={label}>New</span>
      </Button>
      <Button
        variant="outline"
        className={iconOnMobile}
        onClick={() => onExport("print")}
        disabled={busy !== null}
        title="Print"
      >
        {busy === "print" ? <LoaderCircle className="animate-spin" /> : <Printer />}
        <span className={label}>Print</span>
      </Button>
      <Button className="max-md:flex-1" onClick={() => onExport("download")} disabled={busy !== null}>
        {busy === "download" ? <LoaderCircle className="animate-spin" /> : <Download />} Download
        <span className="-ml-1 hidden sm:inline">PDF</span>
      </Button>
    </>
  );
}
