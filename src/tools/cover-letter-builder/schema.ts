import { z } from "zod";
import { basicsSchema } from "@/tools/resume-builder/schema";

/**
 * A cover letter. Its sender details use the resume's `basics` shape and its templates are the
 * resume templates, so a letter can be filled in from a saved resume and match its design.
 */
export const coverLetterSchema = z.object({
  /** A resume template id: the letter is drawn in the matching design. */
  templateId: z.string(),
  basics: basicsSchema,
  /** "YYYY-MM-DD". */
  date: z.string(),
  recipient: z.object({
    /** e.g. "Ms. Anita Rao" or "Hiring Manager". */
    name: z.string().max(80),
    title: z.string().max(80),
    company: z.string().max(100),
    address: z.string().max(300),
  }),
  /** e.g. "Application for Senior Product Designer". */
  subject: z.string().max(150),
  greeting: z.string().max(100),
  /** Paragraphs separated by blank lines. */
  body: z.string().max(8000),
  closing: z.string().max(60),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Stricter rules applied before a letter is downloaded or printed. */
export const coverLetterExportSchema = coverLetterSchema.superRefine((letter, ctx) => {
  const issue = (path: string[], message: string) => ctx.addIssue({ code: "custom", path, message });
  if (!letter.basics.name.trim()) issue(["basics", "name"], "Add your name");
  const email = letter.basics.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) issue(["basics", "email"], "Enter a valid email address");
  if (!letter.body.trim()) issue(["body"], "Write your letter");
});
