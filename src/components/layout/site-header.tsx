import Link from "next/link";
import { GithubIcon } from "@/components/icons/github-icon";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import { LIVE_TOOLS } from "@/tools/registry";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* The main site is another app, so this is a plain link rather than next/link. */}
          <a href={SITE.url} className="text-2xl font-extrabold tracking-tight" aria-label="Srutved home">
            Srut<span className="text-brand">ved</span>
          </a>
          <nav aria-label="Tools" className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-muted hover:text-foreground"
            >
              All tools
            </Link>
            {LIVE_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                // Every tool only where there's room; "All tools" covers narrower screens.
                className="hidden rounded-md px-2.5 py-2 text-sm font-semibold whitespace-nowrap text-muted hover:text-foreground xl:block"
              >
                {tool.navLabel}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="Source code on GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href={SITE.contactUrl}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
          >
            Need a custom app?
          </a>
        </div>
      </div>
    </header>
  );
}
