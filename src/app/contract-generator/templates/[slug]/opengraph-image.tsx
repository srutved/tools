import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { contractTemplateRoutes } from "@/tools/contract-generator/template-routes";

export const alt = "Free contract template by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = contractTemplateRoutes.generateStaticParams;

export default contractTemplateRoutes.ogImage;
