"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { PreviewCard } from "@/components/document/preview-card";
import { DocumentList } from "@/components/tool/document-list";
import { DocumentToolbar } from "@/components/tool/document-toolbar";
import { ExampleBanner } from "@/components/tool/example-banner";
import { FormAlert } from "@/components/tool/form";
import { ToolWorkspace, type WorkspaceTab } from "@/components/tool/tool-workspace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadDocumentLibrary, templateFromQuery, useDocumentLibrary } from "@/hooks/use-document-library";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { WebPage } from "@/lib/document/web";
import type { Resume } from "@/tools/resume-builder/schema";
import { resumeStore } from "@/tools/resume-builder/store";
import { getTemplate, RESUME_TEMPLATES } from "@/tools/resume-builder/templates";
import { copyBasics, createCoverLetter } from "../defaults";
import { renderCoverLetterPdf } from "../export";
import { prepareCoverLetter } from "../lib/prepare";
import { SAMPLE_COVER_LETTER } from "../sample";
import { coverLetterExportSchema, type CoverLetter } from "../schema";
import { coverLetterStore } from "../store";
import { CoverLetterDocument } from "../templates/cover-letter-document";
import { LetterSection, PersonalSection, RecipientSection, ResumeImportCard } from "./editor-sections";
import { CoverLetterTemplateGallery } from "./template-gallery";

/** Entry point. Renders a placeholder on the server; the editor itself needs the browser's storage. */
export function CoverLetterBuilder() {
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-subtle/60 text-muted">
        <LoaderCircle className="mr-2 size-5 animate-spin" aria-hidden /> Loading the cover letter builder…
      </div>
    );
  }
  return <CoverLetterBuilderApp />;
}

/** A new letter starts from the most recently edited resume, so it matches it out of the box. */
function newLetter(templateId?: string): CoverLetter {
  const resume = resumeStore.load().documents[0]?.data;
  const letter = createCoverLetter(resume);
  return templateId ? { ...letter, templateId } : letter;
}

function loadInitialState() {
  const templateId = templateFromQuery(RESUME_TEMPLATES);
  return loadDocumentLibrary(coverLetterStore, {
    create: () => newLetter(templateId),
    patch: (letter) => (templateId ? { ...letter, templateId } : letter),
  });
}

function CoverLetterBuilderApp() {
  const [initial] = useState(loadInitialState);
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "letters" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const form = useForm<CoverLetter>({
    resolver: zodResolver(coverLetterExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: coverLetterStore,
    form,
    initial,
    noun: "cover letters",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderCoverLetterPdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const handleNew = () => library.create(newLetter());

  // reset() rather than setValue(), so the links list re-renders with the new entries.
  const replaceWith = (letter: CoverLetter) => {
    form.reset(letter);
    library.flushSave();
  };
  const importResume = (resume: Resume) =>
    replaceWith({ ...form.getValues(), basics: copyBasics(resume.basics), templateId: resume.templateId });
  // The example fills the letter; the sender details are kept when the user already has their own.
  const loadExample = () => {
    const current = form.getValues();
    const basics = current.basics.name.trim() ? current.basics : copyBasics(SAMPLE_COVER_LETTER.basics);
    replaceWith({ ...SAMPLE_COVER_LETTER, basics, templateId, date: current.date });
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My cover letters"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("letters")}
            newLabel="New cover letter"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <EmptyLetterBanner control={form.control} onLoad={loadExample} />
            <ResumeImportCard onImport={importResume} />
            <PersonalSection />
            <RecipientSection />
            <LetterSection />
          </form>
        }
        preview={<CoverLetterPreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a design"
          description="Every design matches the resume template of the same name. Switch any time."
          className="max-w-5xl"
        >
          <CoverLetterTemplateGallery
            letter={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "letters"} onOpenChange={(open) => setDialog(open ? "letters" : null)}>
        <DialogContent
          title="My cover letters"
          description="Saved automatically on this device. Duplicate one to tailor it for another job."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New cover letter
            </Button>
          }
        >
          <DocumentList
            noun="cover letter"
            items={library.collection.documents.map(({ id, data: letter, updatedAt }) => ({
              id,
              updatedAt,
              title: letter.recipient.company || letter.subject || "Untitled cover letter",
              details: `${letter.basics.name || "No name yet"} · ${getTemplate(letter.templateId).name}`,
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) =>
              library.duplicate(id, (letter) => ({ ...letter, basics: copyBasics(letter.basics) }))
            }
            onDelete={(id) => {
              const letter = library.collection.documents.find((doc) => doc.id === id)?.data;
              library.remove(id, {
                label: letter?.recipient.company
                  ? `the letter to ${letter.recipient.company}`
                  : "this cover letter",
                createFallback: () => newLetter(form.getValues("templateId")),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

/** Shown while the letter itself is still empty. */
function EmptyLetterBanner({ control, onLoad }: { control: Control<CoverLetter>; onLoad: () => void }) {
  const body = useWatch({ control, name: "body" });
  const company = useWatch({ control, name: "recipient.company" });
  if (body?.trim() || company?.trim()) return null;
  return <ExampleBanner noun="cover letter" onLoad={onLoad} />;
}

function CoverLetterPreview({ control }: { control: Control<CoverLetter> }) {
  const letter = useWatch({ control }) as CoverLetter;
  const prepared = useMemo(() => prepareCoverLetter(letter), [letter]);
  return (
    <PreviewCard>
      <CoverLetterDocument templateId={letter.templateId} letter={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
