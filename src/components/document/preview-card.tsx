import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ScaledPage } from "./scaled-page";

/** The live preview panel beside every document editor. */
export function PreviewCard({ children }: { children: ReactNode }) {
  return (
    <Card className="p-3 sm:p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">Live preview</p>
      <ScaledPage className="shadow-md ring-1 ring-border">{children}</ScaledPage>
    </Card>
  );
}
