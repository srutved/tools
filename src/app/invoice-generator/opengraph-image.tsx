import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Invoice Generator by Srutved - GST, VAT, any currency, PDF download";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Invoice Generator",
    subtitle: "15 templates · GST & VAT · Any currency · Instant PDF",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
