import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import { SalarySlipGenerator } from "@/tools/salary-slip-generator/components/salary-slip-generator";
import { SALARY_SLIP_GENERATOR_CONTENT as content } from "@/tools/salary-slip-generator/content";

const tool = getTool("salary-slip-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function SalarySlipGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <SalarySlipGenerator />
    </ToolPage>
  );
}
