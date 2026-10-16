import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/card";
import { SITE, toolUrl } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { LIVE_TOOLS, toolsByCategory, type ToolDefinition } from "@/tools/registry";

const title = "Free Business Tools - Invoices, Payslips, Resumes & More";
const description =
  "25 free tools for freelancers and small businesses: GST invoices, quotations, payslips, HR letters, resumes, contracts and finance calculators. No sign-up.";

export const metadata = buildMetadata({ title, description, url: toolUrl() });

const GROUPS = toolsByCategory();

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
            Invoices, receipts, purchase orders, payslips, HR letters, resumes, contracts and calculators for
            loans, savings and tax. Everything runs in your browser, so your data never leaves your device,
            and every download is free with no watermark.
          </p>
          <nav aria-label="Tool categories" className="mt-6 flex flex-wrap gap-2">
            {GROUPS.map(({ category, tools }) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold shadow-xs transition-colors hover:border-brand hover:text-brand-strong"
              >
                {category.name} <span className="font-normal text-muted">{tools.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {GROUPS.map(({ category, tools }) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-heading`}
            className="scroll-mt-24"
          >
            <h2 id={`${category.id}-heading`} className="text-2xl font-bold">
              {category.name}
            </h2>
            <p className="mt-1 text-muted">{category.description}</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-brand hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
          <tool.icon className="size-6" aria-hidden />
        </span>
        {tool.kind === "calculator" && <Badge className="bg-subtle text-muted">Calculator</Badge>}
      </div>
      <h3 className="mt-4 text-xl font-bold">{tool.name}</h3>
      <p className="mt-1 flex-1 text-muted">{tool.tagline}</p>
      <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-strong">
        {tool.kind === "calculator" ? "Open calculator" : "Open tool"}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
