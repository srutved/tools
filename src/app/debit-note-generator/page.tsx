import { ToolPage } from "@/components/tool/tool-page";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { DebitNoteGenerator } from "@/tools/invoice-generator/components/invoice-generator";
import { DEBIT_NOTE_GENERATOR_CONTENT as content } from "@/tools/invoice-generator/debit-note-content";
import { getTool } from "@/tools/registry";

const tool = getTool("debit-note-generator");

export const metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  url: toolUrl(tool.slug),
});

export default function DebitNoteGeneratorPage() {
  return (
    <ToolPage tool={tool} content={content}>
      <DebitNoteGenerator />
    </ToolPage>
  );
}
