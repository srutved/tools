import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free EMI Calculator by Srutved - monthly EMI, total interest and the full repayment schedule";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free EMI Calculator",
    subtitle: "Monthly EMI · Total interest · Year-by-year and monthly schedule",
    highlights: ["100% free", "No sign-up", "Home,  car and personal loans"],
  });
}
