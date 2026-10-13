"use client";

import type { ComponentType } from "react";
import type { DocStyle, PageComponent } from "@/lib/document/primitives";
import type { ComputedInvoice } from "../lib/calculations";
import type { Invoice } from "../schema";
import { BoldLayout } from "./layouts/bold";
import { ClassicLayout } from "./layouts/classic";
import { MinimalLayout } from "./layouts/minimal";
import { ModernLayout } from "./layouts/modern";
import { SIDEBAR_GAP, SIDEBAR_WIDTH, SidebarLayout } from "./layouts/sidebar";
import { PAGE_PADDING, pageStyle } from "./parts";
import { getTemplate } from "./registry";
import type { LayoutId, LayoutProps } from "./types";

// Every layout keeps page margins, because the PDF applies them to *every* page - content that
// continues onto page 2 still gets a top margin. Full-bleed areas (the Modern band, the Sidebar
// column) reach the page edge with negative margins instead of removing the padding.
const LAYOUTS: Record<LayoutId, { Component: ComponentType<LayoutProps>; page: DocStyle }> = {
  classic: { Component: ClassicLayout, page: { padding: PAGE_PADDING } },
  modern: { Component: ModernLayout, page: { padding: PAGE_PADDING } },
  minimal: { Component: MinimalLayout, page: { padding: 48 } },
  // The left padding reserves room for the sidebar on every page.
  sidebar: {
    Component: SidebarLayout,
    page: {
      paddingTop: 32,
      paddingRight: PAGE_PADDING,
      paddingBottom: PAGE_PADDING,
      paddingLeft: SIDEBAR_WIDTH + SIDEBAR_GAP,
    },
  },
  bold: { Component: BoldLayout, page: { padding: PAGE_PADDING } },
};

interface InvoiceDocumentProps {
  invoice: Invoice;
  computed: ComputedInvoice;
  qrCode: string | null;
  Page: PageComponent;
}

/** Renders an invoice with its selected template onto any render target. */
export function InvoiceDocument({ invoice, computed, qrCode, Page }: InvoiceDocumentProps) {
  const template = getTemplate(invoice.templateId);
  const { Component, page } = LAYOUTS[template.layout];
  return (
    <Page style={[pageStyle(template.theme), page]}>
      <Component invoice={invoice} computed={computed} qrCode={qrCode} theme={template.theme} />
    </Page>
  );
}
