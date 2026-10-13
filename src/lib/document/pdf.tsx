"use client";

/**
 * PDF render target. This module pulls in @react-pdf/renderer (~1 MB), so import it lazily,
 * only when the user actually downloads a file:
 *
 *   const { renderPdf } = await import("@/lib/document/pdf");
 */

import { Document, Font, Image, Link, Page, pdf, Text, View, type Styles } from "@react-pdf/renderer";
import type { ReactElement, ReactNode } from "react";
import { BASE_PATH } from "@/config/site";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DocumentPrimitivesProvider,
  flattenStyle,
  type DocStyle,
  type DocStyleProp,
  type DocumentPrimitives,
} from "./primitives";

// Served from /public/fonts (under the /tools basePath). Noto covers ₹, €, £, ¥, ₦, ₩ and more.
const FONT_BASE = `${BASE_PATH}/fonts`;
const FONT_FAMILIES = { sans: "Noto Sans", serif: "Noto Serif" } as const;

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  // Every weight/style a template uses must be registered, or rendering fails.
  for (const [family, file] of [
    [FONT_FAMILIES.sans, "NotoSans"],
    [FONT_FAMILIES.serif, "NotoSerif"],
  ] as const) {
    Font.register({
      family,
      fonts: [
        { src: `${FONT_BASE}/${file}-Regular.ttf`, fontWeight: 400 },
        { src: `${FONT_BASE}/${file}-Bold.ttf`, fontWeight: 700 },
        { src: `${FONT_BASE}/${file}-Italic.ttf`, fontWeight: 400, fontStyle: "italic" },
      ],
    });
  }
  // Don't hyphenate words when wrapping - keeps names, emails and IDs intact.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

type PdfStyle = Styles[string];

function toPdfStyle(style: DocStyleProp | undefined): PdfStyle {
  const { fontFamily, borderStyle, ...rest } = flattenStyle(style) as DocStyle;
  const result: PdfStyle = { ...(rest as PdfStyle) };
  if (fontFamily) result.fontFamily = FONT_FAMILIES[fontFamily];
  if (borderStyle) result.borderStyle = borderStyle;
  return result;
}

const pdfPrimitives: DocumentPrimitives = {
  View: ({ style, children, keepTogether, fixed }) => (
    // Only pass `fixed` when true: react-pdf checks whether the prop *exists* (`"fixed" in props`),
    // so even fixed={undefined} would stop the block from ever moving to the next page.
    <View style={toPdfStyle(style)} wrap={!keepTogether} {...(fixed ? { fixed: true } : {})}>
      {children}
    </View>
  ),
  Text: ({ style, children }) => (
    <Text style={{ fontSize: DEFAULT_FONT_SIZE, lineHeight: DEFAULT_LINE_HEIGHT, ...toPdfStyle(style) }}>
      {children}
    </Text>
  ),
  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt attribute
  Image: ({ src, style }) => <Image src={src} style={toPdfStyle(style)} />,
  Link: ({ href, style, children }) => (
    <Link src={href} style={{ textDecoration: "none", ...toPdfStyle(style) }}>
      {children}
    </Link>
  ),
};

interface PdfPageProps {
  style?: DocStyleProp;
  children: ReactNode;
}

/** One A4 PDF page; content that overflows continues on further pages automatically. */
export function PdfPage({ style, children }: PdfPageProps) {
  return (
    <Page size="A4" style={toPdfStyle(style)} wrap>
      {children}
    </Page>
  );
}

interface RenderPdfOptions {
  title: string;
  author: string;
  /** The document's pages, built with <PdfPage> and the shared primitives. */
  children: ReactElement;
}

/** Renders a document to a PDF Blob in the browser. */
export async function renderPdf({ title, author, children }: RenderPdfOptions): Promise<Blob> {
  registerFonts();
  const document = (
    <Document title={title} author={author} creator="Srutved Tools" producer="Srutved Tools">
      <DocumentPrimitivesProvider primitives={pdfPrimitives}>{children}</DocumentPrimitivesProvider>
    </Document>
  );
  return pdf(document).toBlob();
}
