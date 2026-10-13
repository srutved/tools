import type { InvoiceTemplate, TemplateTheme } from "./types";

const theme = (
  accent: string,
  font: TemplateTheme["font"],
  table: TemplateTheme["table"],
): TemplateTheme => ({
  accent,
  onAccent: "#ffffff",
  font,
  table,
});

/**
 * All invoice templates. Five layouts × three themes. To add a template, add an entry here -
 * a new layout is only needed for a genuinely different arrangement of the page.
 */
export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  {
    id: "classic-slate",
    name: "Classic Slate",
    description: "Timeless and professional, with a crisp lined table.",
    layout: "classic",
    theme: theme("#334155", "sans", "lined"),
  },
  {
    id: "classic-navy",
    name: "Classic Navy",
    description: "Traditional serif styling with a fully boxed table.",
    layout: "classic",
    theme: theme("#1e3a8a", "serif", "boxed"),
  },
  {
    id: "classic-forest",
    name: "Classic Forest",
    description: "Calm green accents with easy-to-scan striped rows.",
    layout: "classic",
    theme: theme("#166534", "sans", "striped"),
  },
  {
    id: "modern-indigo",
    name: "Modern Indigo",
    description: "A bold colour band header for a confident first impression.",
    layout: "modern",
    theme: theme("#4f46e5", "sans", "striped"),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Fresh and clean, ideal for agencies and studios.",
    layout: "modern",
    theme: theme("#0f766e", "sans", "lined"),
  },
  {
    id: "modern-crimson",
    name: "Modern Crimson",
    description: "Striking red header with elegant serif type.",
    layout: "modern",
    theme: theme("#b91c1c", "serif", "striped"),
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Black and white, generous whitespace, nothing extra.",
    layout: "minimal",
    theme: theme("#111827", "sans", "lined"),
  },
  {
    id: "minimal-sand",
    name: "Minimal Sand",
    description: "Warm, understated serif look for creative work.",
    layout: "minimal",
    theme: theme("#92400e", "serif", "lined"),
  },
  {
    id: "minimal-sky",
    name: "Minimal Sky",
    description: "Light and airy with a subtle blue accent.",
    layout: "minimal",
    theme: theme("#0369a1", "sans", "lined"),
  },
  {
    id: "sidebar-emerald",
    name: "Sidebar Emerald",
    description: "Your details in a coloured sidebar, the work front and centre.",
    layout: "sidebar",
    theme: theme("#047857", "sans", "striped"),
  },
  {
    id: "sidebar-charcoal",
    name: "Sidebar Charcoal",
    description: "Sleek dark sidebar for a premium feel.",
    layout: "sidebar",
    theme: theme("#1f2937", "sans", "lined"),
  },
  {
    id: "sidebar-plum",
    name: "Sidebar Plum",
    description: "Rich purple sidebar with refined serif type.",
    layout: "sidebar",
    theme: theme("#7e22ce", "serif", "striped"),
  },
  {
    id: "bold-orange",
    name: "Bold Orange",
    description: "Big headline and amount due that clients can't miss.",
    layout: "bold",
    theme: theme("#ea580c", "sans", "striped"),
  },
  {
    id: "bold-black",
    name: "Bold Black",
    description: "High-contrast black with a boxed table.",
    layout: "bold",
    theme: theme("#0a0a0a", "sans", "boxed"),
  },
  {
    id: "bold-royal",
    name: "Bold Royal",
    description: "Royal blue with serif headings for a distinguished look.",
    layout: "bold",
    theme: theme("#1d4ed8", "serif", "lined"),
  },
];

export const DEFAULT_TEMPLATE_ID = INVOICE_TEMPLATES[0].id;

export function getTemplate(id: string): InvoiceTemplate {
  return INVOICE_TEMPLATES.find((template) => template.id === id) ?? INVOICE_TEMPLATES[0];
}
