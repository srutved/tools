import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { RentReceiptGenerator } from "@/tools/rent-receipt-generator/components/rent-receipt-generator";
import { RENT_RECEIPT_GENERATOR_CONTENT as content } from "@/tools/rent-receipt-generator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("rent-receipt-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function RentReceiptGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <RentReceiptGenerator />
    </ToolPage>
  );
}
