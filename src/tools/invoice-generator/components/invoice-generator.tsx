"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { PreviewCard } from "@/components/document/preview-card";
import { DocumentList } from "@/components/tool/document-list";
import { DocumentToolbar } from "@/components/tool/document-toolbar";
import { FormAlert } from "@/components/tool/form";
import { ToolWorkspace, type WorkspaceTab } from "@/components/tool/tool-workspace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadDocumentLibrary, templateFromQuery, useDocumentLibrary } from "@/hooks/use-document-library";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { useQrCode } from "@/hooks/use-qr-code";
import { formatMoney, guessCurrencyFromLocale } from "@/lib/currency";
import { formatDate, todayIso } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { createId } from "@/lib/utils";
import { loadBusinessProfile, saveBusinessProfile } from "@/shared/business-profile";
import { createInvoice } from "../defaults";
import { renderInvoicePdf } from "../export";
import { computeInvoice } from "../lib/calculations";
import { nextInvoiceNumber } from "../lib/invoice-number";
import { invoiceExportSchema, type Invoice } from "../schema";
import { invoiceStore } from "../store";
import { getTemplate, INVOICE_TEMPLATES, InvoiceDocument } from "../templates";
import {
  BusinessSection,
  ClientSection,
  DetailsSection,
  ItemsSection,
  NotesSection,
  PaymentSection,
} from "./editor-sections";
import { InvoiceTemplateGallery } from "./template-gallery";

/** Entry point. Renders a placeholder on the server; the editor itself needs the browser's storage. */
export function InvoiceGenerator() {
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-subtle/60 text-muted">
        <LoaderCircle className="mr-2 size-5 animate-spin" aria-hidden /> Loading the invoice generator…
      </div>
    );
  }
  return <InvoiceGeneratorApp />;
}

function loadInitialState() {
  const templateId = templateFromQuery(INVOICE_TEMPLATES);
  return loadDocumentLibrary(invoiceStore, {
    create: () =>
      createInvoice({
        profile: loadBusinessProfile(),
        currency: guessCurrencyFromLocale(navigator.language),
        templateId,
      }),
    patch: (invoice) => (templateId ? { ...invoice, templateId } : invoice),
  });
}

function InvoiceGeneratorApp() {
  const [initial] = useState(loadInitialState);
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "invoices" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const form = useForm<Invoice>({
    resolver: zodResolver(invoiceExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: invoiceStore,
    form,
    initial,
    noun: "invoices",
    setAlert,
    // Remember the user's business details for their next invoice.
    onSave: (invoice) =>
      saveBusinessProfile({ business: invoice.from, payment: invoice.payment, logo: invoice.logo }),
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderInvoicePdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
  });

  const latestNumber = () => library.latest()?.number ?? form.getValues("number");

  const handleNew = () => {
    const current = form.getValues();
    library.create(
      createInvoice({
        profile: loadBusinessProfile(),
        currency: current.currency,
        templateId: current.templateId,
        number: nextInvoiceNumber(latestNumber()),
      }),
    );
  };

  const handleDuplicate = (id: string) =>
    library.duplicate(id, (invoice) => ({
      ...invoice,
      number: nextInvoiceNumber(latestNumber()),
      issueDate: todayIso(),
      items: invoice.items.map((item) => ({ ...item, id: createId() })),
    }));

  const handleDelete = (id: string) => {
    const number = library.collection.documents.find((doc) => doc.id === id)?.data.number;
    library.remove(id, {
      label: `invoice ${number ?? ""}`.trim(),
      createFallback: () =>
        createInvoice({ profile: loadBusinessProfile(), currency: form.getValues("currency") }),
    });
  };

  const templateId = useWatch({ control: form.control, name: "templateId" });

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My invoices"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("invoices")}
            newLabel="New invoice"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <BusinessSection />
            <ClientSection />
            <DetailsSection />
            <ItemsSection />
            <PaymentSection />
            <NotesSection />
          </form>
        }
        preview={<InvoicePreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a template"
          description="Every template is free. Your details carry over - switch any time."
          className="max-w-5xl"
        >
          <InvoiceTemplateGallery
            invoice={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "invoices"} onOpenChange={(open) => setDialog(open ? "invoices" : null)}>
        <DialogContent
          title="My invoices"
          description="Saved automatically on this device. Clearing your browser data removes them."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New invoice
            </Button>
          }
        >
          <DocumentList
            noun="invoice"
            items={library.collection.documents.map(({ id, data: invoice, updatedAt }) => ({
              id,
              updatedAt,
              title: `${invoice.number || "Untitled"} · ${invoice.to.name || "No client yet"}`,
              details: `${formatMoney(computeInvoice(invoice).totals.total, invoice.currency)} · ${
                invoice.issueDate ? formatDate(invoice.issueDate) : "No date"
              }`,
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

function InvoicePreview({ control }: { control: Control<Invoice> }) {
  const invoice = useWatch({ control }) as Invoice;
  const computed = useMemo(() => computeInvoice(invoice), [invoice]);
  const qrCode = useQrCode(computed.upiUri);

  return (
    <PreviewCard>
      <InvoiceDocument invoice={invoice} computed={computed} qrCode={qrCode} Page={WebPage} />
    </PreviewCard>
  );
}
