/**
 * Turns a resume as typed into what templates render: empty entries dropped, descriptions split into
 * bullet points, dates joined into ranges, links made clickable and sections put in order.
 * Templates only lay this out; they never parse or format anything themselves.
 */

import {
  customSectionKey,
  isBlankEntry,
  SECTION_IDS,
  SECTION_TITLES,
  type Certification,
  type CustomSection,
  type Language,
  type Resume,
  type SectionId,
} from "../schema";

export interface ContactItem {
  /** "detail" is a custom label and value, e.g. Nationality: Indian. */
  kind: "email" | "phone" | "location" | "link" | "detail";
  /** Shown on the resume, e.g. "linkedin.com/in/aarav". */
  text: string;
  /** Optional caption, e.g. "LinkedIn" (sidebar templates show it above the text). */
  label?: string;
  href?: string;
}

export interface PreparedExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface PreparedEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  dates: string;
  score: string;
  details: string[];
}

export interface PreparedSkillGroup {
  id: string;
  name: string;
  skills: string[];
}

export interface PreparedProject {
  id: string;
  name: string;
  subtitle: string;
  link: { text: string; href: string } | null;
  date: string;
  bullets: string[];
}

/** One item in a custom section ("entries" format). */
export interface PreparedCustomEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  bullets: string[];
}

/** A section as templates see it: what it is, its heading and, for custom sections, its content. */
export type PreparedSection =
  | { key: SectionId; kind: SectionId; title: string }
  | {
      key: string;
      kind: "custom";
      title: string;
      format: CustomSection["format"];
      placement: CustomSection["placement"];
      /** "list": one bullet per line. "text": paragraphs. */
      lines: string[];
      entries: PreparedCustomEntry[];
    };

export interface PreparedResume {
  name: string;
  headline: string;
  photo: string;
  contacts: ContactItem[];
  summary: string;
  experience: PreparedExperience[];
  education: PreparedEducation[];
  skills: PreparedSkillGroup[];
  projects: PreparedProject[];
  certifications: Certification[];
  languages: Language[];
  /** Visible sections with content, in the user's chosen order. */
  sections: PreparedSection[];
}

const BULLET_MARKER = /^\s*(?:[-*•▪◦·‣–]|\d+[.)])\s+/;

/** Splits text into non-empty lines, removing bullet markers people type or paste ("- ", "• ", "1. "). */
export function toBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(BULLET_MARKER, "").trim())
    .filter(Boolean);
}

