import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Cover Letter Builder by Srutved - designs that match your resume, PDF download";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Cover Letter Builder",
    subtitle: "15 designs that match your resume · Filled in from your resume · Instant PDF",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
