import type { DocumentTheme } from "@/lib/document/theme";
import type { LayoutId, ResumeTemplate } from "./types";

const theme = (accent: string, font: DocumentTheme["font"]): DocumentTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
});

/** What each layout supports, shown as labels in the template gallery. */
export const LAYOUT_FEATURES: Record<LayoutId, { atsFriendly: boolean; photo: boolean }> = {
  // Single-column layouts read top to bottom, which applicant tracking systems parse most reliably.
  classic: { atsFriendly: true, photo: false },
  modern: { atsFriendly: true, photo: true },
  executive: { atsFriendly: true, photo: false },
  sidebar: { atsFriendly: false, photo: true },
  split: { atsFriendly: false, photo: true },
};

/**
 * All resume templates. Five layouts × three themes. To add a template, add an entry here -
 * a new layout is only needed for a genuinely different arrangement of the page.
 */
export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic-navy",
    name: "Classic Navy",
    description: "Timeless serif resume that every recruiter and ATS reads easily.",
    layout: "classic",
    theme: theme("#1e3a8a", "serif"),
  },
  {
    id: "classic-charcoal",
    name: "Classic Charcoal",
    description: "Clean, conservative and to the point.",
    layout: "classic",
    theme: theme("#1f2937", "sans"),
  },
  {
    id: "classic-burgundy",
    name: "Classic Burgundy",
    description: "Traditional layout with a refined burgundy accent.",
    layout: "classic",
    theme: theme("#881337", "serif"),
  },
  {
    id: "modern-indigo",
    name: "Modern Indigo",
    description: "Colour header and skill tags for a confident first impression.",
    layout: "modern",
    theme: theme("#4338ca", "sans"),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Fresh and friendly, great for product and design roles.",
    layout: "modern",
    theme: theme("#0f766e", "sans"),
  },
  {
    id: "modern-rose",
    name: "Modern Rose",
    description: "Warm header with elegant serif type.",
    layout: "modern",
    theme: theme("#be123c", "serif"),
  },
  {
    id: "executive-slate",
    name: "Executive Slate",
    description: "Section titles in the margin for a polished, senior look.",
    layout: "executive",
    theme: theme("#334155", "sans"),
  },
  {
    id: "executive-forest",
    name: "Executive Forest",
    description: "Understated green serif design for leadership roles.",
    layout: "executive",
    theme: theme("#166534", "serif"),
  },
  {
    id: "executive-copper",
    name: "Executive Copper",
    description: "Distinctive copper accent with classic serif type.",
    layout: "executive",
    theme: theme("#9a3412", "serif"),
  },
  {
    id: "sidebar-emerald",
    name: "Sidebar Emerald",
    description: "Contact details and skills in a coloured sidebar.",
    layout: "sidebar",
    theme: theme("#065f46", "sans"),
  },
  {
    id: "sidebar-midnight",
    name: "Sidebar Midnight",
    description: "Sleek dark sidebar with room for a photo.",
    layout: "sidebar",
    theme: theme("#1e293b", "sans"),
  },
  {
    id: "sidebar-plum",
    name: "Sidebar Plum",
    description: "Rich purple sidebar with refined serif headings.",
    layout: "sidebar",
    theme: theme("#6b21a8", "serif"),
  },
  {
    id: "split-blue",
    name: "Split Blue",
    description: "Two columns that fit a lot on one page.",
    layout: "split",
    theme: theme("#1d4ed8", "sans"),
  },
  {
    id: "split-orange",
    name: "Split Orange",
    description: "Energetic two-column design for creative roles.",
    layout: "split",
    theme: theme("#c2410c", "sans"),
  },
  {
    id: "split-mono",
    name: "Split Mono",
    description: "Black-and-white two columns in serif type.",
    layout: "split",
    theme: theme("#111827", "serif"),
  },
];

export const DEFAULT_TEMPLATE_ID = RESUME_TEMPLATES[0].id;

export function getTemplate(id: string): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0];
}

/** Gallery labels, e.g. ["ATS-friendly", "Photo"]. */
export function templateTags(template: ResumeTemplate): string[] {
  const features = LAYOUT_FEATURES[template.layout];
  return [...(features.atsFriendly ? ["ATS-friendly"] : []), ...(features.photo ? ["Photo"] : [])];
}
