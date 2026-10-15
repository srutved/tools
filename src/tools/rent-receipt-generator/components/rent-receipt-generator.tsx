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
import { loadDocumentLibrary, templateFromQuery, useDocumentLibrary } from "@/hooks/use-document-library";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { formatMoney } from "@/lib/currency";
import { addMonths, formatMonth, isMonth, monthRange } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { createRentReceipt } from "../defaults";
import { renderRentReceiptPdf } from "../export";
import { prepareRentReceipts } from "../lib/receipts";
import { SAMPLE_RENT_RECEIPT } from "../sample";
import { rentReceiptExportSchema, type RentReceipt } from "../schema";
import { rentReceiptStore } from "../store";
import { ReceiptDocument } from "../templates/receipt-document";
import { getTemplate, RECEIPT_TEMPLATES } from "../templates/registry";
import { PartiesSection, PeriodSection, RentSection, SignatureSection } from "./editor-sections";
import { ReceiptTemplateGallery } from "./template-gallery";

/** Entry point: waits for the browser, then opens the editor. */
export function RentReceiptGenerator() {
  return (
    <ToolGate label="rent receipt generator" render={(query) => <RentReceiptGeneratorApp query={query} />} />
  );
}

function loadInitialState(query: URLSearchParams) {
  const templateId = templateFromQuery(query, RECEIPT_TEMPLATES);
  return loadDocumentLibrary(rentReceiptStore, {
    create: () => createRentReceipt(templateId),
    patch: (receipt) => (templateId ? { ...receipt, templateId } : receipt),
  });
}

/** The same tenancy for the period straight after this one, e.g. next financial year. */
function nextPeriod(receipt: RentReceipt): RentReceipt {
  if (!isMonth(receipt.from) || !isMonth(receipt.to)) return receipt;
  const months = Math.max(monthRange(receipt.from, receipt.to).length, 1);
  return { ...receipt, from: addMonths(receipt.from, months), to: addMonths(receipt.to, months) };
}

function periodLabel(receipt: RentReceipt): string {
  if (!isMonth(receipt.from) || !isMonth(receipt.to)) return "No months chosen";
  return receipt.from === receipt.to
    ? formatMonth(receipt.from)
    : `${formatMonth(receipt.from)} to ${formatMonth(receipt.to)}`;
}

function RentReceiptGeneratorApp({ query }: { query: URLSearchParams }) {
  const [initial] = useState(() => loadInitialState(query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "receipts" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const form = useForm<RentReceipt>({
    resolver: zodResolver(rentReceiptExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: rentReceiptStore,
    form,
    initial,
    noun: "rent receipts",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderRentReceiptPdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
    onExported: (mode) => setExported(mode === "download"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const handleNew = () => library.create(createRentReceipt(form.getValues("templateId")));

  // The example fills the names and rent; the chosen months and design are kept.
  const loadExample = () => {
    const { from, to, templateId: current } = form.getValues();
    form.reset({ ...SAMPLE_RENT_RECEIPT, from, to, templateId: current });
    library.flushSave();
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && (
            <ExportedBanner toolSlug="rent-receipt-generator" onDismiss={() => setExported(false)} />
          )
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My rent receipts"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("receipts")}
            newLabel="New receipts"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <EmptyReceiptBanner control={form.control} onLoad={loadExample} />
            <PartiesSection />
            <RentSection />
            <PeriodSection />
            <SignatureSection />
          </form>
        }
        preview={<ReceiptPreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a design"
          description="Every design is free and fits about three receipts to a page."
          className="max-w-5xl"
        >
          <ReceiptTemplateGallery
            receipt={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "receipts"} onOpenChange={(open) => setDialog(open ? "receipts" : null)}>
        <DialogContent
          title="My rent receipts"
          description="Saved automatically on this device. Duplicate a set to make the next year's receipts."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New receipts
            </Button>
          }
        >
          <DocumentList
            noun="receipt set"
            items={library.collection.documents.map(({ id, data: receipt, updatedAt }) => ({
              id,
              updatedAt,
              title: `${receipt.tenantName || "No tenant yet"} · ${receipt.landlordName || "No landlord yet"}`,
              details: `${periodLabel(receipt)} · ${formatMoney(receipt.monthlyRent || 0, "INR")} a month`,
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) => library.duplicate(id, nextPeriod)}
            onDelete={(id) => {
              const receipt = library.collection.documents.find((doc) => doc.id === id)?.data;
              library.remove(id, {
                label: receipt?.tenantName ? `the receipts for ${receipt.tenantName}` : "these receipts",
                createFallback: () => createRentReceipt(form.getValues("templateId")),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

/** Shown while the receipts are still blank. */
function EmptyReceiptBanner({ control, onLoad }: { control: Control<RentReceipt>; onLoad: () => void }) {
  const tenant = useWatch({ control, name: "tenantName" });
  const landlord = useWatch({ control, name: "landlordName" });
  if (tenant?.trim() || landlord?.trim()) return null;
  return <ExampleBanner noun="set of rent receipts" onLoad={onLoad} />;
}

function ReceiptPreview({ control }: { control: Control<RentReceipt> }) {
  const receipt = useWatch({ control }) as RentReceipt;
  const prepared = useMemo(() => prepareRentReceipts(receipt), [receipt]);
  return (
    <PreviewCard>
      <ReceiptDocument templateId={receipt.templateId} data={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
