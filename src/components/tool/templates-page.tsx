import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, toolUrl } from "@/config/site";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import type { ToolDefinition } from "@/tools/registry";

interface TemplatesPageProps {
  tool: ToolDefinition;
  /** Visible H1, e.g. "Free Resume Templates". */
  heading: string;
  intro: string;
  /** Meta description, reused in structured data. */
  description: string;
  /** What a template is called in structured data, e.g. "resume template". */
  itemNoun: string;
  templates: { id: string; name: string }[];
  /** The gallery itself. */
  children: ReactNode;
}

/** Shared /<tool>/templates page: breadcrumb, intro, the gallery and CollectionPage structured data. */
export function TemplatesPage({
  tool,
  heading,
  intro,
  description,
  itemNoun,
  templates,
  children,
}: TemplatesPageProps) {
  const url = toolUrl(`${tool.slug}/templates`);

  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Srutved", url: SITE.url },
          { name: "Tools", url: toolUrl() },
          { name: tool.name, url: toolUrl(tool.slug) },
          { name: "Templates", url },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: heading,
          description,
          url,
          items: templates.map((template) => ({
            name: `${template.name} ${itemNoun}`,
            url: `${toolUrl(tool.slug)}?template=${template.id}`,
          })),
        })}
      />
      <section className="border-b border-border bg-gradient-to-br from-brand-soft to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-brand-strong">
              Tools
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <Link href={`/${tool.slug}`} className="hover:text-brand-strong">
              {tool.name}
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="font-medium text-foreground">
              Templates
            </span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{heading}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}
