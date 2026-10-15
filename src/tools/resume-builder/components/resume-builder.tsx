"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { PreviewCard } from "@/components/document/preview-card";
import { DocumentList } from "@/components/tool/document-list";
import { DocumentToolbar } from "@/components/tool/document-toolbar";
import { ExportedBanner } from "@/components/tool/exported-banner";
import { ExampleBanner } from "@/components/tool/example-banner";
import { FormAlert } from "@/components/tool/form";
import { ToolGate } from "@/components/tool/tool-gate";
import { ToolWorkspace, type WorkspaceTab } from "@/components/tool/tool-workspace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  exampleFromQuery,
  loadDocumentLibrary,
  templateFromQuery,
  useDocumentLibrary,
} from "@/hooks/use-document-library";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { WebPage } from "@/lib/document/web";
import { createResume, withFreshIds } from "../defaults";
import { RESUME_EXAMPLES } from "../examples";
import { renderResumePdf } from "../export";
import { prepareResume } from "../lib/prepare";
import { SAMPLE_RESUME } from "../sample";
import { resumeExportSchema, type Resume } from "../schema";
import { resumeStore } from "../store";
import { getTemplate, RESUME_TEMPLATES, ResumeDocument } from "../templates";
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  LanguageLevelOptions,
  LanguagesSection,
  PersonalSection,
  ProjectsSection,
  SectionsSection,
  CustomSectionsSection,
  SkillsSection,
  SummarySection,
} from "./editor-sections";
import { ResumeTemplateGallery } from "./template-gallery";

/** Entry point: waits for the browser, then opens the editor. */
export function ResumeBuilder() {
  return <ToolGate label="resume builder" render={(query) => <ResumeBuilderApp query={query} />} />;
}

function loadInitialState(query: URLSearchParams) {
  const templateId = templateFromQuery(query, RESUME_TEMPLATES);
  const example = exampleFromQuery(query, RESUME_EXAMPLES);
  return loadDocumentLibrary(resumeStore, {
    create: () => createResume(templateId),
    // An example chosen on a landing page opens as a new resume next to the saved ones.
    startWith: example && withFreshIds(example.document),
    patch: (resume) => (templateId ? { ...resume, templateId } : resume),
  });
}

function ResumeBuilderApp({ query }: { query: URLSearchParams }) {
  const [initial] = useState(() => loadInitialState(query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "resumes" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const form = useForm<Resume>({
    resolver: zodResolver(resumeExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: resumeStore,
    form,
    initial,
    noun: "resumes",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderResumePdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
    onExported: (mode) => setExported(mode === "download"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const handleNew = () => library.create(createResume(form.getValues("templateId")));

  const loadExample = () => {
    form.reset({ ...withFreshIds(SAMPLE_RESUME), templateId: form.getValues("templateId") });
    library.flushSave();
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && <ExportedBanner toolSlug={"resume-builder"} onDismiss={() => setExported(false)} />
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My resumes"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("resumes")}
            newLabel="New resume"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <ResumeExampleBanner control={form.control} onLoad={loadExample} />
            <PersonalSection />
            <SummarySection />
            <ExperienceSection />
            <EducationSection />
            <SkillsSection />
            <ProjectsSection />
            <CertificationsSection />
            <LanguagesSection />
            <CustomSectionsSection />
            <SectionsSection />
            <LanguageLevelOptions />
          </form>
        }
        preview={<ResumePreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a template"
          description="Every template is free. Your details carry over - switch any time."
          className="max-w-5xl"
        >
          <ResumeTemplateGallery
            resume={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "resumes"} onOpenChange={(open) => setDialog(open ? "resumes" : null)}>
        <DialogContent
          title="My resumes"
          description="Saved automatically on this device. Make a copy to tailor a resume for each job."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New resume
            </Button>
          }
        >
          <DocumentList
            noun="resume"
            items={library.collection.documents.map(({ id, data: resume, updatedAt }) => ({
              id,
              updatedAt,
              title: resume.basics.name || "Untitled resume",
              details: `${resume.basics.headline || "No job title"} · ${getTemplate(resume.templateId).name}`,
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) => library.duplicate(id, withFreshIds)}
            onDelete={(id) => {
              const name = library.collection.documents.find((doc) => doc.id === id)?.data.basics.name;
              library.remove(id, {
                label: name ? `${name}'s resume` : "this resume",
                createFallback: () => createResume(form.getValues("templateId")),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

/**
 * Offers sample content while the resume is completely empty, so the preview isn't a blank page.
 * Hidden as soon as anything is typed, because loading the example replaces the form.
 */
function ResumeExampleBanner({ control, onLoad }: { control: Control<Resume>; onLoad: () => void }) {
  const resume = useWatch({ control }) as Resume;
  const prepared = useMemo(() => prepareResume(resume), [resume]);
  if (prepared.name || prepared.headline || prepared.contacts.length || prepared.sections.length) return null;
  return <ExampleBanner noun="resume" onLoad={onLoad} />;
}

function ResumePreview({ control }: { control: Control<Resume> }) {
  const resume = useWatch({ control }) as Resume;
  const prepared = useMemo(() => prepareResume(resume), [resume]);
  return (
    <PreviewCard>
      <ResumeDocument templateId={resume.templateId} resume={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
