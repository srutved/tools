import { createDocumentStore } from "@/lib/saved-documents";
import { coverLetterSchema } from "./schema";

/** The user's saved cover letters ("My cover letters"), kept in this browser only. */
export const coverLetterStore = createDocumentStore({
  key: "cover-letter-builder/letters",
  schema: coverLetterSchema,
});
