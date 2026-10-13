"use client";

import { Text, View } from "@/lib/document/primitives";
import {
  documentTitle,
  hasPaymentDetails,
  ItemsTable,
  Logo,
  MetaTable,
  NotesBlock,
  PartyBlock,
  PaymentBlock,
  SummarySection,
} from "../parts";
import { INK } from "../theme";
import type { LayoutProps } from "../types";

/** Letterhead-style: your details top-left, title and dates top-right, accent rule beneath. */
export function ClassicLayout({ invoice, computed, qrCode, theme }: LayoutProps) {
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24 }}>
          <Logo invoice={invoice} />
          <PartyBlock invoice={invoice} party={invoice.from} color={theme.accent} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 22,
              lineHeight: 1.2,
              fontWeight: 700,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            {documentTitle(invoice)}
          </Text>
          <MetaTable invoice={invoice} />
        </View>
      </View>

      <View style={{ borderBottomWidth: 1.5, borderBottomColor: theme.accent, marginVertical: 16 }} />

      <PartyBlock invoice={invoice} party={invoice.to} title="Bill to" />

      <ItemsTable invoice={invoice} computed={computed} theme={theme} />
      <SummarySection invoice={invoice} computed={computed} theme={theme} />

      {hasPaymentDetails(invoice, qrCode) && (
        <View style={{ marginTop: 22, paddingTop: 14, borderTopWidth: 0.75, borderTopColor: INK.border }}>
          <PaymentBlock invoice={invoice} qrCode={qrCode} />
        </View>
      )}
      <NotesBlock invoice={invoice} computed={computed} />
    </>
  );
}
