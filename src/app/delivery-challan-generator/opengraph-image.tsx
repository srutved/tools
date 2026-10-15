import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free Delivery Challan Generator by Srutved - GST delivery challans for job work and goods on approval as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Delivery Challan Generator",
    subtitle: "15 templates · GST ready · Vehicle & transporter · Job work & approval",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
