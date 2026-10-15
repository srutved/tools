import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Quotation Generator by Srutved - quotes and estimates as PDF, GST and VAT";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Quotation Generator",
    subtitle: "15 templates · GST & VAT · Any currency · Quote to invoice in one click",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
