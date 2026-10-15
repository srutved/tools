import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { CreditNoteGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { CREDIT_NOTE_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/credit-note-content";
import { getTool } from "@/tools/registry";

const tool = getTool("credit-note-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function CreditNoteGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <CreditNoteGenerator />
    </ToolPage>
  );
}
