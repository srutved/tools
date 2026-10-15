"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { prepareRentReceipts } from "./lib/receipts";
import type { RentReceipt } from "./schema";
import { ReceiptDocument } from "./templates/receipt-document";

/** Renders the rent receipts to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderRentReceiptPdf(data: RentReceipt): Promise<{ blob: Blob; fileName: string }> {
  const prepared = prepareRentReceipts(data);
  const { PdfPage, renderPdf } = await import("@/lib/document/pdf");
  const blob = await renderPdf({
    title: `Rent receipts - ${prepared.tenantName}`,
    author: prepared.landlordName,
    children: createElement(ReceiptDocument, { templateId: data.templateId, data: prepared, Page: PdfPage }),
  });
  const name = `Rent Receipts ${prepared.tenantName} ${data.from} to ${data.to}`;
  return { blob, fileName: `${toFileName(name, "Rent-Receipts")}.pdf` };
}
