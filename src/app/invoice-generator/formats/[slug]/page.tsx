import { invoiceFormatRoutes } from "@/tools/invoice-generator/format-routes";

export const generateStaticParams = invoiceFormatRoutes.generateStaticParams;
export const generateMetadata = invoiceFormatRoutes.generateMetadata;

export default invoiceFormatRoutes.Page;
