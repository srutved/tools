"use client";

/**
 * Building blocks shared by every resume layout. Layouts decide *where* things go; these decide
 * *what* is shown and how entries read, so every template presents the same content consistently.
 * Each block takes a Tone, so it works on white pages and on coloured sidebars alike.
 */

import type { ReactNode } from "react";
import { Image, Link, Text, View, type DocStyle } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { ContactItem, PreparedResume, PreparedSection } from "../lib/prepare";
import type { SectionId } from "../schema";

export const PAGE_MARGIN = 40;
export const BODY_SIZE = 9.5;

export function pageStyle(theme: DocumentTheme): DocStyle {
  return { fontFamily: theme.font, color: INK.text };
}

/** Colours for one area of the page. */
export interface Tone {
  text: string;
  muted: string;
  accent: string;
  rule: string;
  /** Background of skill tags. */
  chip: string;
}

export const lightTone = (theme: DocumentTheme): Tone => ({
  text: INK.text,
  muted: INK.muted,
  accent: theme.accent,
  rule: INK.border,
  chip: tint(theme.accent, 0.9),
});

/** For text on the accent colour, e.g. a coloured sidebar or header band. */
export const accentTone = (theme: DocumentTheme): Tone => ({
  text: theme.onAccent,
  muted: tint(theme.accent, 0.72),
  accent: theme.onAccent,
  rule: tint(theme.accent, 0.3),
  chip: tint(theme.accent, 0.18),
});

/** Sections each two-column layout puts in its narrow column. */
export const SIDE_SECTIONS: readonly SectionId[] = ["skills", "languages", "certifications"];

/**
 * Splits the user's ordered sections into main and side columns. Custom sections go where the
 * user placed them.
 */
export function splitSections(resume: PreparedResume, side: readonly SectionId[]) {
  const isSide = (section: PreparedSection) =>
    section.kind === "custom" ? section.placement === "side" : side.includes(section.kind);
  return {
    main: resume.sections.filter((section) => !isSide(section)),
    side: resume.sections.filter(isSide),
  };
}

/* ---------------------------------------------------------------- Header pieces */

export function Photo({ src, size, borderColor }: { src: string; size: number; borderColor?: string }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt="Profile photo"
      style={[
        { width: size, height: size, borderRadius: size / 2, objectFit: "cover" },
        borderColor ? { borderWidth: 2, borderColor } : null,
      ]}
    />
  );
}

/** Contact details on one wrapping line, separated by dots. */
export function ContactLine({
  contacts,
  tone,
  align = "left",
}: {
  contacts: ContactItem[];
  tone: Tone;
  align?: "left" | "center";
}) {
  if (contacts.length === 0) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        marginTop: 6,
      }}
    >
      {contacts.map((contact, index) => (
        <View key={`${contact.kind}-${index}`} style={{ flexDirection: "row" }}>
          <ContactText contact={contact} color={tone.text} inline />
          {index < contacts.length - 1 && <Text style={{ color: tone.muted, marginHorizontal: 5 }}>·</Text>}
        </View>
      ))}
    </View>
  );
}

function ContactText({ contact, color, inline }: { contact: ContactItem; color: string; inline?: boolean }) {
  // Custom details read "Nationality: Indian" inline; stacked lists show the label as a caption.
  const value = inline && contact.kind === "detail" ? `${contact.label}: ${contact.text}` : contact.text;
  const text = <Text style={{ color }}>{value}</Text>;
  return contact.href ? (
    <Link href={contact.href} style={{ color }}>
      {text}
    </Link>
  ) : (
    text
  );
}

const CONTACT_LABELS: Record<ContactItem["kind"], string> = {
  email: "Email",
  phone: "Phone",
  location: "Location",
  link: "Website",
  detail: "Detail",
};

/** Contact details stacked with small captions, for narrow columns. */
export function ContactList({ contacts, tone }: { contacts: ContactItem[]; tone: Tone }) {
  return (
    <View>
      {contacts.map((contact, index) => (
        <View key={`${contact.kind}-${index}`} style={{ marginBottom: 6 }}>
          <Text style={{ fontSize: 7.5, color: tone.muted }}>
            {contact.label ?? CONTACT_LABELS[contact.kind]}
          </Text>
          <ContactText contact={contact} color={tone.text} />
        </View>
      ))}
    </View>
  );
}

/* ---------------------------------------------------------------- Entries */

export function Bullets({ items, tone }: { items: string[]; tone: Tone }) {
  return (
    <>
      {items.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", marginTop: 2 }}>
          <Text style={{ width: 10, flexShrink: 0, color: tone.accent, fontSize: BODY_SIZE }}>•</Text>
          <Text style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, fontSize: BODY_SIZE, color: tone.text }}>
            {item}
          </Text>
        </View>
      ))}
    </>
  );
}

interface EntryHeaderProps {
  title: string;
  /** e.g. "Company · Location". */
  subtitle?: string;
  /** Dates, shown on the right (or under the subtitle when stacked). */
  meta?: string;
  tone: Tone;
  /** Narrow columns: dates go on their own line instead of the right edge. */
  stacked?: boolean;
  /** Makes the title a link (projects). */
  link?: { text: string; href: string } | null;
}

