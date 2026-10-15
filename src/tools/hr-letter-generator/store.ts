import { createDocumentStore } from "@/lib/saved-documents";
import { hrLetterSchema } from "./schema";

/** The user's saved HR letters ("My letters"), kept in this browser only. */
export const hrLetterStore = createDocumentStore({
  key: "hr-letter-generator/letters",
  schema: hrLetterSchema,
});
