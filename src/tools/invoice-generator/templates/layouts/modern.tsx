"use client";

import { Text, View } from "@/lib/document/primitives";
import {
  documentTitle,
  ItemsTable,
  Logo,
  MetaTable,
  NotesBlock,
  PAGE_PADDING,
  PartyBlock,
  PaymentBlock,
  SummarySection,
} from "../parts";
import { tint } from "../theme";
import type { LayoutProps } from "../types";

/** Full-width colour band header, then parties side by side in soft cards. */
export function ModernLayout({ invoice, computed, qrCode, theme }: LayoutProps) {
  const card = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 12,
    borderRadius: 6,
    backgroundColor: tint(theme.accent, 0.94),
  } as const;

  return (
    <>
      <View
        style={{
          backgroundColor: theme.accent,
          // Bleed to the page edges through the page margin.
          marginTop: -PAGE_PADDING,
          marginHorizontal: -PAGE_PADDING,
          paddingHorizontal: PAGE_PADDING,
          paddingTop: 30,
          paddingBottom: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24 }}>
          {invoice.logo && (
            <View
              style={{
                backgroundColor: "#ffffff",
                padding: 6,
                borderRadius: 4,
                alignSelf: "flex-start",
                marginBottom: 12,
              }}
            >
              <Logo invoice={invoice} maxHeight={40} />
            </View>
          )}
          <Text
            style={{
              fontSize: 26,
              lineHeight: 1.15,
              fontWeight: 700,
              color: theme.onAccent,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {documentTitle(invoice)}
          </Text>
          <Text style={{ color: tint(theme.accent, 0.75), fontSize: 10, marginTop: 4 }}>
            {invoice.from.name}
          </Text>
        </View>
        <MetaTable invoice={invoice} labelColor={tint(theme.accent, 0.7)} valueColor={theme.onAccent} />
      </View>

      <View style={{ flexDirection: "row", marginTop: 22 }}>
        <View style={[card, { marginRight: 10 }]}>
          <PartyBlock invoice={invoice} party={invoice.from} title="From" />
        </View>
        <View style={card}>
          <PartyBlock invoice={invoice} party={invoice.to} title="Bill to" />
        </View>
      </View>

      <ItemsTable invoice={invoice} computed={computed} theme={theme} />
      <SummarySection invoice={invoice} computed={computed} theme={theme} />

      <View style={{ marginTop: 22 }}>
        <PaymentBlock invoice={invoice} qrCode={qrCode} />
      </View>
      <NotesBlock invoice={invoice} computed={computed} />
    </>
  );
}
