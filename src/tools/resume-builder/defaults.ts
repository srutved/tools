import { createId } from "@/lib/utils";
import {
  SECTION_IDS,
  type Certification,
  type CustomEntry,
  type CustomSection,
  type Education,
  type Experience,
  type Language,
  type PersonalDetail,
  type Project,
  type Resume,
  type ResumeLink,
  type SkillGroup,
} from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const createLink = (): ResumeLink => ({ id: createId(), label: "", url: "" });

export const createExperience = (): Experience => ({
  id: createId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export const createEducation = (): Education => ({
  id: createId(),
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
  score: "",
  description: "",
});

export const createSkillGroup = (): SkillGroup => ({ id: createId(), name: "", skills: "" });

export const createProject = (): Project => ({
  id: createId(),
  name: "",
  subtitle: "",
  link: "",
  date: "",
  description: "",
});

export const createCertification = (): Certification => ({ id: createId(), name: "", issuer: "", date: "" });

export const createLanguage = (): Language => ({ id: createId(), name: "", level: "" });

export const createPersonalDetail = (): PersonalDetail => ({ id: createId(), label: "", value: "" });

export const createCustomEntry = (): CustomEntry => ({
  id: createId(),
  title: "",
  subtitle: "",
  date: "",
  description: "",
});

export const createCustomSection = (): CustomSection => ({
  id: createId(),
  title: "",
  format: "entries",
  placement: "main",
  text: "",
  entries: [createCustomEntry()],
});

/** A blank resume with one empty entry in the main sections, ready to fill in. */
export function createResume(templateId: string = DEFAULT_TEMPLATE_ID): Resume {
  return {
    templateId,
    basics: {
      name: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      photo: "",
      links: [createLink()],
      details: [],
    },
    summary: "",
    experience: [createExperience()],
    education: [createEducation()],
    skills: [createSkillGroup()],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
    sectionOrder: [...SECTION_IDS],
    sectionTitles: {},
    hiddenSections: [],
  };
}

/**
 * Gives every list entry a fresh id, so a copied resume never shares list keys with the original.
 * Custom sections keep theirs: section order, titles and visibility refer to them by id.
 */
export function withFreshIds(resume: Resume): Resume {
  const fresh = <T extends { id: string }>(entries: T[]) =>
    entries.map((entry) => ({ ...entry, id: createId() }));
  return {
    ...resume,
    basics: { ...resume.basics, links: fresh(resume.basics.links), details: fresh(resume.basics.details) },
    experience: fresh(resume.experience),
    education: fresh(resume.education),
    skills: fresh(resume.skills),
    projects: fresh(resume.projects),
    certifications: fresh(resume.certifications),
    languages: fresh(resume.languages),
    customSections: resume.customSections.map((section) => ({ ...section, entries: fresh(section.entries) })),
  };
}
