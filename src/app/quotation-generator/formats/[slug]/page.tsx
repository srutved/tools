import { quotationFormatRoutes } from "@/tools/invoice-generator/format-routes";

export const generateStaticParams = quotationFormatRoutes.generateStaticParams;
export const generateMetadata = quotationFormatRoutes.generateMetadata;

export default quotationFormatRoutes.Page;
