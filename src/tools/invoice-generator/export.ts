"use client";

import { createElement } from "react";
import { toFileName } from "@/lib/browser";
import { generateQrDataUrl } from "@/lib/qr";
import { computeInvoice } from "./lib/calculations";
import type { Invoice } from "./schema";
import { InvoiceDocument } from "./templates/invoice-document";

/** Renders an invoice to a PDF Blob. The PDF engine and fonts load only when this runs. */
export async function renderInvoicePdf(invoice: Invoice): Promise<{ blob: Blob; fileName: string }> {
  const computed = computeInvoice(invoice);
  const [{ PdfPage, renderPdf }, qrCode] = await Promise.all([
    import("@/lib/document/pdf"),
    computed.upiUri ? generateQrDataUrl(computed.upiUri) : Promise.resolve(null),
  ]);

  const blob = await renderPdf({
    title: `Invoice ${invoice.number}`,
    author: invoice.from.name,
    children: createElement(InvoiceDocument, { invoice, computed, qrCode, Page: PdfPage }),
  });

  return { blob, fileName: `${toFileName(`Invoice-${invoice.number}`, "Invoice")}.pdf` };
}
