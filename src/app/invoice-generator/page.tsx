import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { InvoiceGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { INVOICE_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("invoice-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function InvoiceGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <InvoiceGenerator />
    </ToolPage>
  );
}
