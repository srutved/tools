import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free PF Calculator by Srutved - your EPF balance at retirement at 8.25% interest";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free PF Calculator",
    subtitle: "EPF balance at retirement · Employer and employee share · EPS split · Year by year",
    highlights: ["100% free", "No sign-up", "8.25% for FY 2025-26"],
  });
}
