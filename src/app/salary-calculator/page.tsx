import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { SalaryCalculator } from "@/tools/salary-calculator/components/salary-calculator";
import { SALARY_CALCULATOR_CONTENT as content } from "@/tools/salary-calculator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("salary-calculator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function SalaryCalculatorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <SalaryCalculator />
    </ToolPage>
  );
}
