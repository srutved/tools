import type { DocumentTheme } from "@/lib/document/theme";

export type PayslipLayoutId = "classic" | "modern" | "minimal";

export interface PayslipTemplate {
  id: string;
  name: string;
  description: string;
  layout: PayslipLayoutId;
  theme: DocumentTheme;
}

const theme = (accent: string, font: DocumentTheme["font"]): DocumentTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
});

export const PAYSLIP_TEMPLATES: PayslipTemplate[] = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    description: "The traditional boxed payslip with ruled tables.",
    layout: "classic",
    theme: theme("#1d4ed8", "sans"),
  },
  {
    id: "classic-charcoal",
    name: "Classic Charcoal",
    description: "Boxed and formal, in charcoal grey.",
    layout: "classic",
    theme: theme("#374151", "serif"),
  },
  {
    id: "modern-violet",
    name: "Modern Violet",
    description: "A coloured header band and a bold net pay panel.",
    layout: "modern",
    theme: theme("#6d28d9", "sans"),
  },
  {
    id: "modern-emerald",
    name: "Modern Emerald",
    description: "Fresh and modern in emerald green.",
    layout: "modern",
    theme: theme("#047857", "sans"),
  },
  {
    id: "minimal-slate",
    name: "Minimal Slate",
    description: "Light and airy, ideal for printing.",
    layout: "minimal",
    theme: theme("#334155", "sans"),
  },
  {
    id: "minimal-rose",
    name: "Minimal Rose",
    description: "Understated with a rose accent.",
    layout: "minimal",
    theme: theme("#be123c", "serif"),
  },
];

export const DEFAULT_TEMPLATE_ID = PAYSLIP_TEMPLATES[0].id;

export function getTemplate(id: string): PayslipTemplate {
  return PAYSLIP_TEMPLATES.find((template) => template.id === id) ?? PAYSLIP_TEMPLATES[0];
}
