import { TemplatesPage } from "@/components/tool/templates-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { TemplatesShowcase } from "@/tools/invoice-generator/components/templates-showcase";
import { INVOICE_TEMPLATES } from "@/tools/invoice-generator/templates";
import { getTool } from "@/tools/registry";

const tool = getTool("quotation-generator");
const description =
  "Free quotation templates: classic, modern, minimal, sidebar and bold designs. Fill one in online and download a PDF quote in any currency, with GST or VAT.";

export const metadata = buildMetadata({
  title: `${INVOICE_TEMPLATES.length} Free Quotation Templates - Download as PDF`,
  description,
  url: toolUrl(`${tool.slug}/templates`),
});

export default function QuotationTemplatesPage() {
  return (
    <TemplatesPage
      tool={tool}
      heading="Free Quotation Templates"
      intro={`${INVOICE_TEMPLATES.length} professional quotation designs, all free. Pick one, fill it in online and download a PDF - no sign-up, no watermark.`}
      description={description}
      itemNoun="quotation template"
      templates={INVOICE_TEMPLATES}
    >
      <TemplatesShowcase kind="quote" toolSlug={tool.slug} />
    </TemplatesPage>
  );
}
