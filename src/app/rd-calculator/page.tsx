import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { RdCalculator } from "@/tools/rd-calculator/components/rd-calculator";
import { RD_CALCULATOR_CONTENT as content } from "@/tools/rd-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("rd-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function RdCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <RdCalculator />
    </ToolPage>
  );
}
