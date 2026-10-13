import type { DocumentTheme } from "@/lib/document/theme";
import type { ComputedInvoice } from "../lib/calculations";
import type { Invoice } from "../schema";

export type LayoutId = "classic" | "modern" | "minimal" | "sidebar" | "bold";

export interface TemplateTheme extends DocumentTheme {
  table: "striped" | "lined" | "boxed";
}

/** A template is a layout plus a theme, so new looks rarely need new layout code. */
export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  layout: LayoutId;
  theme: TemplateTheme;
}

/** Props every layout receives. */
export interface LayoutProps {
  invoice: Invoice;
  computed: ComputedInvoice;
  /** UPI QR code as a PNG data URL, when the invoice has one. */
  qrCode: string | null;
  theme: TemplateTheme;
}
