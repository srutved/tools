import { todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import { createLink } from "@/tools/resume-builder/defaults";
import type { Basics } from "@/tools/resume-builder/schema";
import { DEFAULT_TEMPLATE_ID } from "@/tools/resume-builder/templates/registry";
import type { CoverLetter } from "./schema";

const EMPTY_BASICS: Basics = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  photo: "",
  links: [createLink()],
  details: [],
};

/** Copies of a resume's personal details with fresh list ids, so the two never share keys. */
export function copyBasics(basics: Basics): Basics {
  return {
    ...basics,
    links: basics.links.map((link) => ({ ...link, id: createId() })),
    details: basics.details.map((detail) => ({ ...detail, id: createId() })),
  };
}

/**
 * A blank cover letter dated today. Pass a resume's details and template to start from them, so
 * the letter matches the resume it goes with.
 */
export function createCoverLetter(from?: { basics: Basics; templateId: string }): CoverLetter {
  return {
    templateId: from?.templateId ?? DEFAULT_TEMPLATE_ID,
    basics: from ? copyBasics(from.basics) : { ...EMPTY_BASICS, links: [createLink()] },
    date: todayIso(),
    recipient: { name: "", title: "", company: "", address: "" },
    subject: "",
    greeting: "Dear Hiring Manager,",
    body: "",
    closing: "Sincerely,",
  };
}
