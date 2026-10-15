import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Free FD Calculator by Srutved - fixed deposit maturity and interest with quarterly compounding";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Free FD Calculator",
    subtitle: "Maturity amount · Quarterly compounding · Monthly or quarterly payouts",
    highlights: ["100% free", "No sign-up", "Cumulative or payout"],
  });
}
