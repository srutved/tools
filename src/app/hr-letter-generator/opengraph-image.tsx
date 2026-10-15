import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free HR Letter Generator by Srutved - offer, appointment, experience and relieving letters";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free HR Letter Generator",
    subtitle: "Offer · Appointment · Experience · Relieving · Increment letters · Instant PDF",
    highlights: ["100% free", "No sign-up", "Your letterhead"],
  });
}
