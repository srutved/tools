import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "15 free cover letter templates by Srutved that match your resume";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "15 Free Cover Letter Templates",
    subtitle: "Classic · Modern · Executive · Sidebar · Two-column - each matching a resume",
    highlights: ["Matches your resume", "Free PDF download", "No watermark"],
  });
}
