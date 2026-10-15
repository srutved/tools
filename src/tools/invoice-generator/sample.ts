import type { DocumentKind } from "./lib/document-kind";
import { EMPTY_EXTRA, type Invoice } from "./schema";

/** Realistic example data used for template thumbnails and the templates gallery page. */
export const SAMPLE_INVOICE: Invoice = {
  kind: "invoice",
  templateId: "classic-slate",
  number: "INV-0042",
  issueDate: "2026-10-01",
  dueDate: "2026-10-15",
  currency: "INR",
  taxMode: "gst",
  taxLabel: "Tax",
  placeOfSupply: "27",
  lutNumber: "",
  discount: 0,
  logo: "",
  from: {
    name: "Aarav Design Studio",
    address: "12 MG Road, Indiranagar\nBengaluru, Karnataka 560038",
    taxId: "29ABCDE1234F1Z5",
    email: "hello@aaravdesign.in",
    phone: "+91 98765 43210",
    stateCode: "29",
  },
  to: {
    name: "Northwind Retail Pvt Ltd",
    address: "4th Floor, Lotus Park\nMumbai, Maharashtra 400069",
    taxId: "27PQRSX6789K1Z2",
    email: "accounts@northwind.co",
    phone: "",
    stateCode: "27",
  },
  payment: {
    upiId: "aarav@okbank",
    paymentLink: "",
    bankName: "HDFC Bank",
    accountName: "Aarav Design Studio",
    accountNumber: "50200012345678",
    bankCode: "HDFC0001234",
  },
  items: [
    {
      id: "s1",
      description: "Brand identity design",
      code: "998391",
      quantity: 1,
      unitPrice: 45000,
      taxRate: 18,
    },
    {
      id: "s2",
      description: "Website UI design (8 pages)",
      code: "998314",
      quantity: 8,
      unitPrice: 6500,
      taxRate: 18,
    },
    { id: "s3", description: "Social media kit", code: "998391", quantity: 1, unitPrice: 12000, taxRate: 18 },
  ],
  notes: "Thank you for your business!",
  terms: "Payment due within 14 days.",
  extra: EMPTY_EXTRA,
};

const ORIGINAL_INVOICE = { refNumber: "INV-0042", refDate: "2026-10-01" };

/** The sample as each kind of document, for thumbnails, galleries and tests. */
export function sampleFor(kind: DocumentKind): Invoice {
  const base = SAMPLE_INVOICE;
  switch (kind) {
    case "invoice":
      return base;
    case "quote":
      return {
        ...base,
        kind,
        number: "QT-0042",
        dueDate: "2026-10-31",
        payment: { ...base.payment, upiId: "" },
        notes: "Thank you for the opportunity. We look forward to working with you.",
        terms: "This quotation is valid for 30 days. 50% advance on acceptance, balance on delivery.",
      };
    case "proforma":
      return {
        ...base,
        kind,
        number: "PI-0042",
        dueDate: "2026-10-16",
        notes: "This is a proforma invoice, not a tax invoice. A tax invoice will be issued on delivery.",
        terms: "Valid for 15 days. Work starts once the 50% advance is received.",
      };
    case "receipt":
      return {
        ...base,
        kind,
        number: "RCT-0042",
        issueDate: "2026-10-12",
        dueDate: "",
        taxMode: "none",
        items: [
          {
            id: "r1",
            description: "Payment against invoice INV-0042",
            code: "",
            quantity: 1,
            unitPrice: 128620,
            taxRate: 0,
          },
        ],
        notes: "Thank you for your payment.",
        terms: "",
        extra: {
          ...EMPTY_EXTRA,
          ...ORIGINAL_INVOICE,
          paymentMethod: "UPI",
          paymentReference: "UTR 428913076512",
        },
      };
    case "credit-note":
      return {
        ...base,
        kind,
        number: "CN-0007",
        issueDate: "2026-10-20",
        dueDate: "",
        items: [
          {
            id: "c1",
            description: "Website UI design - 2 pages removed from scope",
            code: "998314",
            quantity: 2,
            unitPrice: 6500,
            taxRate: 18,
          },
        ],
        notes: "This credit note reduces the amount payable against the invoice above.",
        terms: "",
        extra: { ...EMPTY_EXTRA, ...ORIGINAL_INVOICE, reason: "Scope reduced after invoicing" },
      };
    case "debit-note":
      return {
        ...base,
        kind,
        number: "DN-0003",
        issueDate: "2026-10-20",
        dueDate: "",
        items: [
          {
            id: "d1",
            description: "Additional design revisions (3 rounds)",
            code: "998391",
            quantity: 3,
            unitPrice: 3000,
            taxRate: 18,
          },
        ],
        notes: "This debit note increases the amount payable against the invoice above.",
        terms: "",
        extra: { ...EMPTY_EXTRA, ...ORIGINAL_INVOICE, reason: "Additional work agreed after invoicing" },
      };
    case "challan":
      return {
        ...base,
        kind,
        number: "DC-0018",
        issueDate: "2026-10-08",
        dueDate: "",
        items: [
          {
            id: "h1",
            description: "Printed brochures (A4, 8 pages)",
            code: "4911",
            quantity: 500,
            unitPrice: 42,
            taxRate: 18,
          },
          {
            id: "h2",
            description: "Roll-up standee (6 x 3 ft)",
            code: "4911",
            quantity: 4,
            unitPrice: 1800,
            taxRate: 18,
          },
        ],
        notes: "Please sign and return a copy of this challan on receiving the goods.",
        terms: "Goods are sent for display at the exhibition and will be returned after the event.",
        extra: {
          ...EMPTY_EXTRA,
          reason: "Exhibition or display",
          vehicleNumber: "KA 03 MN 4521",
          transporter: "Swift Surface Logistics",
          shipTo: "Hall 4, Bombay Exhibition Centre, Goregaon East, Mumbai 400063",
        },
      };
    case "purchase-order":
      // The buyer issues a purchase order, so the parties swap: the client orders from the studio.
      return {
        ...base,
        kind,
        number: "PO-2026-118",
        issueDate: "2026-09-28",
        dueDate: "2026-10-20",
        from: base.to,
        to: base.from,
        payment: { ...base.payment, upiId: "" },
        notes: "Please quote this PO number on your invoice.",
        terms: "Deliver final files by the date shown. Payment within 30 days of a valid invoice.",
        extra: {
          ...EMPTY_EXTRA,
          refNumber: "QT-0042",
          shipTo: "Marketing team, 4th Floor, Lotus Park, Mumbai, Maharashtra 400069",
        },
      };
  }
}
