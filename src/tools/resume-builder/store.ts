import { createDocumentStore } from "@/lib/saved-documents";
import { resumeSchema } from "./schema";

/** The user's saved resumes ("My resumes"), kept in this browser only. */
export const resumeStore = createDocumentStore({ key: "resume-builder/resumes", schema: resumeSchema });
