"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  A4,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DocumentPrimitivesProvider,
  flattenStyle,
  type DocStyle,
  type DocStyleProp,
  type DocumentPrimitives,
} from "./primitives";

export { A4 } from "./primitives";

const FONT_STACKS = {
  sans: "var(--font-doc-sans), 'Noto Sans', sans-serif",
  serif: "var(--font-doc-serif), 'Noto Serif', serif",
} as const;

function toCss(style: DocStyleProp | undefined): CSSProperties {
  const { fontFamily, paddingHorizontal, paddingVertical, marginHorizontal, marginVertical, ...rest } =
    flattenStyle(style) as DocStyle;

  const css: CSSProperties = { ...(rest as CSSProperties) };
  if (fontFamily) css.fontFamily = FONT_STACKS[fontFamily];
  if (paddingHorizontal !== undefined) css.paddingLeft = css.paddingRight = paddingHorizontal;
  if (paddingVertical !== undefined) css.paddingTop = css.paddingBottom = paddingVertical;
  if (marginHorizontal !== undefined) css.marginLeft = css.marginRight = marginHorizontal;
  if (marginVertical !== undefined) css.marginTop = css.marginBottom = marginVertical;
  // Borders need an explicit style on the web; react-pdf assumes solid.
  if (
    css.borderWidth ||
    css.borderTopWidth ||
    css.borderBottomWidth ||
    css.borderLeftWidth ||
    css.borderRightWidth
  ) {
    css.borderStyle = css.borderStyle ?? "solid";
  }
  return css;
}

// Match react-pdf's defaults: every View is a flex column and boxes use border-box sizing.
const VIEW_DEFAULTS: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  minWidth: 0,
  position: "relative",
};

const webPrimitives: DocumentPrimitives = {
  View: ({ style, children, pdfOnly }) =>
    pdfOnly ? null : <div style={{ ...VIEW_DEFAULTS, ...toCss(style) }}>{children}</div>,
  Text: ({ style, children }) => (
    <div
      style={{
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        fontSize: DEFAULT_FONT_SIZE,
        lineHeight: DEFAULT_LINE_HEIGHT,
        ...toCss(style),
      }}
    >
      {children}
    </div>
  ),
  // eslint-disable-next-line @next/next/no-img-element -- data URLs drawn inside a document, not page images
  Image: ({ src, alt, style }) => <img src={src} alt={alt} style={{ display: "block", ...toCss(style) }} />,
  Link: ({ href, style, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", ...toCss(style) }}
    >
      {children}
    </a>
  ),
  // The preview is one continuous page, so page numbers only appear in the PDF.
  PageNumber: () => null,
};

/** Renders document primitives as DOM elements. */
export function WebDocument({ children }: { children: ReactNode }) {
  return <DocumentPrimitivesProvider primitives={webPrimitives}>{children}</DocumentPrimitivesProvider>;
}

/** One A4 page on screen. Grows taller than A4 when content overflows, as the PDF adds pages. */
export function WebPage({ style, children }: { style?: DocStyleProp; children: ReactNode }) {
  return (
    <div
      style={{
        ...VIEW_DEFAULTS,
        width: A4.width,
        minHeight: A4.height,
        backgroundColor: "#ffffff",
        ...toCss(style),
      }}
    >
      {children}
    </div>
  );
}
