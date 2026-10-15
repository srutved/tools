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
import { guessCurrencyFromLocale } from "@/lib/currency";
import { formatMonth, isMonth } from "@/lib/date";
import { WebPage } from "@/lib/document/web";
import { loadBusinessProfile } from "@/shared/business-profile";
import { createSalarySlip, withFreshIds } from "../defaults";
import { renderSalarySlipPdf } from "../export";
import { salaryFromQuery, slipWithSalary } from "../lib/handoff";
import { nextMonthSlip, preparePayslip } from "../lib/payslip";
import { SAMPLE_SALARY_SLIP } from "../sample";
import { salarySlipExportSchema, type SalarySlip } from "../schema";
import { salarySlipStore } from "../store";
import { PayslipDocument } from "../templates/payslip-document";
import { getTemplate, PAYSLIP_TEMPLATES } from "../templates/registry";
import {
  CompanySection,
  EmployeeSection,
  NotesSection,
  PayPeriodSection,
  PaySection,
} from "./editor-sections";
import { PayslipTemplateGallery } from "./template-gallery";

/** Entry point: waits for the browser, then opens the editor. */
export function SalarySlipGenerator() {
  return (
    <ToolGate label="salary slip generator" render={(query) => <SalarySlipGeneratorApp query={query} />} />
  );
}

function newSlip(templateId?: string, currency?: string) {
  return createSalarySlip({
    profile: loadBusinessProfile(),
    currency: currency ?? guessCurrencyFromLocale(navigator.language),
    templateId,
  });
}

function loadInitialState(query: URLSearchParams) {
  const templateId = templateFromQuery(query, PAYSLIP_TEMPLATES);
  const salary = salaryFromQuery(query);
  return loadDocumentLibrary(salarySlipStore, {
    create: () => newSlip(templateId),
    // A salary from the salary calculator opens as a new slip next to the saved ones.
    startWith: salary && slipWithSalary(newSlip(templateId, "INR"), salary),
    patch: (slip) => (templateId ? { ...slip, templateId } : slip),
  });
}

function SalarySlipGeneratorApp({ query }: { query: URLSearchParams }) {
  const [initial] = useState(() => loadInitialState(query));
  const [tab, setTab] = useState<WorkspaceTab>("edit");
  const [dialog, setDialog] = useState<"templates" | "slips" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const form = useForm<SalarySlip>({
    resolver: zodResolver(salarySlipExportSchema),
    defaultValues: initial.active,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const library = useDocumentLibrary({
    store: salarySlipStore,
    form,
    initial,
    noun: "salary slips",
    setAlert,
    onOpen: () => {
      setDialog(null);
      setTab("edit");
    },
  });

  const { busy, exportPdf } = usePdfExport({
    form,
    render: renderSalarySlipPdf,
    setAlert,
    onBeforeExport: library.flushSave,
    onInvalid: () => setTab("edit"),
    onExported: (mode) => setExported(mode === "download"),
  });

  const templateId = useWatch({ control: form.control, name: "templateId" });
  const handleNew = () => {
    const current = form.getValues();
    library.create(newSlip(current.templateId, current.currency));
  };

  // The example fills the employee and pay; the company, month and design are kept when set.
  const loadExample = () => {
    const current = form.getValues();
    const company = current.company.name.trim() ? current.company : SAMPLE_SALARY_SLIP.company;
    // reset() rather than setValue(), so the earnings and deductions lists re-render.
    form.reset(
      withFreshIds({
        ...SAMPLE_SALARY_SLIP,
        company,
        templateId: current.templateId,
        month: current.month,
        payDate: current.payDate,
        workingDays: current.workingDays,
        paidDays: current.paidDays,
      }),
    );
    library.flushSave();
  };

  return (
    <FormProvider {...form}>
      <ToolWorkspace
        tab={tab}
        onTabChange={setTab}
        notice={
          exported && <ExportedBanner toolSlug="salary-slip-generator" onDismiss={() => setExported(false)} />
        }
        toolbar={
          <DocumentToolbar
            templateName={getTemplate(templateId).name}
            onTemplates={() => setDialog("templates")}
            libraryLabel="My salary slips"
            libraryCount={library.collection.documents.length}
            onLibrary={() => setDialog("slips")}
            newLabel="New slip"
            onNew={handleNew}
            busy={busy}
            onExport={exportPdf}
          />
        }
        editor={
          <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-4">
            {alert && <FormAlert>{alert}</FormAlert>}
            <EmptySlipBanner control={form.control} onLoad={loadExample} />
            <CompanySection />
            <EmployeeSection />
            <PayPeriodSection />
            <PaySection />
            <NotesSection />
          </form>
        }
        preview={<PayslipPreview control={form.control} />}
      />

      <Dialog open={dialog === "templates"} onOpenChange={(open) => setDialog(open ? "templates" : null)}>
        <DialogContent
          title="Choose a design"
          description="Every design is free and fits on one A4 page."
          className="max-w-5xl"
        >
          <PayslipTemplateGallery
            slip={form.getValues()}
            selectedId={templateId}
            onSelect={(template) => {
              form.setValue("templateId", template.id, { shouldDirty: true });
              setDialog(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "slips"} onOpenChange={(open) => setDialog(open ? "slips" : null)}>
        <DialogContent
          title="My salary slips"
          description="Saved automatically on this device. Duplicate a slip to make the next month's."
          footer={
            <Button onClick={handleNew}>
              <FilePlus2 /> New slip
            </Button>
          }
        >
          <DocumentList
            noun="salary slip"
            items={library.collection.documents.map(({ id, data: slip, updatedAt }) => ({
              id,
              updatedAt,
              title: `${slip.employee.name || "No employee yet"} · ${isMonth(slip.month) ? formatMonth(slip.month) : "No month"}`,
              details: slip.company.name || "No company yet",
            }))}
            activeId={library.collection.activeId}
            onOpen={library.open}
            onDuplicate={(id) => library.duplicate(id, (slip) => withFreshIds(nextMonthSlip(slip)))}
            onDelete={(id) => {
              const slip = library.collection.documents.find((doc) => doc.id === id)?.data;
              library.remove(id, {
                label: slip?.employee.name ? `the slip for ${slip.employee.name}` : "this salary slip",
                createFallback: () => newSlip(form.getValues("templateId"), form.getValues("currency")),
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

/** Shown while the slip is still blank. */
function EmptySlipBanner({ control, onLoad }: { control: Control<SalarySlip>; onLoad: () => void }) {
  const employee = useWatch({ control, name: "employee.name" });
  const earnings = useWatch({ control, name: "earnings" });
  // Hidden once there's anything to lose, e.g. figures handed over from the salary calculator.
  if (employee?.trim() || earnings?.some((item) => Number(item.amount) > 0)) return null;
  return <ExampleBanner noun="salary slip" onLoad={onLoad} />;
}

function PayslipPreview({ control }: { control: Control<SalarySlip> }) {
  const slip = useWatch({ control }) as SalarySlip;
  const prepared = useMemo(() => preparePayslip(slip), [slip]);
  return (
    <PreviewCard>
      <PayslipDocument templateId={slip.templateId} slip={prepared} Page={WebPage} />
    </PreviewCard>
  );
}
