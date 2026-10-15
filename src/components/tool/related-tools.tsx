import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { relatedTools } from "@/tools/registry";

/** "More free tools": links from one tool to the others, for visitors and search engines alike. */
export function RelatedTools({ slug }: { slug: string }) {
  const tools = relatedTools(slug);
  if (tools.length === 0) return null;
  return (
    <section className="mt-16" aria-labelledby="related-tools">
      <h2 id="related-tools" className="text-2xl font-bold">
        More free tools
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/${tool.slug}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-brand hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">
                <tool.icon className="size-5" aria-hidden />
              </span>
              <span className="mt-3 font-bold">{tool.name}</span>
              <span className="mt-1 flex-1 text-sm text-muted">{tool.tagline}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
                Open tool
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
