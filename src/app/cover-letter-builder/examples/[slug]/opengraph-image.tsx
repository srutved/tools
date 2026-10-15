import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { coverLetterExampleRoutes } from "@/tools/cover-letter-builder/example-routes";

export const alt = "Free cover letter by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = coverLetterExampleRoutes.generateStaticParams;

export default coverLetterExampleRoutes.ogImage;
