import { financialYear } from "@/lib/date";
import type { RentReceipt } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

/** A blank set of rent receipts covering the current financial year (April to March). */
export function createRentReceipt(templateId: string = DEFAULT_TEMPLATE_ID): RentReceipt {
  const { from, to } = financialYear();
  return {
    templateId,
    tenantName: "",
    landlordName: "",
    landlordPan: "",
    landlordAddress: "",
    propertyAddress: "",
    monthlyRent: 0,
    from,
    to,
    paymentDay: 5,
    paymentMode: "bank-transfer",
    numberPrefix: "RR-",
    signature: "",
  };
}
