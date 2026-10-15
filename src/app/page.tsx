import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/card";
import { SITE, toolUrl } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { LIVE_TOOLS, TOOLS } from "@/tools/registry";

const title = "Free Online Tools - Invoice, Quotation, Resume & Cover Letter Makers";
const description =
  "Free, open-source tools for freelancers, job seekers and small businesses: invoice and quotation generators with GST, VAT and any currency, a resume builder and a matching cover letter builder. No sign-up, no watermark.";

export const metadata = buildMetadata({ title, description, url: toolUrl() });

export default function ToolsHubPage() {
  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Srutved", url: SITE.url },
          { name: "Tools", url: toolUrl() },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: "Free Business Tools",
          description,
          url: toolUrl(),
          items: LIVE_TOOLS.map((tool) => ({ name: tool.name, url: toolUrl(tool.slug) })),
        })}
      />
      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge>Free · Open source · No sign-up</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Free tools for freelancers and small businesses
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Create invoices, quotations, resumes and cover letters in minutes. Everything runs in your
            browser, so your data never leaves your device, and every download is free with no watermark.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const live = tool.status === "live";
            const body = (
              <>
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                    <tool.icon className="size-6" aria-hidden />
                  </span>
                  {!live && <Badge className="bg-subtle text-muted">Coming soon</Badge>}
                </div>
                <h2 className="mt-4 text-xl font-bold">{tool.name}</h2>
                <p className="mt-1 text-muted">{tool.tagline}</p>
                {live && (
                  <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-strong">
                    Open tool{" "}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                )}
              </>
            );
            const cardClass = cn(
              "group block h-full rounded-2xl border border-border bg-white p-6 transition-all",
              live ? "hover:border-brand hover:shadow-lg" : "opacity-70",
            );
            return (
              <li key={tool.slug}>
                {live ? (
                  <Link href={`/${tool.slug}`} className={cardClass}>
                    {body}
                  </Link>
                ) : (
                  <div className={cardClass}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
