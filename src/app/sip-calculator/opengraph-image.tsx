import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free SIP Calculator by Srutved - what a monthly SIP could grow to, with an optional step-up";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free SIP Calculator",
    subtitle: "Invested vs estimated returns · Yearly step-up · Year-by-year growth",
    highlights: ["100% free", "No sign-up", "Step-up SIP"],
  });
}
