"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ResumeTemplateGallery } from "./template-gallery";

/** Template gallery with "Use this template" links into the editor. */
export function TemplatesShowcase() {
  return (
    <ResumeTemplateGallery
      renderAction={(template) => (
        <Link
          href={`/resume-builder?template=${template.id}`}
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3 w-full" })}
        >
          Use this template
        </Link>
      )}
    />
  );
}
