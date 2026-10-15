import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { GstCalculator } from "@/tools/gst-calculator/components/gst-calculator";
import { GST_CALCULATOR_CONTENT as content } from "@/tools/gst-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("gst-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function GstCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <GstCalculator />
    </ToolPage>
  );
}
