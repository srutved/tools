"use client";

import { Text, View } from "@/lib/document/primitives";
import {
  documentTitle,
  labelsFor,
  ItemsTable,
  Logo,
  MetaTable,
  NotesBlock,
  PartyBlock,
  PaymentBlock,
  SummarySection,
} from "../parts";
import { tint } from "@/lib/document/theme";
import type { LayoutProps } from "../types";

export const SIDEBAR_WIDTH = 170;
/** Gap between the sidebar and the main column. The page's left padding = SIDEBAR_WIDTH + this. */
export const SIDEBAR_GAP = 28;

/**
 * Your business and payment details in a coloured sidebar; the work takes the main column.
 *
 * PDF-safe structure: the page's left padding reserves the sidebar's width, so all main content
 * flows directly on the page (letting tables and totals break across pages cleanly). The sidebar
 * itself is drawn with absolute positioning: its colour repeats on every page, its content sits on
 * the first page only.
 */
export function SidebarLayout({ invoice, computed, qrCode, theme }: LayoutProps) {
  const sidebarMuted = tint(theme.accent, 0.72);

  return (
    <>
      <View
        fixed
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: theme.accent,
        }}
      />
      <View style={{ position: "absolute", top: 0, left: 0, width: SIDEBAR_WIDTH, padding: 22 }}>
        {invoice.logo && (
          <View
            style={{
              backgroundColor: "#ffffff",
              padding: 6,
              borderRadius: 4,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Logo invoice={invoice} maxWidth={110} maxHeight={40} />
          </View>
        )}
        <PartyBlock
          invoice={invoice}
          party={invoice.from}
          title="From"
          color={theme.onAccent}
          mutedColor={sidebarMuted}
        />
        <View style={{ marginTop: 24 }}>
          <PaymentBlock
            invoice={invoice}
            qrCode={qrCode}
            color={theme.onAccent}
            mutedColor={sidebarMuted}
            stacked
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 20,
            lineHeight: 1.2,
            fontWeight: 700,
            color: theme.accent,
            textTransform: "uppercase",
            letterSpacing: 1,
            flexShrink: 1,
            paddingRight: 12,
          }}
        >
          {documentTitle(invoice)}
        </Text>
        <MetaTable invoice={invoice} />
      </View>

      <View style={{ marginTop: 20 }}>
        <PartyBlock invoice={invoice} party={invoice.to} title={labelsFor(invoice).clientHeading} />
      </View>

      <ItemsTable invoice={invoice} computed={computed} theme={theme} compact />
      <SummarySection invoice={invoice} computed={computed} theme={theme} stacked />
      <NotesBlock invoice={invoice} computed={computed} />
    </>
  );
}
