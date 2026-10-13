"use client";

import type { ComponentType } from "react";
import type { DocStyle, PageComponent } from "@/lib/document/primitives";
import type { PreparedResume } from "../lib/prepare";
import { ClassicLayout } from "./layouts/classic";
import { ExecutiveLayout } from "./layouts/executive";
import { ModernLayout } from "./layouts/modern";
import { SIDEBAR_PAGE_MARGIN, SidebarLayout } from "./layouts/sidebar";
import { SplitLayout } from "./layouts/split";
import { PAGE_MARGIN, pageStyle } from "./parts";
import { getTemplate } from "./registry";
import type { LayoutId, LayoutProps } from "./types";

// Page margins apply to *every* PDF page, so content continuing onto page 2 keeps its top margin.
// Full-bleed areas (the Modern header band) reach the edge with negative margins instead.
const LAYOUTS: Record<LayoutId, { Component: ComponentType<LayoutProps>; page: DocStyle }> = {
  classic: { Component: ClassicLayout, page: { paddingVertical: PAGE_MARGIN, paddingHorizontal: 46 } },
  modern: { Component: ModernLayout, page: { padding: PAGE_MARGIN } },
  executive: { Component: ExecutiveLayout, page: { paddingVertical: PAGE_MARGIN, paddingHorizontal: 44 } },
  // The sidebar's columns set their own horizontal padding.
  sidebar: { Component: SidebarLayout, page: { paddingVertical: SIDEBAR_PAGE_MARGIN } },
  split: { Component: SplitLayout, page: { padding: PAGE_MARGIN } },
};

interface ResumeDocumentProps {
  templateId: string;
  resume: PreparedResume;
  Page: PageComponent;
}

/** Renders a resume with the given template onto any render target. */
export function ResumeDocument({ templateId, resume, Page }: ResumeDocumentProps) {
  const template = getTemplate(templateId);
  const { Component, page } = LAYOUTS[template.layout];
  return (
    <Page style={[pageStyle(template.theme), page]}>
      <Component resume={resume} theme={template.theme} />
    </Page>
  );
}
