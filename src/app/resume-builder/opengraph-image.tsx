import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Resume Builder by Srutved - ATS-friendly templates, PDF download, no sign-up";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Resume Builder",
    subtitle: "15 templates · ATS-friendly · Live preview · Instant PDF",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
