import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free Receipt Generator by Srutved - payment receipts for cash, UPI, bank and cheque as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Receipt Generator",
    subtitle: "15 templates · Cash, UPI, bank & cheque · Linked to invoices · Any currency",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
