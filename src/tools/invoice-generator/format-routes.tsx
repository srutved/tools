import { createUseCaseRoutes } from "@/components/tool/use-case-routes";
import { TemplateThumbnail } from "./components/template-gallery";
import {
  INVOICE_FORMATS,
  INVOICE_FORMATS_COLLECTION,
  QUOTATION_FORMATS,
  QUOTATION_FORMATS_COLLECTION,
} from "./examples";
import type { Invoice } from "./schema";

const renderPreview = (invoice: Invoice) => (
  <TemplateThumbnail invoice={invoice} templateId={invoice.templateId} />
);

/** Routes for /invoice-generator/formats and its format pages. */
export const invoiceFormatRoutes = createUseCaseRoutes({
  collection: INVOICE_FORMATS_COLLECTION,
  items: INVOICE_FORMATS,
  renderPreview,
});

/** Routes for /quotation-generator/formats and its format pages. */
export const quotationFormatRoutes = createUseCaseRoutes({
  collection: QUOTATION_FORMATS_COLLECTION,
  items: QUOTATION_FORMATS,
  renderPreview,
});
