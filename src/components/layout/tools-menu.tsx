"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toolsByCategory } from "@/tools/registry";

const GROUPS = toolsByCategory();

/** The header's "Tools" menu: every tool, grouped by category. */
export function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Close after navigating, on Escape and on a click outside the menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
          open ? "bg-subtle text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        Tools
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-white shadow-lg"
      >
        <nav aria-label="Tools" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {GROUPS.map(({ category, tools }) => (
              <section key={category.id} aria-labelledby={`menu-${category.id}`}>
                <h2
                  id={`menu-${category.id}`}
                  className="text-xs font-bold tracking-wide text-muted uppercase"
                >
                  {category.name}
                </h2>
                <ul className="mt-2 space-y-0.5">
                  {tools.map((tool) => {
                    const current = pathname === `/${tool.slug}` || pathname.startsWith(`/${tool.slug}/`);
                    return (
                      <li key={tool.slug}>
                        <Link
                          href={`/${tool.slug}`}
                          title={tool.tagline}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors hover:bg-subtle",
                            current && "bg-brand-soft",
                          )}
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand-strong">
                            <tool.icon className="size-4" aria-hidden />
                          </span>
                          <span className="min-w-0">{tool.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline"
          >
            Browse all free tools <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      </div>
    </div>
  );
}
