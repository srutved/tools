import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { SipCalculator } from "@/tools/sip-calculator/components/sip-calculator";
import { SIP_CALCULATOR_CONTENT as content } from "@/tools/sip-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("sip-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function SipCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <SipCalculator />
    </ToolPage>
  );
}
