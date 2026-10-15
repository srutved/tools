"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldRow, FormSection } from "@/components/tool/form";
import { TextAreaField, TextField } from "@/components/tool/form-fields";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import type { SavedDocument } from "@/lib/saved-documents";
import type { Resume } from "@/tools/resume-builder/schema";
import { resumeStore } from "@/tools/resume-builder/store";
import type { CoverLetter } from "../schema";

// The letter's sender details have exactly the resume's shape, so the resume editor's section is
// reused as is: same fields, photo handling and template-aware hints.
export { PersonalSection } from "@/tools/resume-builder/components/editor-sections";

/** Fills the sender details and design from one of the user's saved resumes. */
export function ResumeImportCard({ onImport }: { onImport: (resume: Resume) => void }) {
  const [resumes] = useState<SavedDocument<Resume>[]>(() => resumeStore.load().documents);
  const [selectedId, setSelectedId] = useState(resumes[0]?.id ?? "");

  if (resumes.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
        <p className="text-sm text-muted">
          <span className="font-bold text-foreground">Have a resume?</span> Build it with our free resume
          builder and your details fill in here automatically, in a matching design.
        </p>
        <Link href="/resume-builder" className="text-sm font-semibold text-brand-strong hover:underline">
          Resume builder →
        </Link>
      </div>
    );
  }

  const selected = resumes.find((doc) => doc.id === selectedId);
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-sm">
        <span className="font-bold">Copy details from a resume.</span>{" "}
        <span className="text-muted">Fills in your name and contact details and matches its design.</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Select
          aria-label="Resume to copy from"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="w-auto min-w-0 flex-1"
        >
          {resumes.map(({ id, data }) => (
            <option key={id} value={id}>
              {[data.basics.name || "Untitled resume", data.basics.headline].filter(Boolean).join(" - ")}
            </option>
          ))}
        </Select>
        <Button variant="outline" onClick={() => selected && onImport(selected.data)} disabled={!selected}>
          <FileText /> Copy details
        </Button>
      </div>
    </div>
  );
}

export function RecipientSection() {
  return (
    <FormSection title="Recipient" description="Who you're writing to. Leave blank anything you don't know.">
      <FieldRow>
        <TextField<CoverLetter>
          name="recipient.name"
          label="Name"
          placeholder="e.g. Ms. Anita Rao"
          autoComplete="off"
        />
        <TextField<CoverLetter>
          name="recipient.title"
          label="Job title"
          placeholder="e.g. Head of Engineering"
          autoComplete="off"
        />
      </FieldRow>
      <TextField<CoverLetter>
        name="recipient.company"
        label="Company"
        placeholder="e.g. Brightpath Learning"
        autoComplete="off"
      />
      <TextAreaField<CoverLetter>
        name="recipient.address"
        label="Address (optional)"
        rows={2}
        placeholder={"e.g. 8th Floor, Prestige Tech Park\nBengaluru, Karnataka 560103"}
      />
    </FormSection>
  );
}

const BODY_PLACEHOLDER = [
  "Opening: the role you're applying for, and why this company.",
  "Middle: one or two achievements that prove you can do the job, with numbers.",
  "Fit: what you'd bring to their team or their customers specifically.",
  "Close: thank them and ask for a conversation.",
].join("\n\n");

export function LetterSection() {
  return (
    <FormSection title="Letter">
      <FieldRow>
        <TextField<CoverLetter> name="date" label="Date" type="date" />
        <TextField<CoverLetter>
          name="greeting"
          label="Greeting"
          placeholder="e.g. Dear Ms. Rao,"
          hint="Use their name if you know it."
        />
      </FieldRow>
      <TextField<CoverLetter>
        name="subject"
        label="Subject (optional)"
        placeholder="e.g. Application for Senior Product Designer"
      />
      <TextAreaField<CoverLetter>
        name="body"
        label="Your letter"
        rows={16}
        placeholder={BODY_PLACEHOLDER}
        hint="Separate paragraphs with a blank line. Three or four short paragraphs - under one page - works best."
      />
      <TextField<CoverLetter> name="closing" label="Sign-off" placeholder="e.g. Sincerely," />
    </FormSection>
  );
}
