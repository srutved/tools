import Link from "next/link";
import { SITE } from "@/config/site";
import { TOOLS } from "@/tools/registry";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <a href={SITE.url} className="text-xl font-extrabold">
            Srut<span className="text-brand">ved</span>{" "}
            <span className="font-semibold text-muted">Tools</span>
          </a>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Free and open-source tools for freelancers and small businesses. Your data stays in your browser.
          </p>
        </div>
        <nav aria-label="All tools">
          <h2 className="mb-3 text-sm font-bold">Tools</h2>
          <ul className="space-y-2 text-sm text-muted">
            {TOOLS.map((tool) => (
              <li key={tool.slug}>
                {tool.status === "live" ? (
                  <Link href={`/${tool.slug}`} className="hover:text-brand-strong">
                    {tool.name}
                  </Link>
                ) : (
                  <span>
                    {tool.name} <span className="text-xs">(coming soon)</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-bold">Built by Srutved</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href={SITE.url} className="hover:text-brand-strong">
                App development for startups
              </a>
            </li>
            <li>
              <a href={SITE.contactUrl} className="hover:text-brand-strong">
                Contact us
              </a>
            </li>
            <li>
              <a
                href={SITE.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-strong"
              >
                Open source on GitHub (MIT)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
