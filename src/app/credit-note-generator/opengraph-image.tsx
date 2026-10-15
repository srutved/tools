import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Credit Note Generator by Srutved - GST credit notes against invoices as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Credit Note Generator",
    subtitle: "15 templates · GST & VAT · Original invoice reference · Create from an invoice",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
