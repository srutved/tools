"use client";

/**
 * Render-target-agnostic document primitives.
 *
 * Document templates (invoices, resumes, contracts...) are written once against <View>, <Text>,
 * <Image> and <Link> from this module. The same template then renders:
 *   - to the DOM, for the live preview and gallery thumbnails (see ./web.tsx), and
 *   - to a real, text-based PDF via @react-pdf/renderer (see ./pdf.tsx).
 *
 * Styles use the subset of CSS that both targets support. Lengths are numbers in points;
 * the web target draws a 595 × 842 A4 page at 1pt = 1px and scales it to fit.
 */

import { createContext, useContext, type ComponentType, type ReactNode } from "react";

/** A4 in points. The web target renders 1pt as 1px, then scales the page with CSS. */
export const A4 = { width: 595, height: 842 } as const;

/**
 * Every Text gets an explicit line height. The PDF engine passes an inherited line height down as an
 * absolute size, so a large heading inside 9pt body text would get a 13pt line and overlap the
 * line below - while browsers inherit it as a ratio and look fine. Never inheriting avoids that.
 */
export const DEFAULT_LINE_HEIGHT = 1.4;

/**
 * Every Text also gets an explicit font size: the PDF engine resolves a line-height ratio against
 * the element's *own* font size, falling back to 18pt when it has none - which double-spaces 9pt
 * text that merely inherited its size.
 */
export const DEFAULT_FONT_SIZE = 9;

export type DocFont = "sans" | "serif";

export interface DocStyle {
  // Layout (flexbox)
  display?: "flex" | "none";
  flexDirection?: "row" | "column";
  flexWrap?: "wrap" | "nowrap";
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  alignSelf?: "flex-start" | "flex-end" | "center" | "stretch";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  position?: "relative" | "absolute";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  // Box
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  // Decoration
  backgroundColor?: string;
  opacity?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  borderStyle?: "solid" | "dashed";
  borderRadius?: number;
  objectFit?: "contain" | "cover";
  // Text
  color?: string;
  fontFamily?: DocFont;
  fontSize?: number;
  /** Only the registered faces exist in PDFs: regular, bold and regular italic. */
  fontWeight?: 400 | 700;
  fontStyle?: "normal" | "italic";
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "right" | "center";
  textTransform?: "none" | "uppercase" | "capitalize";
  textDecoration?: "none" | "underline";
}

export type DocStyleProp = DocStyle | (DocStyle | false | null | undefined)[];

export interface ViewProps {
  style?: DocStyleProp;
  children?: ReactNode;
  /** PDF only: keep this block on one page instead of splitting it across a page break. */
  keepTogether?: boolean;
  /** PDF: repeat on every page (use for page backgrounds). Web: rendered once. */
  fixed?: boolean;
  /**
   * Render in PDFs only, e.g. a running footer: the on-screen preview is one continuous page, so
   * page furniture would land in the middle of the content there.
   */
  pdfOnly?: boolean;
}

export interface TextProps {
  style?: DocStyleProp;
  children?: ReactNode;
}

export interface ImageProps {
  src: string;
  /** Alternative text for the on-screen preview (PDF images carry no alt text). */
  alt: string;
  style?: DocStyleProp;
}

export interface LinkProps {
  href: string;
  style?: DocStyleProp;
  children?: ReactNode;
}

export interface PageNumberProps {
  style?: DocStyleProp;
}

export interface DocumentPrimitives {
  View: (props: ViewProps) => ReactNode;
  Text: (props: TextProps) => ReactNode;
  Image: (props: ImageProps) => ReactNode;
  Link: (props: LinkProps) => ReactNode;
  PageNumber: (props: PageNumberProps) => ReactNode;
}

/** The page component of a render target: WebPage for screen, PdfPage for PDF. */
export type PageComponent = ComponentType<{ style?: DocStyleProp; children: ReactNode }>;

/** Flattens a style array, dropping falsy entries (lets templates write `[base, isActive && active]`). */
export function flattenStyle(style: DocStyleProp | undefined): DocStyle {
  if (!style) return {};
  if (!Array.isArray(style)) return style;
  return Object.assign({}, ...style.filter(Boolean));
}

const PrimitivesContext = createContext<DocumentPrimitives | null>(null);

export function DocumentPrimitivesProvider({
  primitives,
  children,
}: {
  primitives: DocumentPrimitives;
  children: ReactNode;
}) {
  return <PrimitivesContext.Provider value={primitives}>{children}</PrimitivesContext.Provider>;
}

function usePrimitives(): DocumentPrimitives {
  const primitives = useContext(PrimitivesContext);
  if (!primitives) throw new Error("Document primitives used outside a <DocumentPrimitivesProvider>.");
  return primitives;
}

export function View(props: ViewProps) {
  const { View: Impl } = usePrimitives();
  return <Impl {...props} />;
}

export function Text(props: TextProps) {
  const { Text: Impl } = usePrimitives();
  return <Impl {...props} />;
}

export function Image(props: ImageProps) {
  const { Image: Impl } = usePrimitives();
  return <Impl {...props} />;
}

export function Link(props: LinkProps) {
  const { Link: Impl } = usePrimitives();
  return <Impl {...props} />;
}

/**
 * "Page 2 of 5". PDF only - the on-screen preview is one continuous page, so it renders nothing
 * there. Place it inside a `fixed` View so it repeats on every page.
 */
export function PageNumber(props: PageNumberProps) {
  const { PageNumber: Impl } = usePrimitives();
  return <Impl {...props} />;
}
