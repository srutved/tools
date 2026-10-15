"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { DocumentKind } from "../lib/document-kind";
import { InvoiceTemplateGallery } from "./template-gallery";

/** Template gallery with "Use this template" links into the editor of the given tool. */
export function TemplatesShowcase({ kind = "invoice", toolSlug }: { kind?: DocumentKind; toolSlug: string }) {
  return (
    <InvoiceTemplateGallery
      kind={kind}
      renderAction={(template) => (
        <Link
          href={`/${toolSlug}?template=${template.id}`}
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3 w-full" })}
        >
          Use this template
        </Link>
      )}
    />
  );
}
