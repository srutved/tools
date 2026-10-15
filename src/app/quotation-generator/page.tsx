import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { QuoteGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { QUOTATION_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/quotation-content";
import { getTool } from "@/tools/registry";

const tool = getTool("quotation-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function QuotationGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <QuoteGenerator />
    </ToolPage>
  );
}
