import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free GST Calculator by Srutved - add or remove GST with the CGST, SGST or IGST split";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free GST Calculator",
    subtitle: "Add or remove GST · 5%, 18%, 40% or any rate · CGST, SGST or IGST",
    highlights: ["100% free", "No sign-up", "GST 2.0 rates"],
  });
}
