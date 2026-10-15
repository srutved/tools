import { z } from "zod";
import { paymentDetailsSchema, partySchema } from "@/shared/business-profile";
import { DOCUMENT_KINDS, kindLabels } from "./lib/document-kind";
import { isValidGstin } from "./lib/gst";
import { isValidUpiId } from "./lib/upi";

/**
 * - none:       no tax lines
 * - custom:     one tax per line with a custom label (VAT, Sales Tax, HST...)
 * - gst:        Indian GST, split into CGST + SGST (same state) or IGST (different state)
 * - gst-export: Indian export of services under LUT, zero-rated
 */
export const TAX_MODES = ["none", "custom", "gst", "gst-export"] as const;
export type TaxMode = (typeof TAX_MODES)[number];

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().max(300),
  /** HSN/SAC code for GST, or any item code. */
  code: z.string().max(20),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  /** Tax rate in percent. Ignored when the invoice's tax mode has no per-line tax. */
  taxRate: z.number().min(0).max(100),
});

export type LineItem = z.infer<typeof lineItemSchema>;

/** Details only some kinds of document use; see `KindExtras` in lib/document-kind.ts. */
export const documentExtraSchema = z.object({
  /** The document this one refers to, e.g. the invoice a credit note adjusts or a receipt settles. */
  refNumber: z.string().max(40),
  /** "YYYY-MM-DD" or "". */
  refDate: z.string(),
  /** Why it was issued (credit and debit notes) or the purpose of a delivery (challans). */
  reason: z.string().max(300),
  paymentMethod: z.string().max(40),
  /** UPI transaction ID, cheque number... */
  paymentReference: z.string().max(80),
  vehicleNumber: z.string().max(40),
  transporter: z.string().max(80),
  /** Delivery address, when different from the other party's address. */
  shipTo: z.string().max(500),
});

export type DocumentExtra = z.infer<typeof documentExtraSchema>;

export const EMPTY_EXTRA: DocumentExtra = {
  refNumber: "",
  refDate: "",
  reason: "",
  paymentMethod: "",
  paymentReference: "",
  vehicleNumber: "",
  transporter: "",
  shipTo: "",
};

/** Shape of a saved invoice. Lenient on purpose: drafts are allowed to be incomplete. */
export const invoiceSchema = z.object({
  /** Invoice, quotation, receipt...: same data, different wording. */
  kind: z.enum(DOCUMENT_KINDS),
  templateId: z.string(),
  number: z.string().max(40),
  issueDate: z.string(),
  dueDate: z.string(),
  currency: z.string().length(3),
  taxMode: z.enum(TAX_MODES),
  taxLabel: z.string().max(20),
  /** GST place of supply (state code). Defaults to the client's state. */
  placeOfSupply: z.string().max(2),
  lutNumber: z.string().max(40),
  discount: z.number().min(0),
  logo: z.string(),
  from: partySchema,
  to: partySchema,
  payment: paymentDetailsSchema,
  items: z.array(lineItemSchema),
  notes: z.string().max(1000),
  terms: z.string().max(1000),
  extra: documentExtraSchema,
});

export type Invoice = z.infer<typeof invoiceSchema>;

const required = (message: string) => z.string().trim().min(1, message);

/** Stricter rules applied before an invoice is downloaded or printed. */
export const invoiceExportSchema = invoiceSchema
  .extend({
    from: partySchema.extend({ name: required("Add your business name") }),
    items: z
      .array(
        lineItemSchema.extend({
          description: required("Describe this item"),
          quantity: z.number({ error: "Enter a quantity" }).min(0, "Can't be negative"),
          unitPrice: z.number({ error: "Enter a price" }).min(0, "Can't be negative"),
        }),
      )
      .min(1, "Add at least one item"),
  })
  .superRefine((invoice, ctx) => {
    // Kind-aware messages: "Add the receipt number", "Add the vendor's name"...
    const labels = kindLabels(invoice.kind);
    // Lower-case for mid-sentence, but keep acronyms: "PO number", not "po number".
    const inSentence = (text: string) =>
      /^[A-Z]{2}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    if (!invoice.number.trim()) issue(["number"], `Add the ${inSentence(labels.numberField)}`);
    if (!invoice.issueDate.trim()) issue(["issueDate"], `Add the ${inSentence(labels.dateField)}`);
    if (!invoice.to.name.trim()) issue(["to", "name"], `Add the ${labels.partyNoun}'s name`);
    const extras = labels.extras;
    if (extras?.refNumber?.required && !invoice.extra.refNumber.trim()) {
      issue(["extra", "refNumber"], `Add the ${inSentence(extras.refNumber.field)}`);
    }
    if (extras?.reason?.required && !invoice.extra.reason.trim()) {
      issue(["extra", "reason"], `Add the ${inSentence(extras.reason.label)}`);
    }
    if (extras?.payment && !invoice.extra.paymentMethod.trim()) {
      issue(["extra", "paymentMethod"], "Choose how the payment was made");
    }

    const upiId = invoice.payment.upiId.trim();
    if (upiId && !isValidUpiId(upiId)) {
      ctx.addIssue({
        code: "custom",
        path: ["payment", "upiId"],
        message: "Enter a valid UPI ID, e.g. name@bank",
      });
    }
    // Your GSTIN is checked on any GST invoice; the client's only on domestic ones,
    // because export clients have foreign tax IDs.
    const gstinParties =
      invoice.taxMode === "gst"
        ? (["from", "to"] as const)
        : invoice.taxMode === "gst-export"
          ? (["from"] as const)
          : [];
    for (const party of gstinParties) {
      const gstin = invoice[party].taxId.trim();
      if (gstin && !isValidGstin(gstin)) {
        ctx.addIssue({ code: "custom", path: [party, "taxId"], message: "Enter a valid 15-character GSTIN" });
      }
    }
    if (invoice.discount > 0) {
      const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      if (invoice.discount > subtotal) {
        ctx.addIssue({ code: "custom", path: ["discount"], message: "Discount can't exceed the subtotal" });
      }
    }
  });
