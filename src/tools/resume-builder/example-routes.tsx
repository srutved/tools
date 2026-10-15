import { createUseCaseRoutes } from "@/components/tool/use-case-routes";
import { ResumeThumbnail } from "./components/template-gallery";
import { RESUME_EXAMPLES, RESUME_EXAMPLES_COLLECTION } from "./examples";

/** Routes for /resume-builder/examples and its example pages. */
export const resumeExampleRoutes = createUseCaseRoutes({
  collection: RESUME_EXAMPLES_COLLECTION,
  items: RESUME_EXAMPLES,
  renderPreview: (resume) => <ResumeThumbnail resume={resume} templateId={resume.templateId} />,
});
