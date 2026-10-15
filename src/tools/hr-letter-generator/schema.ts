import { z } from "zod";

/**
 * - offer:       an offer of employment (or an internship), with an acceptance block
 * - appointment: the formal appointment letter with terms of employment, signed on joining
 * - experience:  an experience certificate (or internship certificate) after someone leaves
 * - relieving:   confirms a resignation was accepted and the employee is relieved of their duties
 * - increment:   a salary revision, with an optional promotion
 */
export const LETTER_KINDS = ["offer", "appointment", "experience", "relieving", "increment"] as const;
export type LetterKind = (typeof LETTER_KINDS)[number];

export const EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

/** How the letter refers to the employee. "they" by default, so no one is misgendered. */
export const PRONOUNS = ["they", "she", "he"] as const;
export type Pronoun = (typeof PRONOUNS)[number];

const days = (max: number) =>
  z.number().int("Enter a whole number").min(0, "Enter 0 or more").max(max, `Enter at most ${max}`);

/** Shape of a saved HR letter. Lenient on purpose: drafts are allowed to be incomplete. */
export const hrLetterSchema = z.object({
  kind: z.enum(LETTER_KINDS),
  templateId: z.string(),
  /** "YYYY-MM-DD". */
  letterDate: z.string(),
  /** Optional reference number, e.g. "BT/HR/2026/041". */
  reference: z.string().max(60),
  company: z.object({
    name: z.string().max(120),
    address: z.string().max(300),
    email: z.string().max(120),
    phone: z.string().max(40),
    website: z.string().max(120),
    /** PNG data URL, already downscaled. */
    logo: z.string(),
  }),
  /** Who signs for the company, e.g. the HR manager or a director. */
  signatory: z.object({
    name: z.string().max(80),
    title: z.string().max(80),
    /** PNG data URL of their signature, if added. */
    signature: z.string(),
  }),
  employee: z.object({
    name: z.string().max(120),
    address: z.string().max(300),
    employeeId: z.string().max(40),
    pronoun: z.enum(PRONOUNS),
  }),
  designation: z.string().max(80),
  department: z.string().max(80),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  location: z.string().max(120),
  reportingTo: z.string().max(120),
  /** e.g. "Monday to Friday, 9:30 am to 6:30 pm". */
  workingHours: z.string().max(120),

  /** Start of employment (offer, appointment) or the date they joined (experience, relieving). */
  joiningDate: z.string(),
  /** End of an internship, or the last working day (experience, relieving). */
  endDate: z.string(),
  /** Relieving letters: the date of the resignation. */
  resignationDate: z.string(),
  /** Offer letters: the date by which the offer must be accepted. */
  offerValidUntil: z.string(),
  /** Increment letters: the date the new salary applies from. */
  effectiveDate: z.string(),

  currency: z.string().length(3),
  /** Annual CTC; for internships, the monthly stipend. Increment letters: the revised CTC. */
  pay: z.number().min(0, "Can't be negative"),
  /** Increment letters: the annual CTC before the revision (0 to leave it out). */
  previousPay: z.number().min(0, "Can't be negative"),
  /** Increment letters: the new title, for a promotion. Blank for a salary revision only. */
  newDesignation: z.string().max(80),
  /** Monthly salary components for the annexure. */
  salaryBreakdown: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().max(80),
        monthly: z.number().min(0, "Can't be negative"),
      }),
    )
    .max(20),
  probationMonths: days(24),
  noticeDays: days(180),

  /** Experience: a line on their conduct. Relieving: a note on the settlement. Blank uses standard wording. */
  remarks: z.string().max(1000),
  /** Extra terms or paragraphs the user writes themselves. */
  customTerms: z
    .array(z.object({ id: z.string(), title: z.string().max(120), text: z.string().max(2000) }))
    .max(20),
});

export type HrLetter = z.infer<typeof hrLetterSchema>;

const blank = (value: string) => !value.trim();

/** Stricter rules applied before a letter is downloaded or printed. Only fields the kind uses are checked. */
export const hrLetterExportSchema = hrLetterSchema.superRefine((letter, ctx) => {
  const issue = (path: (string | number)[], message: string) =>
    ctx.addIssue({ code: "custom", path, message });
  const { kind } = letter;
  const internship = letter.employmentType === "internship";

  if (blank(letter.company.name)) issue(["company", "name"], "Add the company's name");
  if (blank(letter.employee.name)) issue(["employee", "name"], "Add the employee's name");
  if (blank(letter.letterDate)) issue(["letterDate"], "Add the date of the letter");
  if (blank(letter.signatory.name)) issue(["signatory", "name"], "Add who signs the letter");
  if (kind !== "increment" && blank(letter.designation)) issue(["designation"], "Add the designation");

  if (kind === "offer" || kind === "appointment") {
    if (blank(letter.joiningDate)) issue(["joiningDate"], "Add the joining date");
    if (!(letter.pay > 0)) issue(["pay"], internship ? "Add the monthly stipend" : "Add the annual CTC");
    if (internship && blank(letter.endDate)) issue(["endDate"], "Add when the internship ends");
  }
  if (
    kind === "offer" &&
    letter.offerValidUntil &&
    letter.letterDate &&
    letter.offerValidUntil < letter.letterDate
  ) {
    issue(["offerValidUntil"], "The offer can't expire before the letter's date");
  }
  if (kind === "experience") {
    if (blank(letter.joiningDate)) issue(["joiningDate"], "Add the date they joined");
    if (blank(letter.endDate)) issue(["endDate"], "Add their last working day");
  }
  if (kind === "relieving" && blank(letter.endDate)) issue(["endDate"], "Add their last working day");
  if ((kind === "experience" || kind === "relieving" || internship) && letter.joiningDate && letter.endDate) {
    if (letter.endDate < letter.joiningDate) issue(["endDate"], "This must be after the joining date");
  }
  if (kind === "increment") {
    if (!(letter.pay > 0)) issue(["pay"], "Add the revised annual CTC");
    if (blank(letter.effectiveDate)) issue(["effectiveDate"], "Add the date the revision applies from");
  }
  letter.salaryBreakdown.forEach((row, index) => {
    if (row.monthly > 0 && blank(row.label))
      issue(["salaryBreakdown", index, "label"], "Name this component");
  });
  letter.customTerms.forEach((term, index) => {
    if (blank(term.text) && !blank(term.title))
      issue(["customTerms", index, "text"], "Add the text, or remove it");
  });
});
