import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { invoiceFormatRoutes } from "@/tools/invoice-generator/format-routes";

export const alt = "Free invoice format by Srutved - edit online and download as PDF";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export const generateStaticParams = invoiceFormatRoutes.generateStaticParams;

export default invoiceFormatRoutes.ogImage;
