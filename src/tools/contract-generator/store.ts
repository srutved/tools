import { createDocumentStore } from "@/lib/saved-documents";
import { contractSchema } from "./schema";

/** The user's saved contracts ("My contracts"), kept in this browser only. */
export const contractStore = createDocumentStore({
  key: "contract-generator/contracts",
  schema: contractSchema,
});
