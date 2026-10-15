/**
 * The invoice engine produces eight kinds of document: invoices, quotations, proforma invoices,
 * payment receipts, credit and debit notes, delivery challans and purchase orders. They share the
 * data, calculations and templates; the wording, which dates and details apply, and whether payment
 * details are printed differ. Every kind-specific word lives here, so templates and the editor never
 * hard-code "Invoice".
 */

export const DOCUMENT_KINDS = [
  "invoice",
  "quote",
  "proforma",
  "receipt",
  "credit-note",
  "debit-note",
  "challan",
  "purchase-order",
] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

/** Kind-specific details beyond the common fields, and what they're called on this kind. */
export interface KindExtras {
  /** Section title in the editor. */
  title: string;
  /** Another document this one refers to, e.g. the original invoice of a credit note. */
  refNumber?: { label: string; field: string; placeholder: string; required?: boolean };
  refDate?: { label: string; field: string };
  /** Why the document was issued, e.g. goods returned, or the purpose of a delivery. */
  reason?: { label: string; placeholder: string; suggestions: string[]; required?: boolean };
  /** Payment mode and transaction reference (receipts). */
  payment?: boolean;
  /** Vehicle number and transporter (delivery challans). */
  transport?: boolean;
  /** A delivery address different from the other party's address. */
  shipTo?: { label: string; placeholder: string };
}

export interface KindLabels {
  /** Lower-case noun for messages, e.g. "invoice". */
  noun: string;
  /** Printed title; GST invoices must be titled "Tax Invoice". */
  title: string;
  gstTitle: string;
  numberLabel: string;
  dateLabel: string;
  /** The second date: due date for invoices, validity for quotations. Blank when the kind has none. */
  dueLabel: string;
  /** Short form beside the total, e.g. "Due 15 Oct 2026". */
  dueShort: string;
  /** Heading above the other party's details. */
  clientHeading: string;
  /** What the other party is called in messages, e.g. "client" or "vendor". */
  partyNoun: string;
  /** Label above the big total in Bold and Minimal layouts. */
  totalHeading: string;
  /** Editor wording. */
  detailsSection: string;
  numberField: string;
  dateField: string;
  /** Blank when the kind has no second date. */
  dueField: string;
  numberPlaceholder: string;
  /** Start of the PDF file name. */
  fileName: string;
  /** Payment details and the UPI QR code are printed on invoices and proforma invoices only. */
  showsPayment: boolean;
  /** The tool that makes this kind of document. */
  toolSlug: string;
  extras?: KindExtras;
}

