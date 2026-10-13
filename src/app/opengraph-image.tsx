import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Srutved Tools - free business tools for freelancers and small businesses";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Business Tools",
    subtitle: "Invoices, resumes and contracts in minutes. Everything runs in your browser.",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
