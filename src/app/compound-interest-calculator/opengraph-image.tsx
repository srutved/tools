import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free Compound Interest Calculator by Srutved - how money grows, with optional regular deposits";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Compound Interest Calculator",
    subtitle: "Yearly to daily compounding · Regular deposits · Simple vs compound interest",
    highlights: ["100% free", "No sign-up", "Year-by-year table"],
  });
}
