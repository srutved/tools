import type { DocumentTheme } from "@/lib/document/theme";
import type { PreparedResume } from "../lib/prepare";

export type LayoutId = "classic" | "modern" | "executive" | "sidebar" | "split";

/** A template is a layout plus a theme, so new looks rarely need new layout code. */
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  layout: LayoutId;
  theme: DocumentTheme;
}

/** Props every layout receives. */
export interface LayoutProps {
  resume: PreparedResume;
  theme: DocumentTheme;
}
