"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { prepareContract } from "./lib/clauses";
import type { Contract } from "./schema";
import { ContractDocument } from "./templates/contract-document";

/** Renders a contract to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderContractPdf(contract: Contract): Promise<{ blob: Blob; fileName: string }> {
  const prepared = prepareContract(contract);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");

  const blob = await renderPdf({
    title: [prepared.title, prepared.subtitle].filter(Boolean).join(" - "),
    author: contract.you.name,
    children: createElement(ContractDocument, {
      templateId: contract.templateId,
      contract: prepared,
      Page: PdfPage,
    }),
  });

  const name = [prepared.title, contract.other.name].filter(Boolean).join(" ");
  return { blob, fileName: `${toFileName(name, "Contract")}.pdf` };
}
