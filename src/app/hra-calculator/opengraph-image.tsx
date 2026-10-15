import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free HRA Calculator by Srutved - tax-free HRA under the new 8 metro city rules";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free HRA Calculator",
    subtitle: "Tax-free HRA in seconds · 8 metro cities from FY 2026-27 · Monthly or yearly",
    highlights: ["100% free", "No sign-up", "Latest rules"],
  });
}
