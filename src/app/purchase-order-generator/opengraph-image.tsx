import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free Purchase Order Generator by Srutved - purchase orders to suppliers as PDF, GST and VAT";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Purchase Order Generator",
    subtitle: "15 templates · GST & VAT · Any currency · Ship-to address & delivery date",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