export function EntryHeader({ title, subtitle, meta, tone, stacked, link }: EntryHeaderProps) {
  const titleText = (
    <Text style={{ fontSize: 10.5, fontWeight: 700, color: tone.text, lineHeight: 1.3 }}>{title || " "}</Text>
  );
  const metaText = meta ? (
    <Text style={{ fontSize: 8.5, color: tone.muted, ...(stacked ? {} : { textAlign: "right" }) }}>
      {meta}
    </Text>
  ) : null;

  return (
    <View>
      <View
        style={{ flexDirection: stacked ? "column" : "row", alignItems: stacked ? "stretch" : "flex-start" }}
      >
        <View style={stacked ? {} : { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 10 }}>
          {titleText}
          {subtitle && <Text style={{ color: tone.accent, fontSize: BODY_SIZE }}>{subtitle}</Text>}
          {link && (
            <Link href={link.href} style={{ color: tone.muted }}>
              <Text style={{ fontSize: 8.5, color: tone.muted }}>{link.text}</Text>
            </Link>
          )}
        </View>
        {!stacked && metaText && <View style={{ flexShrink: 0, maxWidth: 140 }}>{metaText}</View>}
      </View>
      {stacked && metaText}
    </View>
  );
}

const join = (...parts: string[]) => parts.filter(Boolean).join(" · ");

interface EntryData {
  id: string;
  header: Omit<EntryHeaderProps, "tone" | "stacked">;
  lines: string[];
  /** A muted line under the header, e.g. a grade. */
  extra?: string;
}

/**
 * One entry: header plus bullet points, rendered as a flat list of blocks (no wrapper) with the
 * header, the first bullet and - for the first entry - the section heading kept together.
 *
 * Flat matters: when a kept-together block is the only content of a wrapper that has to move to the
 * next page, the PDF engine keeps the wrapper where it is and squashes it instead. Keeping these
 * blocks directly inside the layout's section wrapper lets them move cleanly.
 */
function Entry({
  entry,
  tone,
  narrow,
  first,
  heading,
}: {
  entry: EntryData;
  tone: Tone;
  narrow: boolean;
  first: boolean;
  heading?: ReactNode;
}) {
  const [firstLine, ...rest] = entry.lines;
  return (
    <>
      <View keepTogether style={{ marginTop: first ? 0 : 9 }}>
        {heading}
        <EntryHeader {...entry.header} tone={tone} stacked={narrow} />
        {entry.extra && <Text style={{ color: tone.muted, fontSize: 8.5 }}>{entry.extra}</Text>}
        {firstLine && <Bullets items={[firstLine]} tone={tone} />}
      </View>
      <Bullets items={rest} tone={tone} />
    </>
  );
}

