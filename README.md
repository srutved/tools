# Srutved Tools

Free, open-source business tools for freelancers and small businesses, live at
**[srutved.com/tools](https://www.srutved.com/tools)**.

- **No sign-up, no watermark, no limits.**
- **Private by design**: everything runs in your browser. Your data is stored on your device and never sent to a server.
- **Real PDFs**: text-based and searchable, with embedded fonts, so what you see in the preview is what you download.

| Category                  | Tools                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Invoicing & GST           | [Invoice Generator](https://www.srutved.com/tools/invoice-generator) · [Proforma Invoice Generator](https://www.srutved.com/tools/proforma-invoice-generator) · [Receipt Generator](https://www.srutved.com/tools/receipt-generator) · [Credit Note Generator](https://www.srutved.com/tools/credit-note-generator) · [Debit Note Generator](https://www.srutved.com/tools/debit-note-generator) · [GST Calculator](https://www.srutved.com/tools/gst-calculator) |
| Quotes, orders & delivery | [Quotation Generator](https://www.srutved.com/tools/quotation-generator) · [Purchase Order Generator](https://www.srutved.com/tools/purchase-order-generator) · [Delivery Challan Generator](https://www.srutved.com/tools/delivery-challan-generator)                                                                                                                                                                                                            |
| HR & payroll              | [Salary Slip Generator](https://www.srutved.com/tools/salary-slip-generator) · [HR Letter Generator](https://www.srutved.com/tools/hr-letter-generator) · [Salary Calculator](https://www.srutved.com/tools/salary-calculator) · [Gratuity Calculator](https://www.srutved.com/tools/gratuity-calculator) · [PF Calculator](https://www.srutved.com/tools/pf-calculator)                                                                                          |
| Loans & investments       | [EMI Calculator](https://www.srutved.com/tools/emi-calculator) · [SIP Calculator](https://www.srutved.com/tools/sip-calculator) · [FD Calculator](https://www.srutved.com/tools/fd-calculator) · [RD Calculator](https://www.srutved.com/tools/rd-calculator) · [PPF Calculator](https://www.srutved.com/tools/ppf-calculator) · [Compound Interest Calculator](https://www.srutved.com/tools/compound-interest-calculator)                                       |
| Resumes & job search      | [Resume Builder](https://www.srutved.com/tools/resume-builder) · [Cover Letter Builder](https://www.srutved.com/tools/cover-letter-builder)                                                                                                                                                                                                                                                                                                                       |
| Agreements & rent         | [Contract Generator](https://www.srutved.com/tools/contract-generator) · [Rent Receipt Generator](https://www.srutved.com/tools/rent-receipt-generator) · [HRA Calculator](https://www.srutved.com/tools/hra-calculator)                                                                                                                                                                                                                                          |

## Invoice Generator

- 15 templates: five layouts (Classic, Modern, Minimal, Sidebar, Bold), each in three styles
- Every ISO 4217 currency, with correct symbols, decimals, digit grouping and the amount in words
- India GST: CGST + SGST or IGST from the place of supply, HSN/SAC codes, "Tax Invoice" titling and export under LUT
- VAT and sales tax with custom labels and mixed rates
- UPI QR codes on rupee invoices, with the exact amount filled in
- Logo upload, discounts, payment links and bank details
- Saved invoice history: reopen, duplicate or delete
- Responsive: a split editor and live preview on desktop, Edit/Preview tabs on mobile

## The invoice engine: quotations, receipts, notes, challans and orders

Eight documents run on the invoice engine (`src/tools/invoice-generator`): invoices, quotations,
proforma invoices, payment receipts, credit notes, debit notes, delivery challans and purchase
orders. Every document has a `kind`; all kind-specific wording, dates and extra fields live in
`lib/document-kind.ts`, so the 15 templates, GST/VAT, currencies and line items work for all of them.

- Kind-specific details: the original invoice and reason on credit and debit notes, payment mode
  and reference on receipts, vehicle, transporter, purpose and delivery address on challans, and
  the ship-to address and quote reference on purchase orders
- One-click conversions: quotation or proforma to invoice, invoice to receipt ("Record payment")
  or to a credit note
- Payment details and the UPI QR code only on invoices and proforma invoices
- Each kind is saved separately ("My receipts", "My purchase orders"...)

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
- Cover letter examples (fresher, internship, career change and more) as landing pages

## Contract Generator

- Service (freelance) agreements, NDAs (one-way or mutual) and statements of work
- Plain-English, balanced clauses assembled from the user's answers in `lib/clauses.ts` (pure and unit-tested)
- Fixed, hourly or milestone fees in any currency; IP assigned on payment or licensed; optional clauses and custom clauses
- Six restrained designs, numbered clauses, signature blocks and "Page x of y" footers in the PDF
- Contract templates (freelance, website development, social media, NDA, mutual NDA, SOW) as landing pages
- Clearly presented as a starting point, not legal advice

## Rent Receipt Generator

- One numbered, dated receipt per month from a single form: a whole financial year (or up to 24 months) in one PDF
- Built for HRA claims in India: landlord PAN (flagged when yearly rent is over ₹1,00,000), amount in words, payment mode
- A revenue stamp box on cash receipts over ₹5,000, and an optional landlord signature on every receipt
- Six designs, about three receipts to an A4 page with cut lines; duplicate a set for the next year

## Salary Slip Generator

- Company logo, employee details (ID, PAN, UAN, bank), working and paid days with loss of pay
- Earnings beside deductions, with suggested components (HRA, PF, ESI, professional tax, TDS) and any currency
- Gross pay, total deductions and net pay in words worked out in `lib/payslip.ts` (pure and unit-tested)
- Six one-page designs; duplicate a slip to make the next month's

## HR Letter Generator

- Offer, appointment, experience, relieving and increment (or promotion) letters, for employees and interns
- Formal wording assembled from the answers in `lib/letters.ts` (pure and unit-tested), referring to the employee as they, she or he
- Letterhead with logo and contact details, signature, an acceptance block for offers and appointments, and a salary annexure built from the CTC
- Six designs; letter templates (offer, appointment, experience, relieving, internship, increment, promotion) as landing pages

## Calculators

- **GST Calculator:** add or remove GST at the GST 2.0 rates (or any rate), with the CGST/SGST or IGST split
- **Salary Calculator:** CTC to monthly in-hand pay after PF, gratuity, professional tax and income tax under both regimes for FY 2026-27; hands the figures to the salary slip generator
- **HRA Calculator:** tax-free HRA under the 8-metro rule from FY 2026-27; hands the rent to the rent receipt generator
- **Gratuity and PF calculators:** gratuity under the labour codes (including fixed-term staff) and the EPF corpus at retirement
- **Loans & investments:** EMI (with the repayment schedule), SIP (with step-up), FD, RD, PPF and compound interest calculators

Calculators share `src/components/tool/calculator.tsx`; their maths lives in each tool's `lib/` with unit tests.

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
│  ├─ contract-generator/   Tool page + /templates contract template pages
│  ├─ rent-receipt-generator/
│  ├─ salary-slip-generator/
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
   ├─ contract-generator/   Clause builder (lib/clauses.ts), designs and contract templates
   ├─ rent-receipt-generator/ One receipt per month (lib/receipts.ts) and receipt designs
   ├─ salary-slip-generator/ Payslip totals (lib/payslip.ts) and payslip designs
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

### Examples and formats (landing pages)

Each `UseCase` (`src/components/tool/use-case.ts`) is a landing page for one search - "software
engineer resume", "invoice format for photographers" - with a complete example document, a short
guide and FAQs. They live with their tool (`resume-builder/examples.ts`, `invoice-generator/examples.ts`)
and are rendered by the shared `UseCasePage` at `/<tool>/examples/<slug>` or `/<tool>/formats/<slug>`.

"Use this example" opens the tool with `?example=<slug>`; the example is added as a new document, so
nothing the visitor saved is overwritten. `src/tools/examples.test.ts` checks that every example passes
the tool's export validation, so it downloads without errors. To add one, append an entry to the list -
the page, social image and sitemap entry follow automatically.

### Adding a tool

1. Create `src/tools/<tool-name>/` with its schema, logic, components and `content.ts`.
2. Register it in `src/tools/registry.ts` with its category. The hub, the header menu, the footer and the sitemap pick it up automatically.
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
