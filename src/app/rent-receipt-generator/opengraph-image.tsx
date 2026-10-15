import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Rent Receipt Generator by Srutved - monthly rent receipts for HRA in one PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Rent Receipt Generator",
    subtitle: "A receipt for every month · Landlord PAN · Revenue stamp · Instant PDF",
    highlights: ["100% free", "No sign-up", "HRA-ready"],
  });
}
