"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useQrCode } from "@/hooks/use-qr-code";
import { trackToolEvent } from "@/lib/analytics";
import { formatMoney, guessCurrencyFromLocale } from "@/lib/currency";
import { formatDate, todayIso } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { upsertDocument } from "@/lib/saved-documents";
import { createId } from "@/lib/utils";
import { loadBusinessProfile, saveBusinessProfile } from "@/shared/business-profile";
import { CONVERSIONS, convertDocument, createInvoice, fromExample, nextNumberAfter } from "../defaults";
import { formatsFor } from "../examples";
import { renderInvoicePdf } from "../export";
import { computeInvoice } from "../lib/calculations";
import { kindLabels, type DocumentKind } from "../lib/document-kind";
import { nextInvoiceNumber } from "../lib/invoice-number";
import { invoiceExportSchema, type Invoice } from "../schema";
import { storeFor } from "../store";
import { getTemplate, INVOICE_TEMPLATES, InvoiceDocument } from "../templates";
import {
  BusinessSection,
  ClientSection,
  DetailsSection,
  ExtrasSection,
  ItemsSection,
  NotesSection,
  PaymentSection,
} from "./editor-sections";
import { InvoiceTemplateGallery } from "./template-gallery";

/** The invoice generator. Renders a placeholder on the server; the editor needs browser storage. */
export function InvoiceGenerator() {
  return <BillingDocumentGenerator kind="invoice" />;
}

/** The quotation generator: the same engine, with quotation wording and no payment details. */
export function QuoteGenerator() {
  return <BillingDocumentGenerator kind="quote" />;
}

export function ProformaInvoiceGenerator() {
  return <BillingDocumentGenerator kind="proforma" />;
}

export function ReceiptGenerator() {
  return <BillingDocumentGenerator kind="receipt" />;
}

export function CreditNoteGenerator() {
  return <BillingDocumentGenerator kind="credit-note" />;
}

export function DebitNoteGenerator() {
  return <BillingDocumentGenerator kind="debit-note" />;
}

export function DeliveryChallanGenerator() {
  return <BillingDocumentGenerator kind="challan" />;
}

export function PurchaseOrderGenerator() {
  return <BillingDocumentGenerator kind="purchase-order" />;
}

/** The offer shown under the editor to turn this document into another kind. */
const CONVERSION_COPY: Partial<
  Record<DocumentKind, Partial<Record<DocumentKind, [string, string, string]>>>
> = {
  quote: {
    invoice: [
      "Quotation accepted?",
      "Turn it into an invoice with the same client and items.",
      "Convert to invoice",
    ],
  },
  proforma: {
    invoice: [
      "Order confirmed?",
      "Raise the tax invoice with the same client and items.",
      "Convert to invoice",
    ],
  },
  invoice: {
    receipt: ["Got paid?", "Create a receipt for this invoice's payment in one click.", "Record payment"],
    "credit-note": [
      "Need to reduce this invoice?",
      "Issue a credit note against it, for a return, discount or overcharge.",
      "Create credit note",
    ],
  },
};

function BillingDocumentGenerator({ kind }: { kind: DocumentKind }) {
  return (
    <ToolGate
      label={`${kindLabels(kind).noun} generator`}
      render={(query) => <BillingDocumentApp kind={kind} query={query} />}
    />
  );
}

function loadInitialState(kind: DocumentKind, query: URLSearchParams) {
  const templateId = templateFromQuery(query, INVOICE_TEMPLATES);
  const example = exampleFromQuery(query, formatsFor(kind));
  const store = storeFor(kind);
  return loadDocumentLibrary(store, {
    // An example chosen on a landing page opens as a new document next to the saved ones.
    startWith:
      example &&
      fromExample(example.document, {
        profile: loadBusinessProfile(),
        number: nextNumberAfter(store.load().documents[0]?.data.number),
      }),
    create: () =>
      createInvoice({
        kind,
        profile: loadBusinessProfile(),
        currency: guessCurrencyFromLocale(navigator.language),
        templateId,
      }),
    patch: (invoice) => (templateId ? { ...invoice, templateId } : invoice),
  });
}

/** Saves a converted document (an invoice from a quotation, a receipt from an invoice...) in its tool and opens it. */
function useConvertDocument() {
  const router = useRouter();
  return (source: Invoice, target: DocumentKind) => {
    const store = storeFor(target);
    const saved = store.load();
    const latest = saved.documents[0]?.data.number;
    const converted = convertDocument(source, target, {
      number: latest
        ? nextInvoiceNumber(latest)
        : createInvoice({ kind: target, currency: source.currency }).number,
      profile: loadBusinessProfile(),
    });
    store.save(upsertDocument(saved, createId(), converted));
    trackToolEvent("Document Converted", { from: source.kind, to: target });
    router.push(`/${kindLabels(target).toolSlug}`);
  };
}

function BillingDocumentApp({ kind, query }: { kind: DocumentKind; query: URLSearchParams }) {
  const labels = kindLabels(kind);
  const plural = `${labels.noun}s`;
  const store = storeFor(kind);
  const [initial] = useState(() => loadInitialState(kind, query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "library" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);
  const convert = useConvertDocument();

  const form = useForm<Invoice>({
    resolver: zodResolver(invoiceExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store,
    form,
    initial,
    noun: plural,
    setAlert,
    // Remember the user's business details for their next invoice or quotation.
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
    onExported: (mode) => setExported(mode === "download"),
  });

  const latestNumber = () => library.latest()?.number ?? form.getValues("number");

  const handleNew = () => {
    const current = form.getValues();
    library.create(
      createInvoice({
        kind,
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
      label: `${labels.noun} ${number ?? ""}`.trim(),
      createFallback: () =>
        createInvoice({ kind, profile: loadBusinessProfile(), currency: form.getValues("currency") }),
    });
  };

  const handleConvert = (target: DocumentKind) => {
    library.flushSave();
    convert(form.getValues(), target);
  };

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const capitalised = `${labels.noun[0].toUpperCase()}${labels.noun.slice(1)}`;

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && <ExportedBanner toolSlug={labels.toolSlug} onDismiss={() => setExported(false)} />
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel={`My ${plural}`}
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("library")}
            newLabel={`New ${labels.noun}`}
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
            <ExtrasSection />
            <ItemsSection />
            {labels.showsPayment && <PaymentSection />}
            <NotesSection />
            {(CONVERSIONS[kind] ?? []).map((target) => {
              const copy = CONVERSION_COPY[kind]?.[target];
              if (!copy) return null;
              return (
                <div
                  key={target}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4"
                >
                  <p className="text-sm">
                    <span className="font-bold">{copy[0]}</span> {copy[1]}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleConvert(target)}>
                    {copy[2]} <ArrowRight />
                  </Button>
                </div>
              );
            })}
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
            kind={kind}
            invoice={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "library"} onOpenChange={(open) => setDialog(open ? "library" : null)}>
        <DialogContent
          title={`My ${plural}`}
          description="Saved automatically on this device. Clearing your browser data removes them."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New {labels.noun}
            </Button>
          }
        >
          <DocumentList
            noun={labels.noun}
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
          {kind === "quote" && library.collection.documents.length > 0 && (
            <p className="mt-4 text-xs text-muted">
              {capitalised}s are kept separately from invoices. Open one and use &quot;Convert to
              invoice&quot; when it&apos;s accepted.
            </p>
          )}
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
