"use client";

import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

/** Query parameters that only apply to the first load and are removed afterwards. */
const ONE_TIME_PARAMS = ["example"];

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
    ONE_TIME_PARAMS.forEach((name) => url.searchParams.delete(name));
    window.history.replaceState(window.history.state, "", url);
  }, [searchParams]);

  if (!hydrated) return <ToolLoading label={label} />;
  return render(new URLSearchParams(searchParams.toString()));
}
