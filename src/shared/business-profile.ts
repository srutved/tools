/**
 * The user's own business details, shared by every tool (invoices today; quotes and contracts
 * later) so they only have to be entered once. Stored locally in the browser.
 */

import { z } from "zod";
import { readStored, SHARED_KEYS, writeStored } from "@/lib/storage";

export const partySchema = z.object({
  name: z.string().max(120),
  address: z.string().max(500),
  /** GSTIN, VAT number, EIN, ABN... whatever the party's tax registration is called locally. */
  taxId: z.string().max(40),
  email: z.string().max(120),
  phone: z.string().max(40),
  /** Indian GST state code (e.g. "29" for Karnataka). Only used for GST invoices. */
  stateCode: z.string().max(2),
});

export type Party = z.infer<typeof partySchema>;

export const paymentDetailsSchema = z.object({
  upiId: z.string().max(80),
  paymentLink: z.string().max(300),
  bankName: z.string().max(80),
  accountName: z.string().max(80),
  /** Account number or IBAN. */
  accountNumber: z.string().max(60),
  /** IFSC, SWIFT/BIC, sort code or routing number. */
  bankCode: z.string().max(40),
});

export type PaymentDetails = z.infer<typeof paymentDetailsSchema>;

export const businessProfileSchema = z.object({
  business: partySchema,
  payment: paymentDetailsSchema,
  /** PNG data URL, already downscaled. */
  logo: z.string(),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

export const EMPTY_PARTY: Party = { name: "", address: "", taxId: "", email: "", phone: "", stateCode: "" };

export const EMPTY_PAYMENT_DETAILS: PaymentDetails = {
  upiId: "",
  paymentLink: "",
  bankName: "",
  accountName: "",
  accountNumber: "",
  bankCode: "",
};

export function loadBusinessProfile(): BusinessProfile | null {
  return readStored(SHARED_KEYS.businessProfile, businessProfileSchema);
}

export function saveBusinessProfile(profile: BusinessProfile): void {
  writeStored(SHARED_KEYS.businessProfile, profile);
}
