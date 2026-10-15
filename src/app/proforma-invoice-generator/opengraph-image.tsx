import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free Proforma Invoice Generator by Srutved - proforma invoices for advance payments and export orders as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Proforma Invoice Generator",
    subtitle: "15 templates · GST & VAT · Any currency · UPI QR for advances · Convert to invoice",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
