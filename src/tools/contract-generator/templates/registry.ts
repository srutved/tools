import type { DocumentTheme } from "@/lib/document/theme";

export type ContractLayoutId = "classic" | "modern" | "minimal";

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  layout: ContractLayoutId;
  theme: DocumentTheme;
}

const theme = (accent: string, font: DocumentTheme["font"]): DocumentTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
});

/** Contract designs. Contracts are long and text-heavy, so the designs stay restrained. */
export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "classic-navy",
    name: "Classic Navy",
    description: "Traditional legal look with a centred serif title.",
    layout: "classic",
    theme: theme("#1e3a8a", "serif"),
  },
  {
    id: "classic-black",
    name: "Classic Black",
    description: "Formal black-and-white serif, like a lawyer's draft.",
    layout: "classic",
    theme: theme("#111827", "serif"),
  },
  {
    id: "modern-indigo",
    name: "Modern Indigo",
    description: "Clean sans-serif with an indigo title bar.",
    layout: "modern",
    theme: theme("#4338ca", "sans"),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Friendly and readable, ideal for freelancers.",
    layout: "modern",
    theme: theme("#0f766e", "sans"),
  },
  {
    id: "minimal-slate",
    name: "Minimal Slate",
    description: "Quiet, spacious and easy to read.",
    layout: "minimal",
    theme: theme("#334155", "sans"),
  },
  {
    id: "minimal-burgundy",
    name: "Minimal Burgundy",
    description: "Understated serif with a burgundy accent.",
    layout: "minimal",
    theme: theme("#881337", "serif"),
  },
];

export const DEFAULT_TEMPLATE_ID = CONTRACT_TEMPLATES[0].id;

export function getTemplate(id: string): ContractTemplate {
  return CONTRACT_TEMPLATES.find((template) => template.id === id) ?? CONTRACT_TEMPLATES[0];
}
