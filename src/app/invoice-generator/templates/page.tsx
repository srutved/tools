import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TemplatesShowcase } from "@/tools/invoice-generator/components/templates-showcase";
import { toolUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { INVOICE_TEMPLATES } from "@/tools/invoice-generator/templates";

export const metadata = buildMetadata({
  title: `${INVOICE_TEMPLATES.length} Free Invoice Templates - Download as PDF`,
  description:
    "Browse free, professional invoice templates: classic, modern, minimal, sidebar and bold designs. Fill one in online and download a PDF in any currency, with GST or VAT.",
  url: toolUrl("invoice-generator/templates"),
});

export default function InvoiceTemplatesPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-brand-strong">
              Tools
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <Link href="/invoice-generator" className="hover:text-brand-strong">
              Invoice Generator
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="font-medium text-foreground">
              Templates
            </span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Free Invoice Templates</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">
            {INVOICE_TEMPLATES.length} professional designs, all free. Pick one, fill it in online and
            download a PDF in seconds - no sign-up, no watermark.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TemplatesShowcase />
      </section>
    </main>
  );
}