/** Comma, semicolon or newline separated skills. */
export function toSkillList(text: string): string[] {
  return text
    .split(/[,;\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

/** "Jan 2022" + "" + current → "Jan 2022 – Present"; "2018" + "2022" → "2018 – 2022". */
export function formatDateRange(start: string, end: string, current = false): string {
  const from = start.trim();
  const to = current ? "Present" : end.trim();
  if (from && to) return from === to ? from : `${from} – ${to}`;
  return from || to;
}

/** "https://www.linkedin.com/in/aarav/" → "linkedin.com/in/aarav". */
export function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

/** Adds https:// to bare domains so links in the PDF are clickable. */
export function toHref(url: string): string {
  const trimmed = url.trim();
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Every section key in the user's order, repaired: unknown and repeated keys dropped, missing ones
 * (e.g. a newly added custom section) appended.
 */
export function normalizeSectionOrder(order: readonly string[], customIds: readonly string[] = []): string[] {
  const all = [...SECTION_IDS, ...customIds.map(customSectionKey)];
  return [...new Set([...order.filter((key) => all.includes(key)), ...all])];
}

/** A section's heading: the user's own name for it, or the default. */
export function sectionTitle(resume: Pick<Resume, "sectionTitles" | "customSections">, key: string): string {
  const custom = (resume.customSections ?? []).find((section) => customSectionKey(section.id) === key);
  if (custom) return custom.title.trim();
  return resume.sectionTitles?.[key]?.trim() || SECTION_TITLES[key as SectionId] || key;
}

const keep = <T extends object>(entries: T[] | undefined) =>
  (entries ?? []).filter((entry) => !isBlankEntry(entry));
const text = (value: string | undefined) => (value ?? "").trim();

/**
 * Lenient about missing fields, because the live preview renders while the user is still typing.
 */
export function prepareResume(resume: Resume): PreparedResume {
  const basics = resume.basics ?? ({} as Partial<Resume["basics"]>);
  const email = text(basics.email);
  const phone = text(basics.phone);
  const location = text(basics.location);

  const contacts: ContactItem[] = [
    ...(email ? [{ kind: "email" as const, text: email, href: `mailto:${email}` }] : []),
    ...(phone ? [{ kind: "phone" as const, text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` }] : []),
    ...(location ? [{ kind: "location" as const, text: location }] : []),
    ...keep(basics.links)
      .filter((link) => text(link.url))
      .map((link) => ({
        kind: "link" as const,
        text: displayUrl(link.url),
        label: text(link.label) || undefined,
        href: toHref(link.url),
      })),
    ...keep(basics.details)
      .filter((detail) => text(detail.value))
      .map((detail) => ({ kind: "detail" as const, text: text(detail.value), label: text(detail.label) })),
  ];

  const prepared: Omit<PreparedResume, "sections"> = {
    name: text(basics.name),
    headline: text(basics.headline),
    photo: basics.photo ?? "",
    contacts,
    summary: text(resume.summary),
    experience: keep(resume.experience).map((job) => ({
      id: job.id,
      role: text(job.role),
      company: text(job.company),
      location: text(job.location),
      dates: formatDateRange(job.startDate ?? "", job.endDate ?? "", job.current),
      bullets: toBullets(job.description ?? ""),
    })),
    education: keep(resume.education).map((school) => ({
      id: school.id,
      degree: text(school.degree),
      school: text(school.school),
      location: text(school.location),
      dates: formatDateRange(school.startDate ?? "", school.endDate ?? ""),
      score: text(school.score),
      details: toBullets(school.description ?? ""),
    })),
    skills: keep(resume.skills)
      .map((group) => ({ id: group.id, name: text(group.name), skills: toSkillList(group.skills ?? "") }))
      .filter((group) => group.skills.length > 0),
    projects: keep(resume.projects).map((project) => ({
      id: project.id,
      name: text(project.name),
      subtitle: text(project.subtitle),
      link: text(project.link) ? { text: displayUrl(project.link), href: toHref(project.link) } : null,
      date: text(project.date),
      bullets: toBullets(project.description ?? ""),
    })),
    certifications: keep(resume.certifications).map((cert) => ({
      ...cert,
      name: text(cert.name),
      issuer: text(cert.issuer),
      date: text(cert.date),
    })),
    languages: keep(resume.languages).map((language) => ({
      ...language,
      name: text(language.name),
      level: text(language.level),
    })),
  };

  const hasContent: Record<SectionId, boolean> = {
    summary: prepared.summary.length > 0,
    experience: prepared.experience.length > 0,
    education: prepared.education.length > 0,
    skills: prepared.skills.length > 0,
    projects: prepared.projects.length > 0,
    certifications: prepared.certifications.length > 0,
    languages: prepared.languages.length > 0,
  };

  const customSections = new Map(
    (resume.customSections ?? []).map((section) => [customSectionKey(section.id), section]),
  );
  const hidden = new Set(resume.hiddenSections ?? []);
  const order = normalizeSectionOrder(
    resume.sectionOrder ?? [],
    [...customSections.values()].map((s) => s.id),
  );

  const sections = order.flatMap((key): PreparedSection[] => {
    if (hidden.has(key)) return [];
    const custom = customSections.get(key);
    if (!custom) {
      const id = key as SectionId;
      return hasContent[id] ? [{ key: id, kind: id, title: sectionTitle(resume, id) }] : [];
    }
    const entries =
      custom.format === "entries"
        ? keep(custom.entries).map((entry) => ({
            id: entry.id,
            title: text(entry.title),
            subtitle: text(entry.subtitle),
            date: text(entry.date),
            bullets: toBullets(entry.description ?? ""),
          }))
        : [];
    const lines = custom.format === "entries" ? [] : toBullets(custom.text ?? "");
    if (entries.length === 0 && lines.length === 0) return [];
    return [
      {
        key,
        kind: "custom",
        title: text(custom.title),
        format: custom.format,
        placement: custom.placement,
        lines,
        entries,
      },
    ];
  });

  return { ...prepared, sections };
}
