import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";
import { INVOICE_TEMPLATES } from "@/tools/invoice-generator/templates";

export const alt = "Free quotation templates by Srutved - fill online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: `${INVOICE_TEMPLATES.length} Free Quotation Templates`,
    subtitle: "Classic, modern, minimal, sidebar and bold designs. Fill online, download a PDF.",
    highlights: ["Free PDF", "Any currency", "GST & VAT"],
  });
}
