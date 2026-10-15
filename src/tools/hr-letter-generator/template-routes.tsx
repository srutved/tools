import { createUseCaseRoutes } from "@/components/tool/use-case-routes";
import { LetterThumbnail } from "./components/template-gallery";
import { HR_LETTER_EXAMPLES, HR_LETTER_TEMPLATES_COLLECTION } from "./examples";

/** Routes for /hr-letter-generator/templates and its letter template pages. */
export const hrLetterTemplateRoutes = createUseCaseRoutes({
  collection: HR_LETTER_TEMPLATES_COLLECTION,
  items: HR_LETTER_EXAMPLES,
  renderPreview: (letter) => <LetterThumbnail letter={letter} templateId={letter.templateId} />,
});
