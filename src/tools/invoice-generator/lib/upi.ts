/** UPI payment links, rendered as a QR code any Indian payments app can scan. */

const UPI_ID_PATTERN = /^[\w.-]{2,256}@[a-zA-Z][\w]{1,63}$/;

export function isValidUpiId(upiId: string): boolean {
  return UPI_ID_PATTERN.test(upiId.trim());
}

interface UpiPaymentInput {
  upiId: string;
  payeeName: string;
  amount: number;
  note?: string;
}

/** Builds a `upi://pay` URI per the NPCI deep-link spec. Amounts are always in INR. */
export function buildUpiUri({ upiId, payeeName, amount, note }: UpiPaymentInput): string {
  const params = [
    `pa=${upiId.trim()}`, // VPAs are not percent-encoded; several UPI apps reject an encoded "@".
    `pn=${encodeURIComponent(payeeName.trim())}`,
    `am=${amount.toFixed(2)}`,
    "cu=INR",
  ];
  if (note) params.push(`tn=${encodeURIComponent(note.slice(0, 80))}`);
  return `upi://pay?${params.join("&")}`;
}
