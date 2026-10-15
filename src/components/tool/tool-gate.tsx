"use client";

import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { trackToolEvent } from "@/lib/analytics";

/** `?example=` opens a landing-page example as a new document (see exampleFromQuery). */
const EXAMPLE_PARAM = "example";

/**
 * Figures handed over by the calculators, each opening a new document: the salary calculator
 * sends ?basic=&hra=&special=&pf=&pt=&tds= to the salary slip generator, and the HRA calculator
 * sends ?rent= to the rent receipt generator.
 */
const HANDOFF_PARAMS = ["basic", "hra", "special", "pf", "pt", "tds", "rent"];

/**
 * Query parameters that only apply to the first load and are removed afterwards, so a reload
 * doesn't open the same example or handed-over document again.
 */
const ONE_TIME_PARAMS = [EXAMPLE_PARAM, ...HANDOFF_PARAMS];

function ToolLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-subtle/60 text-muted">
      <LoaderCircle className="mr-2 size-5 animate-spin" aria-hidden /> Loading the {label}…
    </div>
  );
}

interface ToolGateProps {
  /** e.g. "resume builder", for the loading message. */
  label: string;
  /** Renders the tool once the browser's storage is available, with the page's query parameters. */
  render: (query: URLSearchParams) => ReactNode;
}

/**
 * Entry point for every document tool. The editor needs the browser's storage, so a placeholder is
 * rendered on the server. Query parameters (?template=, ?example=) come from Next.js rather than
 * window.location, which still shows the previous URL while a client-side navigation renders.
 */
export function ToolGate(props: ToolGateProps) {
  return (
    <Suspense fallback={<ToolLoading label={props.label} />}>
      <ToolGateInner {...props} />
    </Suspense>
  );
}

function ToolGateInner({ label, render }: ToolGateProps) {
  const hydrated = useHydrated();
  const searchParams = useSearchParams();

  // Once the tool has read them, drop one-time parameters so a reload doesn't apply them again.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!ONE_TIME_PARAMS.some((name) => url.searchParams.has(name))) return;
    const example = url.searchParams.get(EXAMPLE_PARAM);
    if (example) trackToolEvent("Example Opened", { example });
    ONE_TIME_PARAMS.forEach((name) => url.searchParams.delete(name));
    window.history.replaceState(window.history.state, "", url);
  }, [searchParams]);

  if (!hydrated) return <ToolLoading label={label} />;
  return render(new URLSearchParams(searchParams.toString()));
}
