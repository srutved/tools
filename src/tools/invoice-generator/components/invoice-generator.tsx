"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Download, FilePlus2, FolderOpen, LoaderCircle, Palette, Printer, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { ScaledPage } from "@/components/document/scaled-page";
import { ToolWorkspace, type WorkspaceTab } from "@/components/tool/tool-workspace";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useHydrated } from "@/hooks/use-hydrated";
import { useQrCode } from "@/hooks/use-qr-code";
import { downloadBlob } from "@/lib/browser";
import { guessCurrencyFromLocale } from "@/lib/currency";
import { todayIso } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { createId } from "@/lib/utils";
import { loadBusinessProfile, saveBusinessProfile } from "@/shared/business-profile";
import { createInvoice } from "../defaults";
import { renderInvoicePdf } from "../export";
import { computeInvoice } from "../lib/calculations";
import { nextInvoiceNumber } from "../lib/invoice-number";
import { invoiceExportSchema, type Invoice } from "../schema";
import {
  loadInvoiceStore,
  removeInvoice,
  saveInvoiceStore,
  upsertInvoice,
  type InvoiceStore,
} from "../store";
import { getTemplate, INVOICE_TEMPLATES, InvoiceDocument } from "../templates";
import {
  BusinessSection,
  ClientSection,
  DetailsSection,
  ItemsSection,
  NotesSection,
  PaymentSection,
} from "./editor-sections";
import { InvoiceList } from "./invoice-list";
import { TemplateGallery } from "./template-gallery";

const AUTOSAVE_DELAY_MS = 400;

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

/** Reads saved invoices on first load, creating a first invoice for new visitors. */
function loadInitialState(): InvoiceStore & { activeId: string } {
  const store = loadInvoiceStore();
  const requestedTemplate = new URLSearchParams(window.location.search).get("template");
  const templateId = INVOICE_TEMPLATES.some((template) => template.id === requestedTemplate)
    ? requestedTemplate!
    : undefined;

  const active = store.invoices.find((saved) => saved.id === store.activeId) ?? store.invoices[0];
  if (active) {
    const invoice = templateId ? { ...active.invoice, templateId } : active.invoice;
    return { ...upsertInvoice(store, active.id, invoice), activeId: active.id };
  }

  const id = createId();
  const invoice = createInvoice({
    profile: loadBusinessProfile(),
    currency: guessCurrencyFromLocale(navigator.language),
    templateId,
  });
  return { ...upsertInvoice(store, id, invoice), activeId: id };
}

