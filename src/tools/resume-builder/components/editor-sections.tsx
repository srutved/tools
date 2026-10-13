"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { EntryList } from "@/components/tool/entry-list";
import { FieldRow, FormSection } from "@/components/tool/form";
import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/tool/form-fields";
import { ImageField } from "@/components/tool/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createCertification,
  createCustomEntry,
  createCustomSection,
  createEducation,
  createExperience,
  createLanguage,
  createLink,
  createPersonalDetail,
  createProject,
  createSkillGroup,
} from "../defaults";
import { normalizeSectionOrder } from "../lib/prepare";
import { customSectionKey, SECTION_TITLES, type Resume, type SectionId } from "../schema";
import { getTemplate, LAYOUT_FEATURES } from "../templates";

const join = (...parts: string[]) => parts.filter((part) => part?.trim()).join(" at ");

/* ---------------------------------------------------------------- Personal details */

function LinkList() {
  const { control } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({ control, name: "basics.links", keyName: "key" });
  return (
    <PairRows
      title="Links"
      hint="LinkedIn, portfolio, GitHub or a personal website."
      addLabel="Add link"
      keys={fields.map((field) => field.key)}
      onAdd={() => append(createLink())}
      onRemove={remove}
      renderRow={(index) => (
        <>
          <TextField<Resume> name={`basics.links.${index}.label`} label="Name" placeholder="e.g. LinkedIn" />
          <TextField<Resume>
            name={`basics.links.${index}.url`}
            label="Address"
            type="url"
            placeholder="e.g. linkedin.com/in/yourname"
          />
        </>
      )}
    />
  );
}

function DetailList() {
  const { control } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({ control, name: "basics.details", keyName: "key" });
  return (
    <PairRows
      title="Additional details"
      hint="Optional. Anything else employers in your country expect, such as nationality or visa status."
      addLabel="Add detail"
      keys={fields.map((field) => field.key)}
      onAdd={() => append(createPersonalDetail())}
      onRemove={remove}
      renderRow={(index) => (
        <>
          <TextField<Resume>
            name={`basics.details.${index}.label`}
            label="Detail"
            placeholder="e.g. Nationality"
          />
          <TextField<Resume> name={`basics.details.${index}.value`} label="Value" placeholder="e.g. Indian" />
        </>
      )}
    />
  );
}

