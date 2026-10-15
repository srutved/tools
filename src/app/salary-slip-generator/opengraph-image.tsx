import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Free Salary Slip Generator by Srutved - professional payslips in PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free Salary Slip Generator",
    subtitle: "Earnings · Deductions · Net pay in words · Your logo · Instant PDF",
    highlights: ["100% free", "No sign-up", "No watermark"],
  });
}
