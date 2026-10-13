# Contributing to Srutved Tools

Thanks for helping! Bug reports, template ideas and pull requests are all welcome.

## Setup

```bash
npm install
npm run dev   # http://localhost:3000/tools
```

Node.js 20.9 or newer is required.

## Before opening a pull request

```bash
npm run check    # lint + type-check + unit tests
npm run build    # make sure the production build passes
npm run format   # format with Prettier
```

CI runs the same checks on every pull request.

## Guidelines

- **Keep tools self-contained.** Everything specific to a tool lives in `src/tools/<tool>/`. Shared
  building blocks belong in `src/components`, `src/lib` or `src/shared`.
- **Put business logic in pure functions** (`src/tools/<tool>/lib`) and cover it with unit tests.
  UI components should not calculate totals, taxes or formats themselves.
- **Validate with Zod.** Stored data uses a lenient schema; stricter rules apply only on export.
- **Stay local-first.** Tools must work without a server or account, and must never send user data
  anywhere.
- **Check the PDF, not just the preview.** When you change a template, download a PDF with long
  names, many line items (enough for two pages) and a serif theme, then confirm nothing overlaps or
  splits awkwardly.
- **Accessibility.** Every control needs a label, keyboard support and visible focus.
- **No user-facing jargon.** Copy should be clear to a freelancer, not a developer.

## Document templates and the PDF engine

Templates use the primitives in `src/lib/document/primitives.tsx` and only the style properties
declared in `DocStyle`. Two rules keep PDFs faithful to the preview:

1. Use `keepTogether` on blocks that must not split across pages (table rows, totals).
2. Don't rely on inheriting font size or line height. `Text` sets both explicitly, and you can
   override them per element.

## Commit messages

Use short, imperative messages with a type prefix, for example `feat: add Bold layout`,
`fix: keep totals on one page`, `docs: explain template themes`.

## Reporting security issues

Please email hello@srutved.com rather than opening a public issue.
