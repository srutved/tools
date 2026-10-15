import type { DocumentKind } from "./lib/document-kind";
import type { Invoice } from "./schema";

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
};

/** The sample as an invoice or a quotation. */
export function sampleFor(kind: DocumentKind): Invoice {
  if (kind === "invoice") return SAMPLE_INVOICE;
  return {
    ...SAMPLE_INVOICE,
    kind,
    number: "QT-0042",
    dueDate: "2026-10-31",
    payment: { ...SAMPLE_INVOICE.payment, upiId: "" },
    notes: "Thank you for the opportunity. We look forward to working with you.",
    terms: "This quotation is valid for 30 days. 50% advance on acceptance, balance on delivery.",
  };
}
