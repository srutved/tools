import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { quotationFormatRoutes } from "@/tools/invoice-generator/format-routes";

export const alt = "Free quotation format by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = quotationFormatRoutes.generateStaticParams;

export default quotationFormatRoutes.ogImage;
