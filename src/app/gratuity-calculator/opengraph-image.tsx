import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Gratuity Calculator by Srutved - gratuity under the new labour code rules";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Gratuity Calculator",
    subtitle: "New labour code rules · 50% wages rule · Fixed-term staff after 1 year · Tax-free limit",
    highlights: ["100% free", "No sign-up", "Latest rules"],
  });
}
