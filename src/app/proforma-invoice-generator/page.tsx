import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { ProformaInvoiceGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { PROFORMA_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/proforma-content";
import { getTool } from "@/tools/registry";

const tool = getTool("proforma-invoice-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function ProformaInvoiceGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <ProformaInvoiceGenerator />
    </ToolPage>
  );
}
