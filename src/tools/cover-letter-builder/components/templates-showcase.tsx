"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CoverLetterTemplateGallery } from "./template-gallery";

/** Template gallery with "Use this template" links into the editor. */
export function TemplatesShowcase() {
  return (
    <CoverLetterTemplateGallery
      renderAction={(template) => (
        <Link
          href={`/cover-letter-builder?template=${template.id}`}
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3 w-full" })}
        >
          Use this template
        </Link>
      )}
    />
  );
}
