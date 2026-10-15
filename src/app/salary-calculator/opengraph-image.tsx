import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Salary Calculator by Srutved - CTC to monthly in-hand salary for FY 2026-27";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Salary Calculator",
    subtitle: "CTC to in-hand · PF, professional tax and income tax · New vs old regime",
    highlights: ["100% free", "No sign-up", "FY 2026-27 rules"],
  });
}
