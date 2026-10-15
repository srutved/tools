import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { resumeExampleRoutes } from "@/tools/resume-builder/example-routes";

export const alt = "Free resume by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = resumeExampleRoutes.generateStaticParams;

export default resumeExampleRoutes.ogImage;
