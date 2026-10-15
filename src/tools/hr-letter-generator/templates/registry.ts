import type { DocumentTheme } from "@/lib/document/theme";

export type LetterLayoutId = "classic" | "modern" | "minimal";

export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  layout: LetterLayoutId;
  theme: DocumentTheme;
}

const theme = (accent: string, font: DocumentTheme["font"]): DocumentTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
});

/** Letterhead designs: formal enough for HR, with the company's name and logo up top. */
export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: "classic-navy",
    name: "Classic Navy",
    description: "A centred letterhead with a double rule, in serif type.",
    layout: "classic",
    theme: theme("#1e3a8a", "serif"),
  },
  {
    id: "classic-maroon",
    name: "Classic Maroon",
    description: "Traditional and formal, in maroon.",
    layout: "classic",
    theme: theme("#7f1d1d", "serif"),
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "A coloured band with your logo and contact details beside it.",
    layout: "modern",
    theme: theme("#1d4ed8", "sans"),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Clean and contemporary in teal.",
    layout: "modern",
    theme: theme("#0f766e", "sans"),
  },
  {
    id: "minimal-slate",
    name: "Minimal Slate",
    description: "Understated, with a thin rule under the letterhead.",
    layout: "minimal",
    theme: theme("#334155", "sans"),
  },
  {
    id: "minimal-violet",
    name: "Minimal Violet",
    description: "Light and modern with a violet accent.",
    layout: "minimal",
    theme: theme("#6d28d9", "sans"),
  },
];

export const DEFAULT_TEMPLATE_ID = LETTER_TEMPLATES[0].id;

export function getTemplate(id: string): LetterTemplate {
  return LETTER_TEMPLATES.find((template) => template.id === id) ?? LETTER_TEMPLATES[0];
}
