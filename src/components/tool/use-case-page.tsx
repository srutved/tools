import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { SITE, toolUrl } from "@/config/site";
import { breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";
import type { ToolDefinition } from "@/tools/registry";
import { FaqList } from "./faq-list";
import { RelatedTools } from "./related-tools";
import { SrutvedCta } from "./srutved-cta";
import type { UseCase, UseCaseCollection } from "./use-case";

type UseCaseContent = Omit<UseCase<unknown>, "document">;

function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, index) => (
        <span key={item.name} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-4" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-strong">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-foreground">
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

interface UseCasePageProps {
  tool: ToolDefinition;
  collection: UseCaseCollection;
  useCase: UseCaseContent;
  /** A rendered preview of the example document (a client component). */
  preview: ReactNode;
  /** The collection's other pages, for "More examples" links. */
  siblings: { slug: string; name: string }[];
}

/** One landing page: the example, why it works, how to adapt it, and a one-click start. */
export function UseCasePage({ tool, collection, useCase, preview, siblings }: UseCasePageProps) {
  const collectionPath = `${tool.slug}/${collection.segment}`;
  const url = toolUrl(`${collectionPath}/${useCase.slug}`);
  const useHref = `/${tool.slug}?example=${useCase.slug}`;

  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Srutved", url: SITE.url },
          { name: "Tools", url: toolUrl() },
          { name: tool.name, url: toolUrl(tool.slug) },
          { name: collection.title, url: toolUrl(collectionPath) },
          { name: useCase.name, url },
        ])}
      />
      <JsonLd data={faqJsonLd(useCase.faqs)} />

      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Tools", href: "/" },
              { name: tool.name, href: `/${tool.slug}` },
              { name: collection.title, href: `/${collectionPath}` },
              { name: useCase.name },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{useCase.heading}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{useCase.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={useHref} className={buttonVariants({ size: "lg" })}>
              Use this example <ArrowRight />
            </Link>
            <Link href={`/${tool.slug}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Start from scratch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-4">{preview}</div>
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-lg font-bold">{useCase.highlights.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {useCase.highlights.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-brand-soft p-6">
              <p className="font-bold">Make it yours in minutes</p>
              <p className="mt-1 text-sm text-muted">
                Open this example in the free {tool.name.toLowerCase()}, change the details and download a
                PDF. No sign-up, no watermark.
              </p>
              <Link href={useHref} className={buttonVariants({ className: "mt-4 w-full" })}>
                Use this example <ArrowRight />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        {useCase.guide.map((article) => (
          <article key={article.heading} className="mt-12 first:mt-0">
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
        <FaqList faqs={useCase.faqs} />

        {siblings.length > 0 && (
          <section className="mt-16" aria-labelledby="more-examples">
            <h2 id="more-examples" className="text-2xl font-bold">
              More {collection.title.toLowerCase()}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    href={`/${collectionPath}/${sibling.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-4 py-3 font-semibold hover:border-brand hover:text-brand-strong"
                  >
                    {sibling.name}
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <RelatedTools slug={tool.slug} />
        <SrutvedCta toolSlug={tool.slug} />
      </section>
    </main>
  );
}

interface UseCaseIndexPageProps {
  tool: ToolDefinition;
  collection: UseCaseCollection;
  items: { slug: string; name: string; summary: string; preview: ReactNode }[];
}

/** The list of a tool's landing pages, e.g. /resume-builder/examples. */
export function UseCaseIndexPage({ tool, collection, items }: UseCaseIndexPageProps) {
  const collectionPath = `${tool.slug}/${collection.segment}`;
  const url = toolUrl(collectionPath);

  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Srutved", url: SITE.url },
          { name: "Tools", url: toolUrl() },
          { name: tool.name, url: toolUrl(tool.slug) },
          { name: collection.title, url },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: collection.title,
          description: collection.metaDescription,
          url,
          items: items.map((item) => ({ name: item.name, url: toolUrl(`${collectionPath}/${item.slug}`) })),
        })}
      />
      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Tools", href: "/" },
              { name: tool.name, href: `/${tool.slug}` },
              { name: collection.title },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{collection.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{collection.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/${collectionPath}/${item.slug}`} className="group block">
                <div className="rounded-lg p-1 transition-colors group-hover:bg-brand/40">{item.preview}</div>
                <p className="mt-2 font-bold group-hover:text-brand-strong">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted">{item.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-5xl">
          <RelatedTools slug={tool.slug} />
          <SrutvedCta toolSlug={tool.slug} />
        </div>
      </section>
    </main>
  );
}
