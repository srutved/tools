"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { PreviewCard } from "@/components/document/preview-card";
import { DocumentList } from "@/components/tool/document-list";
import { DocumentToolbar } from "@/components/tool/document-toolbar";
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
import { guessCurrencyFromLocale } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { loadBusinessProfile } from "@/shared/business-profile";
import { createContract, fromContractExample, withFreshIds } from "../defaults";
import { CONTRACT_EXAMPLES } from "../examples";
import { renderContractPdf } from "../export";
import { defaultTitle, prepareContract } from "../lib/clauses";
import { contractExportSchema, type Contract } from "../schema";
import { contractStore } from "../store";
import { ContractDocument } from "../templates/contract-document";
import { CONTRACT_TEMPLATES, getTemplate } from "../templates/registry";
import {
  ContractTypeSection,
  CustomClausesSection,
  LegalNotice,
  NdaSection,
  PartiesSections,
  PaymentSection,
  TermsSection,
  WorkSection,
} from "./editor-sections";
import { ContractTemplateGallery } from "./template-gallery";

/** Entry point: waits for the browser, then opens the editor. */
export function ContractGenerator() {
  return <ToolGate label="contract generator" render={(query) => <ContractGeneratorApp query={query} />} />;
}

function loadInitialState(query: URLSearchParams) {
  const templateId = templateFromQuery(query, CONTRACT_TEMPLATES);
  const example = exampleFromQuery(query, CONTRACT_EXAMPLES);
  return loadDocumentLibrary(contractStore, {
    create: () =>
      createContract({
        profile: loadBusinessProfile(),
        currency: guessCurrencyFromLocale(navigator.language),
        templateId,
      }),
    // An example chosen on a landing page opens as a new contract next to the saved ones.
    startWith: example && fromContractExample(example.document, loadBusinessProfile()),
    patch: (contract) => (templateId ? { ...contract, templateId } : contract),
  });
}

function ContractGeneratorApp({ query }: { query: URLSearchParams }) {
  const [initial] = useState(() => loadInitialState(query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "contracts" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const form = useForm<Contract>({
    resolver: zodResolver(contractExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: contractStore,
    form,
    initial,
    noun: "contracts",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderContractPdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
    onExported: (mode) => setExported(mode === "download"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const kind = useWatch({ control: form.control, name: "kind" });

  const handleNew = () => {
    const current = form.getValues();
    library.create(
      createContract({
        kind: current.kind,
        profile: loadBusinessProfile(),
        currency: current.payment.currency,
        templateId: current.templateId,
      }),
    );
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && <ExportedBanner toolSlug="contract-generator" onDismiss={() => setExported(false)} />
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My contracts"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("contracts")}
            newLabel="New contract"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <LegalNotice />
            <ContractTypeSection />
            <PartiesSections />
            {kind === "nda" ? (
              <NdaSection />
            ) : (
              <>
                <WorkSection />
                <PaymentSection />
              </>
            )}
            <TermsSection />
            <CustomClausesSection />
          </form>
        }
        preview={<ContractPreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a design"
          description="Every design is free and works for every type of contract."
          className="max-w-5xl"
        >
          <ContractTemplateGallery
            contract={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "contracts"} onOpenChange={(open) => setDialog(open ? "contracts" : null)}>
        <DialogContent
          title="My contracts"
          description="Saved automatically on this device. Duplicate one to reuse it with another client."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New contract
            </Button>
          }
        >
          <DocumentList
            noun="contract"
            items={library.collection.documents.map(({ id, data: contract, updatedAt }) => ({
              id,
              updatedAt,
              title: `${contract.title.trim() || defaultTitle(contract)} · ${contract.other.name || "No other party yet"}`,
              details: contract.effectiveDate ? formatDate(contract.effectiveDate) : "No date",
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) => library.duplicate(id, withFreshIds)}
            onDelete={(id) => {
              const contract = library.collection.documents.find((doc) => doc.id === id)?.data;
              library.remove(id, {
                label: contract?.other.name ? `the contract with ${contract.other.name}` : "this contract",
                createFallback: () =>
                  createContract({
                    profile: loadBusinessProfile(),
                    currency: form.getValues("payment.currency"),
                  }),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

function ContractPreview({ control }: { control: Control<Contract> }) {
  const contract = useWatch({ control }) as Contract;
  const prepared = useMemo(() => prepareContract(contract), [contract]);
  return (
    <PreviewCard>
      <ContractDocument templateId={contract.templateId} contract={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
