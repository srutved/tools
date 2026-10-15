import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, toolUrl } from "@/config/site";
import { breadcrumbJsonLd, faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import type { ToolDefinition } from "@/tools/registry";
import { FaqList } from "./faq-list";
import { RelatedTools } from "./related-tools";
import { SrutvedCta } from "./srutved-cta";
import { ToolPromo } from "./tool-promo";
import type { ToolContent } from "./tool-content";

const PROMISES = ["100% free", "No sign-up", "No watermark", "Data stays on your device"];

interface ToolPageProps {
  tool: ToolDefinition;
  content: ToolContent;
  /** The interactive tool itself. */
  children: ReactNode;
}

/** Shared page shell for every tool: hero, the tool, how-to, features, FAQ and structured data. */
export function ToolPage({ tool, content, children }: ToolPageProps) {
  const url = toolUrl(tool.slug);

  return (
    <main className="flex-1">
      <JsonLd
        data={softwareApplicationJsonLd({ name: content.heading, description: content.metaDescription, url })}
      />
      <JsonLd data={faqJsonLd(content.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Srutved", url: SITE.url },
          { name: "Tools", url: toolUrl() },
          { name: tool.name, url },
        ])}
      />

      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-brand-strong">
              Tools
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="font-medium text-foreground">
              {tool.name}
            </span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{content.heading}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{content.intro}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex items-center gap-1.5">
                <Check className="size-4 text-brand" aria-hidden />
                {promise}
              </li>
            ))}
          </ul>
          {tool.subPages && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span className="text-muted">Browse:</span>
              {tool.subPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${tool.slug}/${page.slug}`}
                  className="font-semibold text-brand-strong hover:underline"
                >
                  {page.label}
                </Link>
              ))}
            </p>
          )}
        </div>
      </section>

      {children}
      <ToolPromo tool={tool} />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {content.howItWorks.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-border bg-white p-5">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-bold">Features</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {content.features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {content.guide?.map((article) => (
          <article key={article.heading} className="mt-16">
            <h2 className="text-2xl font-bold">{article.heading}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-gray-700">
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {article.bullets && (
                <ul className="list-disc space-y-1.5 pl-5">
                  {article.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}

        <h2 className="mt-16 text-2xl font-bold">Frequently asked questions</h2>
        <FaqList faqs={content.faqs} />

        <RelatedTools slug={tool.slug} />

        <SrutvedCta toolSlug={tool.slug} />
      </section>
    </main>
  );
}
