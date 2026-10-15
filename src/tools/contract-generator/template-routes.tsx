import { createUseCaseRoutes } from "@/components/tool/use-case-routes";
import { ContractThumbnail } from "./components/template-gallery";
import { CONTRACT_EXAMPLES, CONTRACT_TEMPLATES_COLLECTION } from "./examples";

/** Routes for /contract-generator/templates and its contract template pages. */
export const contractTemplateRoutes = createUseCaseRoutes({
  collection: CONTRACT_TEMPLATES_COLLECTION,
  items: CONTRACT_EXAMPLES,
  renderPreview: (contract) => <ContractThumbnail contract={contract} templateId={contract.templateId} />,
});
