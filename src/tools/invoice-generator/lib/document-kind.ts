/**
 * The invoice engine produces two kinds of document: invoices and quotations. They share the data,
 * calculations and templates; only the wording - and, for quotations, the payment details - differ.
 * Every kind-specific word lives here, so templates and the editor never hard-code "Invoice".
 */

export const DOCUMENT_KINDS = ["invoice", "quote"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export interface KindLabels {
  /** Lower-case noun for messages, e.g. "invoice". */
  noun: string;
  /** Printed title; GST invoices must be titled "Tax Invoice". */
  title: string;
  gstTitle: string;
  numberLabel: string;
  dateLabel: string;
  /** The second date: due date for invoices, validity for quotations. */
  dueLabel: string;
  /** Short form beside the total, e.g. "Due 15 Oct 2026". */
  dueShort: string;
  /** Heading above the client's details. */
  clientHeading: string;
  /** Label above the big total in Bold and Minimal layouts. */
  totalHeading: string;
  /** Editor wording. */
  detailsSection: string;
  numberField: string;
  dateField: string;
  dueField: string;
  numberPlaceholder: string;
  /** Start of the PDF file name. */
  fileName: string;
  /** Payment details and the UPI QR code are printed on invoices only. */
  showsPayment: boolean;
}

export const KIND_LABELS: Record<DocumentKind, KindLabels> = {
  invoice: {
    noun: "invoice",
    title: "Invoice",
    gstTitle: "Tax Invoice",
    numberLabel: "Invoice No.",
    dateLabel: "Invoice Date",
    dueLabel: "Due Date",
    dueShort: "Due",
    clientHeading: "Bill to",
    totalHeading: "Amount due",
    detailsSection: "Invoice details",
    numberField: "Invoice number",
    dateField: "Invoice date",
    dueField: "Due date",
    numberPlaceholder: "e.g. INV-0001",
    fileName: "Invoice",
    showsPayment: true,
  },
  quote: {
    noun: "quotation",
    title: "Quotation",
    gstTitle: "Quotation",
    numberLabel: "Quote No.",
    dateLabel: "Quote Date",
    dueLabel: "Valid Until",
    dueShort: "Valid until",
    clientHeading: "Quotation for",
    totalHeading: "Quoted total",
    detailsSection: "Quotation details",
    numberField: "Quotation number",
    dateField: "Quotation date",
    dueField: "Valid until",
    numberPlaceholder: "e.g. QT-0001",
    fileName: "Quotation",
    showsPayment: false,
  },
};

export const kindLabels = (kind: DocumentKind | undefined) => KIND_LABELS[kind ?? "invoice"];