const REFERENCE_INVOICE = {
  refNumber: {
    label: "Against Invoice",
    field: "Original invoice number",
    placeholder: "e.g. INV-0042",
    required: true,
  },
  refDate: { label: "Invoice Date", field: "Original invoice date" },
};

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
    partyNoun: "client",
    totalHeading: "Amount due",
    detailsSection: "Invoice details",
    numberField: "Invoice number",
    dateField: "Invoice date",
    dueField: "Due date",
    numberPlaceholder: "e.g. INV-0001",
    fileName: "Invoice",
    showsPayment: true,
    toolSlug: "invoice-generator",
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
    partyNoun: "client",
    totalHeading: "Quoted total",
    detailsSection: "Quotation details",
    numberField: "Quotation number",
    dateField: "Quotation date",
    dueField: "Valid until",
    numberPlaceholder: "e.g. QT-0001",
    fileName: "Quotation",
    showsPayment: false,
    toolSlug: "quotation-generator",
  },
  proforma: {
    noun: "proforma invoice",
    title: "Proforma Invoice",
    gstTitle: "Proforma Invoice",
    numberLabel: "Proforma No.",
    dateLabel: "Date",
    dueLabel: "Valid Until",
    dueShort: "Valid until",
    clientHeading: "Bill to",
    partyNoun: "client",
    totalHeading: "Amount payable",
    detailsSection: "Proforma invoice details",
    numberField: "Proforma number",
    dateField: "Date",
    dueField: "Valid until",
    numberPlaceholder: "e.g. PI-0001",
    fileName: "Proforma-Invoice",
    showsPayment: true,
    toolSlug: "proforma-invoice-generator",
  },
  receipt: {
    noun: "receipt",
    title: "Payment Receipt",
    gstTitle: "Payment Receipt",
    numberLabel: "Receipt No.",
    dateLabel: "Payment Date",
    dueLabel: "",
    dueShort: "",
    clientHeading: "Received from",
    partyNoun: "payer",
    totalHeading: "Amount received",
    detailsSection: "Receipt details",
    numberField: "Receipt number",
    dateField: "Payment date",
    dueField: "",
    numberPlaceholder: "e.g. RCT-0001",
    fileName: "Receipt",
    showsPayment: false,
    toolSlug: "receipt-generator",
    extras: {
      title: "Payment",
      payment: true,
      refNumber: { label: "Against Invoice", field: "Invoice paid (optional)", placeholder: "e.g. INV-0042" },
    },
  },
  "credit-note": {
    noun: "credit note",
    title: "Credit Note",
    gstTitle: "Credit Note",
    numberLabel: "Credit Note No.",
    dateLabel: "Date",
    dueLabel: "",
    dueShort: "",
    clientHeading: "Issued to",
    partyNoun: "client",
    totalHeading: "Credit amount",
    detailsSection: "Credit note details",
    numberField: "Credit note number",
    dateField: "Date",
    dueField: "",
    numberPlaceholder: "e.g. CN-0001",
    fileName: "Credit-Note",
    showsPayment: false,
    toolSlug: "credit-note-generator",
    extras: {
      title: "Original invoice",
      ...REFERENCE_INVOICE,
      reason: {
        label: "Reason",
        placeholder: "e.g. Goods returned",
        suggestions: [
          "Goods returned",
          "Excess amount charged",
          "Post-sale discount",
          "Deficiency in services",
          "Wrong GST rate charged",
        ],
        required: true,
      },
    },
  },
  "debit-note": {
    noun: "debit note",
    title: "Debit Note",
    gstTitle: "Debit Note",
    numberLabel: "Debit Note No.",
    dateLabel: "Date",
    dueLabel: "",
    dueShort: "",
    clientHeading: "Issued to",
    partyNoun: "client",
    totalHeading: "Debit amount",
    detailsSection: "Debit note details",
    numberField: "Debit note number",
    dateField: "Date",
    dueField: "",
    numberPlaceholder: "e.g. DN-0001",
    fileName: "Debit-Note",
    showsPayment: false,
    toolSlug: "debit-note-generator",
    extras: {
      title: "Original invoice",
      ...REFERENCE_INVOICE,
      reason: {
        label: "Reason",
        placeholder: "e.g. Price revised upwards",
        suggestions: [
          "Price revised upwards",
          "Quantity short-billed",
          "Additional freight charges",
          "Wrong GST rate charged",
        ],
        required: true,
      },
    },
  },
  challan: {
    noun: "delivery challan",
    title: "Delivery Challan",
    gstTitle: "Delivery Challan",
    numberLabel: "Challan No.",
    dateLabel: "Challan Date",
    dueLabel: "",
    dueShort: "",
    clientHeading: "Consignee",
    partyNoun: "consignee",
    totalHeading: "Total value",
    detailsSection: "Challan details",
    numberField: "Challan number",
    dateField: "Challan date",
    dueField: "",
    numberPlaceholder: "e.g. DC-0001",
    fileName: "Delivery-Challan",
    showsPayment: false,
    toolSlug: "delivery-challan-generator",
    extras: {
      title: "Transport",
      transport: true,
      reason: {
        label: "Purpose",
        placeholder: "e.g. Supply on approval",
        suggestions: [
          "Supply on approval",
          "Job work",
          "Branch transfer",
          "Exhibition or display",
          "Sales return",
          "Supply of goods (invoice to follow)",
        ],
      },
      shipTo: { label: "Deliver to", placeholder: "e.g. Godown 3, Plot 17, MIDC Bhosari, Pune 411026" },
    },
  },
  "purchase-order": {
    noun: "purchase order",
    title: "Purchase Order",
    gstTitle: "Purchase Order",
    numberLabel: "PO No.",
    dateLabel: "PO Date",
    dueLabel: "Deliver By",
    dueShort: "Deliver by",
    clientHeading: "Vendor",
    partyNoun: "vendor",
    totalHeading: "Order total",
    detailsSection: "Order details",
    numberField: "PO number",
    dateField: "PO date",
    dueField: "Delivery date",
    numberPlaceholder: "e.g. PO-0001",
    fileName: "Purchase-Order",
    showsPayment: false,
    toolSlug: "purchase-order-generator",
    extras: {
      title: "Delivery",
      refNumber: { label: "Quote Ref.", field: "Vendor's quotation (optional)", placeholder: "e.g. QT-1187" },
      shipTo: { label: "Ship to", placeholder: "e.g. Warehouse 2, Survey No. 41, Chakan, Pune 410501" },
    },
  },
};

export const kindLabels = (kind: DocumentKind | undefined) => KIND_LABELS[kind ?? "invoice"];

export const PAYMENT_METHODS = ["Bank transfer", "UPI", "Cash", "Cheque", "Card", "Other"];
