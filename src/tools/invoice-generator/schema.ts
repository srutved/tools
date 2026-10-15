import { z } from "zod";
import { paymentDetailsSchema, partySchema } from "@/shared/business-profile";
import { DOCUMENT_KINDS } from "./lib/document-kind";
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

/** Shape of a saved invoice. Lenient on purpose: drafts are allowed to be incomplete. */
export const invoiceSchema = z.object({
  /** Invoice or quotation: same data, different wording. */
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
});

export type Invoice = z.infer<typeof invoiceSchema>;

const required = (message: string) => z.string().trim().min(1, message);

/** Stricter rules applied before an invoice is downloaded or printed. */
export const invoiceExportSchema = invoiceSchema
  .extend({
    number: required("Add an invoice number"),
    issueDate: required("Add an invoice date"),
    from: partySchema.extend({ name: required("Add your business name") }),
    to: partySchema.extend({ name: required("Add your client's name") }),
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
