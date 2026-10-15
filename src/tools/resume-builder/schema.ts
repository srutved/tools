import { z } from "zod";

/** Built-in resume sections. Personal details always come first; everything else can be reordered. */
export const SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_TITLES: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
};

// Dates are free text ("Jan 2024", "2019", "Summer 2021") so every country's format works.
const date = z.string().max(30);

export const linkSchema = z.object({
  id: z.string(),
  /** e.g. "LinkedIn", "Portfolio". */
  label: z.string().max(40),
  url: z.string().max(200),
});

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string().max(100),
  company: z.string().max(100),
  location: z.string().max(80),
  startDate: date,
  endDate: date,
  current: z.boolean(),
  /** One achievement per line; each becomes a bullet point. */
  description: z.string().max(3000),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().max(120),
  school: z.string().max(120),
  location: z.string().max(80),
  startDate: date,
  endDate: date,
  /** GPA, percentage or class, e.g. "CGPA 8.6/10". */
  score: z.string().max(40),
  description: z.string().max(1000),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  /** Optional group name, e.g. "Languages" or "Tools". */
  name: z.string().max(60),
  /** Comma-separated. */
  skills: z.string().max(600),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  /** Role or tech stack, e.g. "Next.js, Stripe". */
  subtitle: z.string().max(120),
  link: z.string().max(200),
  date,
  description: z.string().max(2000),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().max(120),
  issuer: z.string().max(100),
  date,
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().max(40),
  level: z.string().max(40),
});

export type ResumeLink = z.infer<typeof linkSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;

/** A custom label and value shown with the contact details, e.g. "Nationality: Indian". */
export const personalDetailSchema = z.object({
  id: z.string(),
  label: z.string().max(40),
  value: z.string().max(100),
});

/** One item in a custom section in "entries" format. Every field is optional. */
export const customEntrySchema = z.object({
  id: z.string(),
  title: z.string().max(120),
  subtitle: z.string().max(120),
  date,
  /** One point per line; each becomes a bullet point. */
  description: z.string().max(2000),
});

export const CUSTOM_SECTION_FORMATS = ["entries", "list", "text"] as const;
export type CustomSectionFormat = (typeof CUSTOM_SECTION_FORMATS)[number];

/** A section the user names and fills in themselves: awards, volunteering, publications... */
export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().max(60),
  /**
   * - entries: items with a title, subtitle, date and bullet points (like jobs)
   * - list:    a bullet point per line of `text`
   * - text:    `text` as a paragraph
   */
  format: z.enum(CUSTOM_SECTION_FORMATS),
  /** Two-column templates: which column the section goes in. */
  placement: z.enum(["main", "side"]),
  text: z.string().max(3000),
  entries: z.array(customEntrySchema),
});

export type PersonalDetail = z.infer<typeof personalDetailSchema>;
export type CustomEntry = z.infer<typeof customEntrySchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;

/**
 * Sections are referred to by key in the order, title and visibility settings: the id for built-in
 * sections ("experience") and "custom:<id>" for custom ones.
 */
export const customSectionKey = (id: string) => `custom:${id}`;

/** The person's name and contact details. Shared with the cover letter builder. */
export const basicsSchema = z.object({
  name: z.string().max(80),
  /** Job title or one-line pitch, e.g. "Senior Frontend Engineer". */
  headline: z.string().max(120),
  email: z.string().max(120),
  phone: z.string().max(40),
  location: z.string().max(80),
  /** Square JPEG data URL, already downscaled. Only some templates show it. */
  photo: z.string(),
  links: z.array(linkSchema),
  /** Extra details such as date of birth or nationality, where employers expect them. */
  details: z.array(personalDetailSchema),
});

export type Basics = z.infer<typeof basicsSchema>;

/** Shape of a saved resume. Lenient on purpose: drafts are allowed to be incomplete. */
export const resumeSchema = z.object({
  templateId: z.string(),
  basics: basicsSchema,
  summary: z.string().max(1500),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillGroupSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  customSections: z.array(customSectionSchema),
  /** Section keys in display order. Missing sections are appended, unknown ones ignored. */
  sectionOrder: z.array(z.string()),
  /** Renamed headings for built-in sections, by key. */
  sectionTitles: z.record(z.string(), z.string().max(60)),
  /** Keys of sections left off the resume (their content is kept). */
  hiddenSections: z.array(z.string()),
});

export type Resume = z.infer<typeof resumeSchema>;

/** Every field of an entry except its id is empty, so it can be ignored. */
export function isBlankEntry(entry: object): boolean {
  return Object.entries(entry).every(([key, value]) => key === "id" || !value);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stricter rules applied before a resume is downloaded or printed. Entries left completely empty
 * are skipped rather than reported; partly filled ones need their main field.
 */
export const resumeExportSchema = resumeSchema.superRefine((resume, ctx) => {
  const issue = (path: (string | number)[], message: string) =>
    ctx.addIssue({ code: "custom", path, message });

  if (!resume.basics.name.trim()) issue(["basics", "name"], "Add your name");
  const email = resume.basics.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) issue(["basics", "email"], "Enter a valid email address");

  const requireField = <T extends { id: string }>(
    section: string,
    entries: T[],
    isFilled: (entry: T) => boolean,
    field: keyof T & string,
    message: string,
  ) => {
    entries.forEach((entry, index) => {
      if (!isBlankEntry(entry) && !isFilled(entry)) issue([section, index, field], message);
    });
  };

  requireField(
    "experience",
    resume.experience,
    (job) => Boolean(job.role.trim() || job.company.trim()),
    "role",
    "Add a job title or company",
  );
  requireField(
    "education",
    resume.education,
    (school) => Boolean(school.school.trim() || school.degree.trim()),
    "school",
    "Add a school or degree",
  );
  requireField(
    "skills",
    resume.skills,
    (group) => Boolean(group.skills.trim()),
    "skills",
    "List at least one skill",
  );
  requireField(
    "projects",
    resume.projects,
    (project) => Boolean(project.name.trim()),
    "name",
    "Add a project name",
  );
  requireField(
    "certifications",
    resume.certifications,
    (cert) => Boolean(cert.name.trim()),
    "name",
    "Add a certification name",
  );
  requireField(
    "languages",
    resume.languages,
    (language) => Boolean(language.name.trim()),
    "name",
    "Add a language",
  );
  resume.customSections.forEach((section, index) => {
    const hasContent = section.text.trim() || section.entries.some((entry) => !isBlankEntry(entry));
    if (hasContent && !section.title.trim()) {
      issue(["customSections", index, "title"], "Give this section a heading");
    }
    if (section.format === "entries") {
      section.entries.forEach((entry, entryIndex) => {
        if (!isBlankEntry(entry) && !entry.title.trim()) {
          issue(["customSections", index, "entries", entryIndex, "title"], "Add a title");
        }
      });
    }
  });
  resume.basics.details.forEach((detail, index) => {
    if (detail.value.trim() && !detail.label.trim()) {
      issue(["basics", "details", index, "label"], "Name this detail, e.g. Nationality");
    }
  });
  resume.basics.links.forEach((link, index) => {
    if (link.label.trim() && !link.url.trim())
      issue(["basics", "links", index, "url"], "Add the link's address");
  });
});