/** A short list of two-field rows with add and remove buttons. */
function PairRows({
  title,
  hint,
  addLabel,
  keys,
  onAdd,
  onRemove,
  renderRow,
}: {
  title: string;
  hint: string;
  addLabel: string;
  keys: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderRow: (index: number) => ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mb-2 text-xs text-muted">{hint}</p>
      <div className="space-y-3">
        {keys.map((key, index) => (
          <div key={key} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              {renderRow(index)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-7"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${title.toLowerCase()} row ${index + 1}`}
            >
              <Trash2 className="text-muted" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-3" onClick={onAdd}>
        <Plus /> {addLabel}
      </Button>
    </div>
  );
}

export function PersonalSection() {
  const templateId = useWatch<Resume, "templateId">({ name: "templateId" });
  const template = getTemplate(templateId);
  const showsPhoto = LAYOUT_FEATURES[template.layout].photo;

  return (
    <FormSection title="Personal details">
      <ImageField<Resume>
        name="basics.photo"
        label="Photo (optional)"
        variant="photo"
        hint={
          showsPhoto
            ? "Stays on your device. Many employers in the US, UK and Canada prefer resumes without one."
            : `${template.name} doesn't show photos. Pick a Modern, Sidebar or Split template to include it.`
        }
      />
      <FieldRow>
        <TextField<Resume>
          name="basics.name"
          label="Full name"
          placeholder="e.g. Priya Sharma"
          autoComplete="name"
        />
        <TextField<Resume>
          name="basics.headline"
          label="Job title"
          placeholder="e.g. Product Designer"
          autoComplete="organization-title"
        />
      </FieldRow>
      <FieldRow>
        <TextField<Resume>
          name="basics.email"
          label="Email"
          type="email"
          placeholder="e.g. priya@example.com"
          autoComplete="email"
        />
        <TextField<Resume>
          name="basics.phone"
          label="Phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          autoComplete="tel"
        />
      </FieldRow>
      <TextField<Resume>
        name="basics.location"
        label="Location"
        placeholder="e.g. Pune, India"
        autoComplete="address-level2"
      />
      <LinkList />
      <DetailList />
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Summary */

export function SummarySection() {
  return (
    <FormSection title="Professional summary">
      <TextAreaField<Resume>
        name="summary"
        label="Summary"
        rows={4}
        placeholder="e.g. Product designer with 5 years of experience turning complex workflows into simple, accessible apps. Led design for two products from launch to 1M+ users."
        hint="2-3 sentences: who you are, your experience and what you're best at."
      />
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Experience */

function ExperienceFields({ index }: { index: number }) {
  const current = useWatch<Resume, `experience.${number}.current`>({ name: `experience.${index}.current` });

  return (
    <>
      <FieldRow>
        <TextField<Resume>
          name={`experience.${index}.role`}
          label="Job title"
          placeholder="e.g. Marketing Manager"
        />
        <TextField<Resume>
          name={`experience.${index}.company`}
          label="Company"
          placeholder="e.g. Acme Corp"
        />
      </FieldRow>
      <FieldRow className="sm:grid-cols-3">
        <TextField<Resume>
          name={`experience.${index}.location`}
          label="Location"
          placeholder="e.g. Mumbai or Remote"
        />
        <TextField<Resume> name={`experience.${index}.startDate`} label="Start" placeholder="e.g. Jan 2022" />
        {current ? (
          <div>
            <p className="mb-1.5 text-sm font-semibold">End</p>
            <p className="flex h-10 items-center rounded-md bg-subtle px-3 text-sm text-muted">Present</p>
          </div>
        ) : (
          <TextField<Resume> name={`experience.${index}.endDate`} label="End" placeholder="e.g. Mar 2024" />
        )}
      </FieldRow>
      <CheckboxField<Resume> name={`experience.${index}.current`} label="I currently work here" />
      <TextAreaField<Resume>
        name={`experience.${index}.description`}
        label="Achievements"
        rows={5}
        placeholder={
          "e.g. Grew organic traffic 3x in 12 months through an SEO content programme\nLed a team of 4 to launch the company's first mobile app"
        }
        hint="One per line - each becomes a bullet point. Start with a verb and include numbers."
      />
    </>
  );
}

export function ExperienceSection() {
  return (
    <EntryList<Resume, "experience">
      name="experience"
      title="Experience"
      addLabel="Add job"
      create={createExperience}
      summarize={(job) => join(job.role, job.company)}
      fallbackTitle="New job"
      renderFields={(index) => <ExperienceFields index={index} />}
      emptyText="Add your jobs, internships or freelance work, most recent first."
    />
  );
}

/* ---------------------------------------------------------------- Education */

export function EducationSection() {
  return (
    <EntryList<Resume, "education">
      name="education"
      title="Education"
      addLabel="Add education"
      create={createEducation}
      summarize={(school) => join(school.degree, school.school)}
      fallbackTitle="New education"
      emptyText="Add your degrees, diplomas or courses."
      renderFields={(index) => (
        <>
          <FieldRow>
            <TextField<Resume>
              name={`education.${index}.degree`}
              label="Degree"
              placeholder="e.g. B.Sc. Computer Science"
            />
            <TextField<Resume>
              name={`education.${index}.school`}
              label="School or university"
              placeholder="e.g. University of Delhi"
            />
          </FieldRow>
          <FieldRow>
            <TextField<Resume>
              name={`education.${index}.location`}
              label="Location"
              placeholder="e.g. New Delhi"
            />
            <TextField<Resume>
              name={`education.${index}.score`}
              label="Grade (optional)"
              placeholder="e.g. GPA 3.8/4 or 85%"
            />
          </FieldRow>
          <FieldRow>
            <TextField<Resume> name={`education.${index}.startDate`} label="Start" placeholder="e.g. 2019" />
            <TextField<Resume> name={`education.${index}.endDate`} label="End" placeholder="e.g. 2023" />
          </FieldRow>
          <TextAreaField<Resume>
            name={`education.${index}.description`}
            label="Details (optional)"
            rows={2}
            placeholder={"e.g. Dean's list, 2022\nThesis: Machine learning for crop yield prediction"}
            hint="Honours, relevant coursework or a thesis. One per line."
          />
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- Skills */

export function SkillsSection() {
  return (
    <EntryList<Resume, "skills">
      name="skills"
      title="Skills"
      description="Group related skills, e.g. Languages, Tools, Soft skills."
      addLabel="Add group"
      create={createSkillGroup}
      summarize={(group) => group.name || group.skills}
      fallbackTitle="New skill group"
      renderFields={(index) => (
        <FieldRow className="sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <TextField<Resume>
            name={`skills.${index}.name`}
            label="Group (optional)"
            placeholder="e.g. Tools"
          />
          <TextField<Resume>
            name={`skills.${index}.skills`}
            label="Skills"
            placeholder="e.g. Figma, Excel, SQL"
            hint="Separate with commas."
          />
        </FieldRow>
      )}
    />
  );
}

/* ---------------------------------------------------------------- Projects */

export function ProjectsSection() {
  return (
    <EntryList<Resume, "projects">
      name="projects"
      title="Projects"
      addLabel="Add project"
      create={createProject}
      summarize={(project) => project.name}
      fallbackTitle="New project"
      emptyText="Optional. Great for students, career changers and developers."
      renderFields={(index) => (
        <>
          <FieldRow>
            <TextField<Resume>
              name={`projects.${index}.name`}
              label="Project name"
              placeholder="e.g. Expense Tracker App"
            />
            <TextField<Resume>
              name={`projects.${index}.subtitle`}
              label="Role or tools (optional)"
              placeholder="e.g. React, Firebase"
            />
          </FieldRow>
          <FieldRow>
            <TextField<Resume>
              name={`projects.${index}.link`}
              label="Link (optional)"
              type="url"
              placeholder="e.g. github.com/you/project"
            />
            <TextField<Resume>
              name={`projects.${index}.date`}
              label="Date (optional)"
              placeholder="e.g. 2024"
            />
          </FieldRow>
          <TextAreaField<Resume>
            name={`projects.${index}.description`}
            label="Description"
            rows={3}
            placeholder={
              "e.g. Built a budgeting app used by 500+ students\nAdded bank sync with the Plaid API"
            }
            hint="One point per line - what you built and the result."
          />
        </>
      )}
    />
  );
}

/* ---------------------------------------------------------------- Certifications & languages */

export function CertificationsSection() {
  return (
    <EntryList<Resume, "certifications">
      name="certifications"
      title="Certifications"
      addLabel="Add"
      create={createCertification}
      summarize={(cert) => cert.name}
      fallbackTitle="New certification"
      emptyText="Optional. Licences and certificates."
      renderFields={(index) => (
        <FieldRow className="sm:grid-cols-3">
          <TextField<Resume>
            name={`certifications.${index}.name`}
            label="Name"
            placeholder="e.g. Google Analytics"
          />
          <TextField<Resume>
            name={`certifications.${index}.issuer`}
            label="Issued by"
            placeholder="e.g. Google"
          />
          <TextField<Resume> name={`certifications.${index}.date`} label="Date" placeholder="e.g. 2024" />
        </FieldRow>
      )}
    />
  );
}

const LANGUAGE_LEVELS = ["Native", "Fluent", "Professional", "Intermediate", "Basic"];

export function LanguagesSection() {
  return (
    <EntryList<Resume, "languages">
      name="languages"
      title="Languages"
      addLabel="Add language"
      create={createLanguage}
      summarize={(language) => [language.name, language.level].filter(Boolean).join(" - ")}
      fallbackTitle="New language"
      emptyText="Optional. Languages you speak and how well."
      renderFields={(index) => (
        <FieldRow>
          <TextField<Resume> name={`languages.${index}.name`} label="Language" placeholder="e.g. Spanish" />
          <TextField<Resume>
            name={`languages.${index}.level`}
            label="Level"
            placeholder="e.g. Fluent"
            list="language-levels"
          />
        </FieldRow>
      )}
    />
  );
}

/** Suggestions for the language level field (any text is allowed). */
export function LanguageLevelOptions() {
  return (
    <datalist id="language-levels">
      {LANGUAGE_LEVELS.map((level) => (
        <option key={level} value={level} />
      ))}
    </datalist>
  );
}

/* ---------------------------------------------------------------- Custom sections */

function CustomEntryFields({ section, index }: { section: number; index: number }) {
  const field = `customSections.${section}.entries.${index}` as const;
  return (
    <>
      <FieldRow>
        <TextField<Resume> name={`${field}.title`} label="Title" placeholder="e.g. Employee of the Year" />
        <TextField<Resume>
          name={`${field}.subtitle`}
          label="Subtitle (optional)"
          placeholder="e.g. Acme Corp"
        />
      </FieldRow>
      <TextField<Resume> name={`${field}.date`} label="Date (optional)" placeholder="e.g. 2023" />
      <TextAreaField<Resume>
        name={`${field}.description`}
        label="Details (optional)"
        rows={3}
        placeholder="e.g. Chosen from 400 employees for leading the CRM migration"
        hint="One point per line - each becomes a bullet point."
      />
    </>
  );
}

function CustomSectionFields({ index }: { index: number }) {
  const format = useWatch<Resume, `customSections.${number}.format`>({
    name: `customSections.${index}.format`,
  });

  return (
    <>
      <TextField<Resume>
        name={`customSections.${index}.title`}
        label="Section heading"
        placeholder="e.g. Awards, Volunteering, Publications"
      />
      <FieldRow>
        <SelectField<Resume> name={`customSections.${index}.format`} label="Format">
          <option value="entries">Entries (title, subtitle, date, points)</option>
          <option value="list">Bullet list</option>
          <option value="text">Paragraph</option>
        </SelectField>
        <SelectField<Resume>
          name={`customSections.${index}.placement`}
          label="Column"
          hint="Used by the Sidebar and Split templates."
        >
          <option value="main">Main column</option>
          <option value="side">Side column</option>
        </SelectField>
      </FieldRow>
      {format === "entries" ? (
        <EntryList<Resume, `customSections.${number}.entries`>
          bare
          name={`customSections.${index}.entries`}
          title="Entries"
          addLabel="Add entry"
          create={createCustomEntry}
          summarize={(entry) => entry.title}
          fallbackTitle="New entry"
          emptyText="Add the first entry."
          renderFields={(entryIndex) => <CustomEntryFields section={index} index={entryIndex} />}
        />
      ) : (
        <TextAreaField<Resume>
          name={`customSections.${index}.text`}
          label={format === "list" ? "Items" : "Text"}
          rows={4}
          placeholder={
            format === "list"
              ? "e.g. Ran 3 full marathons\nVolunteer teacher at a local school"
              : "e.g. Write a short paragraph. Each new line starts a new paragraph."
          }
          hint={format === "list" ? "One item per line - each becomes a bullet point." : undefined}
        />
      )}
    </>
  );
}

export function CustomSectionsSection() {
  return (
    <EntryList<Resume, "customSections">
      name="customSections"
      title="Custom sections"
      description="Add any section you need: awards, volunteering, publications, interests, references..."
      addLabel="Add section"
      create={createCustomSection}
      summarize={(section) => section.title}
      fallbackTitle="New section"
      renderFields={(index) => <CustomSectionFields index={index} />}
    />
  );
}

/* ---------------------------------------------------------------- Section order, headings, visibility */

export function SectionsSection() {
  const { setValue, register } = useFormContext<Resume>();
  const stored = useWatch<Resume, "sectionOrder">({ name: "sectionOrder" });
  const hidden = useWatch<Resume, "hiddenSections">({ name: "hiddenSections" }) ?? [];
  const customSections = useWatch<Resume, "customSections">({ name: "customSections" }) ?? [];
  const order = normalizeSectionOrder(
    stored ?? [],
    customSections.map((section) => section.id),
  );

  const move = (index: number, offset: -1 | 1) => {
    const next = [...order];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    setValue("sectionOrder", next, { shouldDirty: true });
  };

  const toggle = (key: string) =>
    setValue(
      "hiddenSections",
      hidden.includes(key) ? hidden.filter((item) => item !== key) : [...hidden, key],
      { shouldDirty: true },
    );

  return (
    <FormSection
      title="Sections"
      description="Rename, reorder or hide sections. Empty sections are left out automatically."
    >
      <ol className="divide-y divide-border rounded-lg border border-border">
        {order.map((key, index) => {
          const custom = customSections.find((section) => customSectionKey(section.id) === key);
          const defaultTitle = SECTION_TITLES[key as SectionId];
          const label = custom ? custom.title || "Untitled section" : defaultTitle;
          const isHidden = hidden.includes(key);
          return (
            <li key={key} className={cn("flex items-center gap-1 px-3 py-2", isHidden && "bg-subtle/60")}>
              <span className="w-6 shrink-0 text-sm text-muted">{index + 1}.</span>
              {custom ? (
                <span
                  className={cn("min-w-0 flex-1 truncate text-sm font-semibold", isHidden && "text-muted")}
                >
                  {label} <span className="font-normal text-muted">(custom)</span>
                </span>
              ) : (
                <Input
                  aria-label={`Heading for ${defaultTitle}`}
                  title="Rename this heading"
                  placeholder={defaultTitle}
                  className={cn("h-8 min-w-0 flex-1 font-semibold", isHidden && "text-muted")}
                  {...register(`sectionTitles.${key}`)}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => toggle(key)}
                aria-pressed={isHidden}
                aria-label={isHidden ? `Show ${label}` : `Hide ${label}`}
                title={isHidden ? "Hidden - click to show" : "Hide from resume"}
              >
                {isHidden ? <EyeOff className="text-muted" /> : <Eye />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${label} up`}
              >
                <ArrowUp />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                aria-label={`Move ${label} down`}
              >
                <ArrowDown />
              </Button>
            </li>
          );
        })}
      </ol>
    </FormSection>
  );
}
