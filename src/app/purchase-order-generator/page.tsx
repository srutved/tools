import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PurchaseOrderGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { PURCHASE_ORDER_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/purchase-order-content";
import { getTool } from "@/tools/registry";

const tool = getTool("purchase-order-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function PurchaseOrderGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <PurchaseOrderGenerator />
    </ToolPage>
  );
}
