import { createUseCaseRoutes } from "@/components/tool/use-case-routes";
import { CoverLetterThumbnail } from "./components/template-gallery";
import { COVER_LETTER_EXAMPLES, COVER_LETTER_EXAMPLES_COLLECTION } from "./examples";

/** Routes for /cover-letter-builder/examples and its example pages. */
export const coverLetterExampleRoutes = createUseCaseRoutes({
  collection: COVER_LETTER_EXAMPLES_COLLECTION,
  items: COVER_LETTER_EXAMPLES,
  renderPreview: (letter) => <CoverLetterThumbnail letter={letter} templateId={letter.templateId} />,
});
