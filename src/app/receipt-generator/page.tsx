import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { ReceiptGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { RECEIPT_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/receipt-content";
import { getTool } from "@/tools/registry";

const tool = getTool("receipt-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function ReceiptGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <ReceiptGenerator />
    </ToolPage>
  );
}