function InvoiceGeneratorApp() {
  const [initial] = useState(loadInitialState);
  const [store, setStore] = useState<InvoiceStore>(initial);
  const storeRef = useRef<InvoiceStore>(initial);
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "invoices" | null>(null);
  const [busy, setBusy] = useState<"download" | "print" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const form = useForm<Invoice>({
    resolver: zodResolver(invoiceExportSchema),
    defaultValues: initial.invoices[0].invoice,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  /* ------------------------------------------------------------ Persistence */

  const commit = useCallback((next: InvoiceStore) => {
    storeRef.current = next;
    setStore(next);
    if (!saveInvoiceStore(next)) {
      setAlert(
        "Your browser's storage is full, so recent changes may not be saved. Delete old invoices to free space.",
      );
    }
  }, []);

  const saveNow = useCallback(() => {
    const invoice = form.getValues();
    const activeId = storeRef.current.activeId ?? createId();
    commit(upsertInvoice(storeRef.current, activeId, invoice));
    saveBusinessProfile({ business: invoice.from, payment: invoice.payment, logo: invoice.logo });
  }, [commit, form]);

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flushSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveNow();
  }, [saveNow]);

  useEffect(() => {
    saveInvoiceStore(initial); // Persist the first invoice / template choice from the URL.
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: () => {
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(saveNow, AUTOSAVE_DELAY_MS);
      },
    });
    return () => {
      unsubscribe();
      clearTimeout(saveTimer.current);
    };
  }, [form, initial, saveNow]);

  /* ------------------------------------------------------------ Invoice actions */

  const openInvoice = (id: string, invoice: Invoice) => {
    commit(upsertInvoice(storeRef.current, id, invoice));
    form.reset(invoice);
    setDialog(null);
    setTab("edit");
    setAlert(null);
  };

  const latestNumber = () => storeRef.current.invoices[0]?.invoice.number ?? form.getValues("number");

  const handleNew = () => {
    flushSave();
    const current = form.getValues();
    openInvoice(
      createId(),
      createInvoice({
        profile: loadBusinessProfile(),
        currency: current.currency,
        templateId: current.templateId,
        number: nextInvoiceNumber(latestNumber()),
      }),
    );
  };

  const handleOpen = (id: string) => {
    flushSave();
    const saved = storeRef.current.invoices.find((entry) => entry.id === id);
    if (saved) openInvoice(id, saved.invoice);
  };

  const handleDuplicate = (id: string) => {
    flushSave();
    const saved = storeRef.current.invoices.find((entry) => entry.id === id);
    if (!saved) return;
    openInvoice(createId(), {
      ...saved.invoice,
      number: nextInvoiceNumber(latestNumber()),
      issueDate: todayIso(),
      items: saved.invoice.items.map((item) => ({ ...item, id: createId() })),
    });
  };

  const handleDelete = (id: string) => {
    const saved = storeRef.current.invoices.find((entry) => entry.id === id);
    if (!saved || !window.confirm(`Delete invoice ${saved.invoice.number || ""}? This can't be undone.`))
      return;
    const next = removeInvoice(storeRef.current, id);
    if (id !== storeRef.current.activeId) {
      commit(next);
      return;
    }
    const fallback = next.invoices.find((entry) => entry.id === next.activeId);
    if (fallback) {
      storeRef.current = next;
      openInvoice(fallback.id, fallback.invoice);
    } else {
      storeRef.current = next;
      openInvoice(
        createId(),
        createInvoice({ profile: loadBusinessProfile(), currency: form.getValues("currency") }),
      );
    }
  };

  /* ------------------------------------------------------------ Export */

  const onInvalid = () => {
    setTab("edit");
    setAlert("Please fix the highlighted fields before downloading.");
    // Wait for the editor tab to show (on mobile) before focusing the first problem.
    setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 50);
  };

  const exportPdf = (mode: "download" | "print") =>
    form.handleSubmit(async (invoice) => {
      setAlert(null);
      flushSave();
      // Open the tab synchronously, inside the click, so pop-up blockers allow it.
      const printWindow = mode === "print" ? window.open("", "_blank") : null;
      setBusy(mode);
      try {
        const { blob, fileName } = await renderInvoicePdf(invoice);
        if (printWindow) {
          printWindow.location.href = URL.createObjectURL(blob);
        } else {
          downloadBlob(blob, fileName);
        }
      } catch (error) {
        console.error("PDF export failed", error);
        printWindow?.close();
        setAlert("Sorry, the PDF could not be created. Please try again.");
      } finally {
        setBusy(null);
      }
    }, onInvalid)();

  const selectTemplate = (templateId: string) => {
    form.setValue("templateId", templateId, { shouldDirty: true });
    setDialog(null);
  };

  const templateId = useWatch({ control: form.control, name: "templateId" });

  // On phones the secondary actions are icon-only (labels stay available to screen readers),
  // so every action - including Download PDF - fits in the bottom bar without scrolling.
  const label = "sr-only sm:not-sr-only";
  const iconOnMobile = "max-sm:px-3";
  const toolbar = (
    <>
      <Button
        variant="outline"
        className={iconOnMobile}
        onClick={() => setDialog("templates")}
        title="Choose template"
      >
        <Palette />
        <span className={label}>
          <span className="hidden lg:inline">Template: </span>
          {getTemplate(templateId).name}
        </span>
      </Button>
      <Button
        variant="outline"
        className={iconOnMobile}
        onClick={() => setDialog("invoices")}
        title="My invoices"
      >
        <FolderOpen />
        <span className={label}>My invoices</span>
        <span aria-hidden className="text-muted">
          {store.invoices.length}
        </span>
      </Button>
      <Button variant="outline" className={iconOnMobile} onClick={handleNew} title="New invoice">
        <FilePlus2 />
        <span className={label}>New</span>
      </Button>
      <Button
        variant="outline"
        className={iconOnMobile}
        onClick={() => exportPdf("print")}
        disabled={busy !== null}
        title="Print"
      >
        {busy === "print" ? <LoaderCircle className="animate-spin" /> : <Printer />}
        <span className={label}>Print</span>
      </Button>
      <Button className="max-sm:flex-1" onClick={() => exportPdf("download")} disabled={busy !== null}>
        {busy === "download" ? <LoaderCircle className="animate-spin" /> : <Download />} Download
        <span className="-ml-1 hidden sm:inline">PDF</span>
      </Button>
    </>
  );

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        toolbar={toolbar}
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                {alert}
              </p>
            )}
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
          <TemplateGallery
            invoice={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => selectTemplate(template.id)}
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
          <InvoiceList
            invoices={store.invoices}
            activeId={store.activeId}
            onOpen={handleOpen}
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
    <Card className="p-3 sm:p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">Live preview</p>
      <ScaledPage className="shadow-md ring-1 ring-border">
        <InvoiceDocument invoice={invoice} computed={computed} qrCode={qrCode} Page={WebPage} />
      </ScaledPage>
    </Card>
  );
}
