import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { hrLetterTemplateRoutes } from "@/tools/hr-letter-generator/template-routes";

export const alt = "Free HR letter template by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = hrLetterTemplateRoutes.generateStaticParams;

export default hrLetterTemplateRoutes.ogImage;
