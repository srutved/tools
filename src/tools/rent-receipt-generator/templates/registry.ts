import type { DocumentTheme } from "@/lib/document/theme";

export type ReceiptLayoutId = "classic" | "modern" | "minimal";

export interface ReceiptTemplate {
  id: string;
  name: string;
  description: string;
  layout: ReceiptLayoutId;
  theme: DocumentTheme;
}

const theme = (accent: string, font: DocumentTheme["font"]): DocumentTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
});

export const RECEIPT_TEMPLATES: ReceiptTemplate[] = [
  {
    id: "classic-navy",
    name: "Classic Navy",
    description: "A bordered receipt with a centred title.",
    layout: "classic",
    theme: theme("#1e3a8a", "serif"),
  },
  {
    id: "classic-maroon",
    name: "Classic Maroon",
    description: "Traditional serif receipt in maroon.",
    layout: "classic",
    theme: theme("#7f1d1d", "serif"),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Clean layout with a coloured side bar.",
    layout: "modern",
    theme: theme("#0f766e", "sans"),
  },
  {
    id: "modern-indigo",
    name: "Modern Indigo",
    description: "Crisp and modern in indigo.",
    layout: "modern",
    theme: theme("#4338ca", "sans"),
  },
  {
    id: "minimal-slate",
    name: "Minimal Slate",
    description: "Simple, light and printer-friendly.",
    layout: "minimal",
    theme: theme("#334155", "sans"),
  },
  {
    id: "minimal-green",
    name: "Minimal Green",
    description: "Understated with a green accent.",
    layout: "minimal",
    theme: theme("#15803d", "sans"),
  },
];

export const DEFAULT_TEMPLATE_ID = RECEIPT_TEMPLATES[0].id;

export function getTemplate(id: string): ReceiptTemplate {
  return RECEIPT_TEMPLATES.find((template) => template.id === id) ?? RECEIPT_TEMPLATES[0];
}
