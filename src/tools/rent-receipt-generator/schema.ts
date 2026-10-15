import { z } from "zod";
import { isMonth } from "@/lib/date";

export const PAYMENT_MODES = ["bank-transfer", "upi", "cash", "cheque"] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  "bank-transfer": "bank transfer",
  upi: "UPI",
  cash: "cash",
  cheque: "cheque",
};

/** Shape of a saved set of rent receipts. Lenient on purpose: drafts are allowed to be incomplete. */
export const rentReceiptSchema = z.object({
  templateId: z.string(),
  tenantName: z.string().max(120),
  landlordName: z.string().max(120),
  /** Required by employers for HRA when annual rent exceeds ₹1,00,000. */
  landlordPan: z.string().max(10),
  landlordAddress: z.string().max(300),
  propertyAddress: z.string().max(300),
  monthlyRent: z.number().min(0, "Rent can't be negative"),
  /** First and last month covered, "YYYY-MM". One receipt is made per month. */
  from: z.string(),
  to: z.string(),
  /** Day of the month the rent is paid; each receipt is dated on it. */
  paymentDay: z
    .number()
    .int("Enter a whole day, e.g. 5")
    .min(1, "Enter a day from 1 to 31")
    .max(31, "Enter a day from 1 to 31"),
  paymentMode: z.enum(PAYMENT_MODES),
  /** Receipt numbers are this prefix plus a running number, e.g. RR-01. */
  numberPrefix: z.string().max(20),
  /** The landlord's signature as a PNG data URL, if they add one. */
  signature: z.string(),
});

export type RentReceipt = z.infer<typeof rentReceiptSchema>;

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const isValidPan = (pan: string) => PAN_PATTERN.test(pan.trim().toUpperCase());

const required = (message: string) => z.string().trim().min(1, message);

/** Stricter rules applied before receipts are downloaded or printed. */
export const rentReceiptExportSchema = rentReceiptSchema
  .extend({
    tenantName: required("Add the tenant's name"),
    landlordName: required("Add the landlord's name"),
    propertyAddress: required("Add the rented property's address"),
    monthlyRent: z.number({ error: "Enter the monthly rent" }).positive("Enter the monthly rent"),
  })
  .superRefine((receipt, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (receipt.landlordPan.trim() && !isValidPan(receipt.landlordPan)) {
      issue("landlordPan", "Enter a valid 10-character PAN, e.g. ABCPK1234F");
    }
    if (!isMonth(receipt.from)) issue("from", "Choose the first month");
    if (!isMonth(receipt.to)) issue("to", "Choose the last month");
    if (isMonth(receipt.from) && isMonth(receipt.to) && receipt.to < receipt.from) {
      issue("to", "The last month must be after the first");
    }
  });
