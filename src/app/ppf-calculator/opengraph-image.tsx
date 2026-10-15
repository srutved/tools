import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free PPF Calculator by Srutved - Public Provident Fund maturity at 7.1%, year by year";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free PPF Calculator",
    subtitle: "Maturity at 7.1% · 15 years plus 5-year extensions · Year-by-year balance",
    highlights: ["100% free", "No sign-up", "Tax-free (EEE)"],
  });
}
