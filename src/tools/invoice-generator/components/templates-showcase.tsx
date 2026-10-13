"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { InvoiceTemplateGallery } from "./template-gallery";

/** Template gallery with "Use this template" links into the editor. */
export function TemplatesShowcase() {
  return (
    <InvoiceTemplateGallery
      renderAction={(template) => (
        <Link
          href={`/invoice-generator?template=${template.id}`}
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3 w-full" })}
        >
          Use this template
        </Link>
      )}
    />
  );
}
