import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import { CONTRACT_EXAMPLES, CONTRACT_TEMPLATES_COLLECTION } from "./contract-generator/examples";
import { COVER_LETTER_EXAMPLES, COVER_LETTER_EXAMPLES_COLLECTION } from "./cover-letter-builder/examples";
import {
  INVOICE_FORMATS,
  INVOICE_FORMATS_COLLECTION,
  QUOTATION_FORMATS,
  QUOTATION_FORMATS_COLLECTION,
} from "./invoice-generator/examples";
import { RESUME_EXAMPLES, RESUME_EXAMPLES_COLLECTION } from "./resume-builder/examples";

/**
 * Every landing-page collection, for the sitemap. Server-only: it pulls in all example documents,
 * so keep it out of client components (they import a tool's own examples instead).
 */
export const USE_CASE_COLLECTIONS: { collection: UseCaseCollection; items: UseCase<unknown>[] }[] = [
  { collection: INVOICE_FORMATS_COLLECTION, items: INVOICE_FORMATS },
  { collection: QUOTATION_FORMATS_COLLECTION, items: QUOTATION_FORMATS },
  { collection: RESUME_EXAMPLES_COLLECTION, items: RESUME_EXAMPLES },
  { collection: COVER_LETTER_EXAMPLES_COLLECTION, items: COVER_LETTER_EXAMPLES },
  { collection: CONTRACT_TEMPLATES_COLLECTION, items: CONTRACT_EXAMPLES },
];

/** Paths of every use-case page, e.g. "resume-builder/examples/fresher". */
export const allUseCasePaths = () =>
  USE_CASE_COLLECTIONS.flatMap(({ collection, items }) =>
    items.map((item) => `${collection.toolSlug}/${collection.segment}/${item.slug}`),
  );
