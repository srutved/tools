import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "15 free resume templates by Srutved - ATS-friendly, modern and two-column designs";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "15 Free Resume Templates",
    subtitle: "Classic · Modern · Executive · Sidebar · Two-column",
    highlights: ["ATS-friendly", "Free PDF download", "No watermark"],
  });
}
