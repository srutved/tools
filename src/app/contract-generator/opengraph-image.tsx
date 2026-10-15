import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Contract Generator by Srutved - freelance agreement, NDA and statement of work";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Contract Generator",
    subtitle: "Freelance agreement · NDA · Statement of work · Plain English · Instant PDF",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
