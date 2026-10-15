"use client";

import { Text, View } from "@/lib/document/primitives";
import {
  documentTitle,
  labelsFor,
  hasPaymentDetails,
  ItemsTable,
  Label,
  Logo,
  MetaTable,
  money,
  NotesBlock,
  PartyBlock,
  PaymentBlock,
  SummarySection,
} from "../parts";
import { INK } from "@/lib/document/theme";
import type { LayoutProps } from "../types";

/** Quiet and spacious: thin rules, no fills, the accent reserved for the amount due. */
export function MinimalLayout({ invoice, computed, qrCode, theme }: LayoutProps) {
  const column = { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 16 } as const;

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24 }}>
          <Logo invoice={invoice} />
          <Text style={{ fontSize: 13, lineHeight: 1.3, fontWeight: 700 }}>{invoice.from.name}</Text>
        </View>
        <Text style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: INK.muted }}>
          {documentTitle(invoice)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 34, alignItems: "flex-start" }}>
        <View style={column}>
          <PartyBlock invoice={invoice} party={invoice.to} title={labelsFor(invoice).clientHeading} />
        </View>
        <View style={column}>
          <Label>Details</Label>
          <MetaTable invoice={invoice} align="left" />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Label>{labelsFor(invoice).totalHeading}</Label>
          <Text style={{ fontSize: 20, lineHeight: 1.2, fontWeight: 700, color: theme.accent }}>
            {money(invoice, computed.totals.total)}
          </Text>
        </View>
      </View>

      <ItemsTable invoice={invoice} computed={computed} theme={theme} headerVariant="plain" />
      <SummarySection invoice={invoice} computed={computed} theme={theme} highlightTotal={false} />

      <View keepTogether style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 26 }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24 }}>
          <PartyBlock invoice={invoice} party={invoice.from} title="From" hideName />
        </View>
        {hasPaymentDetails(invoice, qrCode) && (
          <View style={{ flexGrow: 1.6, flexShrink: 1, flexBasis: 0 }}>
            <PaymentBlock invoice={invoice} qrCode={qrCode} />
          </View>
        )}
      </View>
      <NotesBlock invoice={invoice} computed={computed} />
    </>
  );
}
