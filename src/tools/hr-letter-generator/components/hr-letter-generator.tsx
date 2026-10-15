"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { PreviewCard } from "@/components/document/preview-card";
import { DocumentList } from "@/components/tool/document-list";
import { DocumentToolbar } from "@/components/tool/document-toolbar";
import { ExampleBanner } from "@/components/tool/example-banner";
import { ExportedBanner } from "@/components/tool/exported-banner";
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
import { formatDate } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { loadBusinessProfile } from "@/shared/business-profile";
import { createHrLetter, fromLetterExample, withFreshIds } from "../defaults";
import { HR_LETTER_EXAMPLES } from "../examples";
import { renderHrLetterPdf } from "../export";
import { letterTitle, prepareLetter } from "../lib/letters";
import { SAMPLE_HR_LETTER } from "../sample";
import { hrLetterExportSchema, type HrLetter } from "../schema";
import { hrLetterStore } from "../store";
import { LetterDocument } from "../templates/letter-document";
import { getTemplate, LETTER_TEMPLATES } from "../templates/registry";
import {
  CompanySection,
  CustomTermsSection,
  EmployeeSection,
  LetterTypeSection,
  PaySection,
  RoleSection,
  SignatorySection,
} from "./editor-sections";
import { LetterTemplateGallery } from "./template-gallery";

/** Entry point: waits for the browser, then opens the editor. */
export function HrLetterGenerator() {
  return <ToolGate label="HR letter generator" render={(query) => <HrLetterGeneratorApp query={query} />} />;
}

function loadInitialState(query: URLSearchParams) {
  const templateId = templateFromQuery(query, LETTER_TEMPLATES);
  const example = exampleFromQuery(query, HR_LETTER_EXAMPLES);
  return loadDocumentLibrary(hrLetterStore, {
    create: () => createHrLetter({ profile: loadBusinessProfile(), templateId }),
    // An example chosen on a landing page opens as a new letter next to the saved ones.
    startWith: example && fromLetterExample(example.document, loadBusinessProfile()),
    patch: (letter) => (templateId ? { ...letter, templateId } : letter),
  });
}

/** A new letter of the same kind, keeping the letterhead and signatory the user already filled in. */
function nextLetter(current: HrLetter): HrLetter {
  const blank = createHrLetter({
    kind: current.kind,
    currency: current.currency,
    templateId: current.templateId,
  });
  return { ...blank, company: current.company, signatory: current.signatory };
}

function HrLetterGeneratorApp({ query }: { query: URLSearchParams }) {
  const [initial] = useState(() => loadInitialState(query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "letters" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const form = useForm<HrLetter>({
    resolver: zodResolver(hrLetterExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: hrLetterStore,
    form,
    initial,
    noun: "letters",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderHrLetterPdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
    onExported: (mode) => setExported(mode === "download"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const handleNew = () => library.create(nextLetter(form.getValues()));

  // An example of the same kind of letter; the letterhead and signatory are kept when the user has their own.
  const loadExample = () => {
    const current = form.getValues();
    const internship = current.employmentType === "internship";
    const match =
      HR_LETTER_EXAMPLES.find(
        ({ document }) =>
          document.kind === current.kind && (document.employmentType === "internship") === internship,
      )?.document ?? SAMPLE_HR_LETTER;
    const example = fromLetterExample({ ...match, templateId: current.templateId });
    form.reset(
      current.company.name.trim()
        ? { ...example, company: current.company, signatory: current.signatory }
        : example,
    );
    library.flushSave();
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && <ExportedBanner toolSlug="hr-letter-generator" onDismiss={() => setExported(false)} />
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My letters"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("letters")}
            newLabel="New letter"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <EmptyLetterBanner control={form.control} onLoad={loadExample} />
            <LetterTypeSection />
            <CompanySection />
            <EmployeeSection />
            <RoleSection />
            <PaySection />
            <CustomTermsSection />
            <SignatorySection />
          </form>
        }
        preview={<LetterPreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a design"
          description="Every design is free and works for every kind of letter."
          className="max-w-5xl"
        >
          <LetterTemplateGallery
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
          title="My letters"
          description="Saved automatically on this device. Duplicate a letter to reuse it for someone else."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New letter
            </Button>
          }
        >
          <DocumentList
            noun="letter"
            items={library.collection.documents.map(({ id, data: letter, updatedAt }) => ({
              id,
              updatedAt,
              title: `${letterTitle(letter)} · ${letter.employee.name || "No name yet"}`,
              details: [letter.company.name, letter.letterDate && formatDate(letter.letterDate)]
                .filter(Boolean)
                .join(" · "),
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) => library.duplicate(id, withFreshIds)}
            onDelete={(id) => {
              const letter = library.collection.documents.find((doc) => doc.id === id)?.data;
              library.remove(id, {
                label: letter?.employee.name
                  ? `the ${letterTitle(letter).toLowerCase()} for ${letter.employee.name}`
                  : "this letter",
                createFallback: () => nextLetter(form.getValues()),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

/** Shown while the letter is still blank. */
function EmptyLetterBanner({ control, onLoad }: { control: Control<HrLetter>; onLoad: () => void }) {
  const employee = useWatch({ control, name: "employee.name" });
  const designation = useWatch({ control, name: "designation" });
  if (employee?.trim() || designation?.trim()) return null;
  return <ExampleBanner noun="letter" onLoad={onLoad} />;
}

function LetterPreview({ control }: { control: Control<HrLetter> }) {
  const letter = useWatch({ control }) as HrLetter;
  const prepared = useMemo(() => prepareLetter(letter), [letter]);
  return (
    <PreviewCard>
      <LetterDocument templateId={letter.templateId} letter={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
