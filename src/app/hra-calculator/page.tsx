import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { HraCalculator } from "@/tools/hra-calculator/components/hra-calculator";
import { HRA_CALCULATOR_CONTENT as content } from "@/tools/hra-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("hra-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function HraCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <HraCalculator />
    </ToolPage>
  );
}