/** Entries of sections made of entries (jobs, schools...); null for compact sections. */
function sectionEntries(section: PreparedSection, resume: PreparedResume): EntryData[] | null {
  switch (section.kind) {
    case "experience":
      return resume.experience.map((job) => ({
        id: job.id,
        header: {
          title: job.role || job.company,
          subtitle: job.role ? join(job.company, job.location) : job.location,
          meta: job.dates,
        },
        lines: job.bullets,
      }));
    case "education":
      return resume.education.map((school) => ({
        id: school.id,
        header: {
          title: school.degree || school.school,
          subtitle: school.degree ? join(school.school, school.location) : school.location,
          meta: school.dates,
        },
        extra: school.score,
        lines: school.details,
      }));
    case "projects":
      return resume.projects.map((project) => ({
        id: project.id,
        header: { title: project.name, subtitle: project.subtitle, meta: project.date, link: project.link },
        lines: project.bullets,
      }));
    case "custom":
      return section.format === "entries"
        ? section.entries.map((entry) => ({
            id: entry.id,
            header: { title: entry.title, subtitle: entry.subtitle, meta: entry.date },
            lines: entry.bullets,
          }))
        : null;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- Sections */

export type SkillStyle = "rows" | "tags" | "stacked";

interface SectionProps {
  section: PreparedSection;
  resume: PreparedResume;
  tone: Tone;
  /** The layout's heading for this section. Always kept on the same page as the first content. */
  heading: ReactNode;
  /** Narrow column: entries stack their dates, skills and languages go one per line. */
  narrow?: boolean;
  skillStyle?: SkillStyle;
}

/**
 * One section: the layout's heading followed by its content, never with the heading left alone at
 * the bottom of a page. Render it directly inside a View that holds nothing else (see Entry).
 */
export function Section({
  section,
  resume,
  tone,
  heading,
  narrow = false,
  skillStyle = "rows",
}: SectionProps) {
  const entries = sectionEntries(section, resume);
  if (entries) {
    return entries.map((entry, index) => (
      <Entry
        key={entry.id}
        entry={entry}
        tone={tone}
        narrow={narrow}
        first={index === 0}
        heading={index === 0 ? heading : undefined}
      />
    ));
  }
  // Compact sections are short, so they move to the next page as one block.
  return (
    <View keepTogether>
      {heading}
      <CompactSectionBody
        section={section}
        resume={resume}
        tone={tone}
        narrow={narrow}
        skillStyle={skillStyle}
      />
    </View>
  );
}

function CompactSectionBody({
  section,
  resume,
  tone,
  narrow,
  skillStyle,
}: Omit<SectionProps, "heading"> & { narrow: boolean; skillStyle: SkillStyle }) {
  switch (section.kind) {
    case "summary":
      return <Paragraphs lines={[resume.summary]} tone={tone} />;

    case "skills":
      return <Skills resume={resume} tone={tone} style={skillStyle} narrow={narrow} />;

    case "certifications":
      return (
        <View>
          {resume.certifications.map((cert, index) => (
            <View key={cert.id} style={{ marginTop: index === 0 ? 0 : 5 }}>
              <Text style={{ fontSize: BODY_SIZE, fontWeight: 700, color: tone.text }}>{cert.name}</Text>
              {(cert.issuer || cert.date) && (
                <Text style={{ fontSize: 8.5, color: tone.muted }}>{join(cert.issuer, cert.date)}</Text>
              )}
            </View>
          ))}
        </View>
      );

    case "languages":
      return narrow ? (
        <View>
          {resume.languages.map((language) => (
            <View
              key={language.id}
              style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}
            >
              <Text style={{ fontSize: BODY_SIZE, color: tone.text, paddingRight: 6 }}>{language.name}</Text>
              {language.level && <Text style={{ fontSize: 8.5, color: tone.muted }}>{language.level}</Text>}
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: BODY_SIZE, color: tone.text }}>
          {resume.languages
            .map((language) => (language.level ? `${language.name} (${language.level})` : language.name))
            .join(" · ")}
        </Text>
      );

    case "custom":
      return section.format === "list" ? (
        <Bullets items={section.lines} tone={tone} />
      ) : (
        <Paragraphs lines={section.lines} tone={tone} />
      );

    default:
      return null;
  }
}

function Paragraphs({ lines, tone }: { lines: string[]; tone: Tone }) {
  return (
    <>
      {lines.map((line, index) => (
        <Text
          key={index}
          style={{ fontSize: BODY_SIZE, color: tone.text, lineHeight: 1.5, marginTop: index === 0 ? 0 : 4 }}
        >
          {line}
        </Text>
      ))}
    </>
  );
}

function Skills({
  resume,
  tone,
  style,
  narrow,
}: {
  resume: PreparedResume;
  tone: Tone;
  style: SkillStyle;
  narrow: boolean;
}) {
  if (style === "tags") {
    return (
      <View>
        {resume.skills.map((group, index) => (
          <View
            key={group.id}
            keepTogether
            style={[
              { marginTop: index === 0 ? 0 : 4 },
              !narrow && { flexDirection: "row", alignItems: "flex-start" },
            ]}
          >
            {group.name && (
              <Text
                style={[
                  { fontSize: 8.5, fontWeight: 700, color: tone.muted },
                  narrow ? { marginBottom: 3 } : { width: 92, flexShrink: 0, paddingRight: 8, paddingTop: 2 },
                ]}
              >
                {group.name}
              </Text>
            )}
            <View
              style={[
                { flexDirection: "row", flexWrap: "wrap" },
                !narrow && { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
              ]}
            >
              {group.skills.map((skill, skillIndex) => (
                <View
                  key={skillIndex}
                  style={{
                    backgroundColor: tone.chip,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 3,
                    marginRight: 4,
                    marginBottom: 3,
                  }}
                >
                  <Text style={{ fontSize: 8.5, lineHeight: 1.2, color: tone.text }}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (style === "stacked") {
    return (
      <View>
        {resume.skills.map((group, index) => (
          <View key={group.id} keepTogether style={{ marginTop: index === 0 ? 0 : 7 }}>
            {group.name && (
              <Text style={{ fontSize: 8.5, fontWeight: 700, color: tone.text, marginBottom: 1 }}>
                {group.name}
              </Text>
            )}
            <Text style={{ fontSize: 8.5, color: tone.muted, lineHeight: 1.45 }}>
              {group.skills.join(", ")}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // Rows: "Languages: TypeScript, Python" - the most ATS-friendly form.
  return (
    <View>
      {resume.skills.map((group) => (
        <View key={group.id} keepTogether style={{ flexDirection: "row", marginBottom: 2 }}>
          {group.name && (
            <Text
              style={{
                fontSize: BODY_SIZE,
                fontWeight: 700,
                color: tone.text,
                width: 92,
                flexShrink: 0,
                paddingRight: 8,
              }}
            >
              {group.name}
            </Text>
          )}
          <Text style={{ fontSize: BODY_SIZE, color: tone.text, flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
            {group.skills.join(", ")}
          </Text>
        </View>
      ))}
    </View>
  );
}
