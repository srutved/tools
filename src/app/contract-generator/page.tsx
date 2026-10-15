import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { ContractGenerator } from "@/tools/contract-generator/components/contract-generator";
import { CONTRACT_GENERATOR_CONTENT as content } from "@/tools/contract-generator/content";
import { getTool } from "@/tools/registry";

const tool = getTool("contract-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function ContractGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <ContractGenerator />
    </ToolPage>
  );
}
