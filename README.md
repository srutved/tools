# Srutved Tools

Free, open-source business tools for freelancers and small businesses, live at
**[srutved.com/tools](https://www.srutved.com/tools)**.

- **No sign-up, no watermark, no limits.**
- **Private by design**: everything runs in your browser. Your data is stored on your device and never sent to a server.
- **Real PDFs**: text-based and searchable, with embedded fonts, so what you see in the preview is what you download.

| Tool                                                                       | Status        |
| -------------------------------------------------------------------------- | ------------- |
| [Invoice Generator](https://www.srutved.com/tools/invoice-generator)       | ✅ Live       |
| [Quotation Generator](https://www.srutved.com/tools/quotation-generator)   | ✅ Live       |
| [Resume Builder](https://www.srutved.com/tools/resume-builder)             | ✅ Live       |
| [Cover Letter Builder](https://www.srutved.com/tools/cover-letter-builder) | ✅ Live       |
| Contract Generator                                                         | 🛠 Coming soon |

## Invoice Generator

- 15 templates: five layouts (Classic, Modern, Minimal, Sidebar, Bold), each in three styles
- Every ISO 4217 currency, with correct symbols, decimals, digit grouping and the amount in words
- India GST: CGST + SGST or IGST from the place of supply, HSN/SAC codes, "Tax Invoice" titling and export under LUT
- VAT and sales tax with custom labels and mixed rates
- UPI QR codes on rupee invoices, with the exact amount filled in
- Logo upload, discounts, payment links and bank details
- Saved invoice history: reopen, duplicate or delete
- Responsive: a split editor and live preview on desktop, Edit/Preview tabs on mobile

## Quotation Generator

Runs on the invoice engine (`src/tools/invoice-generator`): every document has a `kind` of
`invoice` or `quote`, and all kind-specific wording lives in `lib/document-kind.ts`.

- The same 15 templates, currencies, GST/VAT and line items as invoices
- Quotation wording throughout: "Quotation", "Valid until", "Quoted total"; no payment details
- Convert an accepted quotation into an invoice in one click
- Saved separately from invoices ("My quotations")

## Resume Builder

- 15 templates: five layouts (Classic, Modern, Executive, Sidebar, Split), each in three styles
- ATS-friendly single-column layouts, labelled in the template gallery
- Experience, education, skills, projects, certifications and languages
- Custom sections in three formats (entries, bullet list or paragraph), placed in either column
- Custom personal details (nationality, visa status...) next to the contact details
- Rename, reorder or hide any section
- Optional round profile photo on the templates designed for one
- Clickable email, phone and links in the PDF
- Saved resumes: duplicate one to tailor it for each job

## Cover Letter Builder

A companion to the resume builder: letters use the resume's personal details and are drawn in the
resume templates' designs, so a resume and letter with the same template look like a set.

- 15 designs, one per resume template
- Copy your details (and design) from a saved resume in one click; new letters start from your latest resume
- Proper letter layout: date, recipient, subject, greeting, paragraphs and sign-off
- Saved letters with duplicate, for tailoring one per job

## Tech stack

[Next.js 16](https://nextjs.org) (App Router, every page pre-rendered) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · react-hook-form + Zod · [@react-pdf/renderer](https://react-pdf.org) · Vitest

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3200/tools](http://localhost:3200/tools). The app lives under the `/tools` base path.

| Script           | What it does                            |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Start the dev server                    |
| `npm run build`  | Production build                        |
| `npm run check`  | Lint, type-check and run the unit tests |
| `npm test`       | Unit tests (Vitest)                     |
| `npm run format` | Format with Prettier                    |

## Architecture

```
src/
├─ app/                     Routes only - thin files that compose components
│  ├─ page.tsx              /tools hub, generated from the tool registry
│  ├─ invoice-generator/    Tool page + /templates gallery page
│  ├─ quotation-generator/  Tool page + /templates gallery page (invoice engine)
│  ├─ resume-builder/       Tool page + /templates gallery page
│  ├─ cover-letter-builder/ Tool page + /templates gallery page
│  └─ sitemap.ts            /tools/sitemap.xml
├─ components/
│  ├─ ui/                   Design-system primitives (Button, Input, Dialog…)
│  ├─ layout/               Site header and footer
│  ├─ tool/                 Shared tool shell: page layout, editor/preview workspace, toolbar,
│  │                        form fields, repeatable entry lists, template gallery, saved-document list
│  └─ document/             Scaled A4 page preview and the live preview card
├─ lib/
│  ├─ document/             Render-once document primitives (web + PDF targets) and shared theme
│  ├─ saved-documents.ts    Local storage of each tool's saved documents
│  ├─ currency.ts, amount-in-words.ts, date.ts, storage.ts, seo.ts …
├─ shared/                  Data shared across tools (business profile)
├─ hooks/                   Shared hooks, incl. use-document-library (autosave, new, open,
│                           duplicate, delete) and use-pdf-export (validate, download, print)
└─ tools/
   ├─ registry.ts           Every tool; drives the hub, navigation and sitemap
   ├─ resume-builder/       Same structure as the invoice generator
   ├─ cover-letter-builder/ Reuses the resume's details, editor section and template designs
   └─ invoice-generator/    One self-contained folder per tool
      ├─ schema.ts          Zod schemas (stored drafts vs. export validation)
      ├─ lib/               Pure business logic + unit tests (tax, totals, UPI, GST)
      ├─ templates/         Layouts, shared invoice parts and the template registry
      ├─ components/        Editor, template gallery, invoice list
      ├─ store.ts           Saved invoices (localStorage)
      ├─ export.ts          PDF export (loads the PDF engine on demand)
      └─ content.ts         Page copy, how-to and FAQs (SEO)
```

### Documents are written once

Templates are written against four primitives, `View`, `Text`, `Image` and `Link`, from
`src/lib/document/primitives.tsx`. The same template code renders to:

- **the DOM** (`web.tsx`), for the live preview and gallery thumbnails, and
- **a real PDF** (`pdf.tsx`) through `@react-pdf/renderer`, loaded only when someone downloads.

So the preview and the downloaded PDF can't drift apart. The primitives also fix the classic
"looks fine on screen, broken in the PDF" bugs centrally: explicit font sizes and line heights on
every text node, embedded Noto fonts (with ₹, €, ¥ and more), and rows and totals that never split
across a page break.

Every template of every tool is rendered to a real PDF in the test suite (each tool's
`templates/pdf.test.ts`), including multi-page documents. Set `PDF_OUT=<folder>` to write the files out and check them by eye.

### Adding a template

Add an entry to the tool's `templates/registry.ts`, e.g.
`src/tools/invoice-generator/templates/registry.ts`. A template is a layout plus a
theme (accent colour and font, plus table style for invoices), so most new looks need no layout code.

### Adding a tool

1. Create `src/tools/<tool-name>/` with its schema, logic, components and `content.ts`.
2. Register it in `src/tools/registry.ts`. The hub, header, footer and sitemap pick it up automatically.
3. Add `src/app/<tool-name>/page.tsx`, which wraps your tool in the shared `<ToolPage>`.
4. Reuse the shared building blocks for a consistent UI: `ToolWorkspace`, `DocumentToolbar`, the form fields and
   `EntryList`, `useDocumentLibrary`, `usePdfExport`, `TemplateGallery`, `TemplatesPage` and the document primitives.
   The resume builder is a compact example of a tool built from them.

## Deployment

This app is deployed on its own and served at `srutved.com/tools` through a rewrite on the main site.
Every page declares its canonical URL on `srutved.com`, so search engines credit the main domain.
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

[MIT](LICENSE) © Srutved. Fonts in `public/fonts` are Noto Sans and Noto Serif, licensed under the
[SIL Open Font License](public/fonts/OFL.txt).

---

Built by [Srutved](https://www.srutved.com), an app development company for startups.
Need something custom built? [Talk to us](https://www.srutved.com/contact).
