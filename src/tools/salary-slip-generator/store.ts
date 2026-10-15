import { createDocumentStore } from "@/lib/saved-documents";
import { salarySlipSchema } from "./schema";

/** The user's saved salary slips, kept in this browser only. */
export const salarySlipStore = createDocumentStore({
  key: "salary-slip-generator/slips",
  schema: salarySlipSchema,
});
