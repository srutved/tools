import type { RentReceipt } from "./schema";

/** Realistic example data for thumbnails, tests and "Load example". */
export const SAMPLE_RENT_RECEIPT: RentReceipt = {
  templateId: "classic-navy",
  tenantName: "Rahul Verma",
  landlordName: "Sunita Kapoor",
  landlordPan: "ABCPK1234F",
  landlordAddress: "B-12, Lokhandwala Complex, Andheri West, Mumbai 400053",
  propertyAddress: "Flat 402, Sunshine Residency, Andheri East, Mumbai 400069",
  monthlyRent: 25000,
  from: "2026-04",
  to: "2027-03",
  paymentDay: 5,
  paymentMode: "bank-transfer",
  numberPrefix: "RR-",
  signature: "",
};
