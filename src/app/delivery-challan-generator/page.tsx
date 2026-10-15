import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { DeliveryChallanGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { DELIVERY_CHALLAN_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/challan-content";
import { getTool } from "@/tools/registry";

const tool = getTool("delivery-challan-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function DeliveryChallanGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <DeliveryChallanGenerator />
    </ToolPage>
  );
}
