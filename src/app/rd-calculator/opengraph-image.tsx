import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free RD Calculator by Srutved - recurring deposit maturity with quarterly compounding";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free RD Calculator",
    subtitle: "Monthly deposits · Quarterly compounding · Year-by-year value",
    highlights: ["100% free", "No sign-up", "Banks and post office"],
  });
}
