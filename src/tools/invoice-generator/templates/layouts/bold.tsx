"use client";

import { formatDate } from "@/lib/date";
import { Text, View } from "@/lib/document/primitives";
import {
  documentTitle,
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
import { INK, tint } from "../theme";
import type { LayoutProps } from "../types";

/** Oversized title and an "amount due" panel, so the essentials are impossible to miss. */
export function BoldLayout({ invoice, computed, qrCode, theme }: LayoutProps) {
  const column = { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 16 } as const;

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24 }}>
          <Logo invoice={invoice} />
          <Text
            style={{
              fontSize: 36,
              lineHeight: 1.1,
              fontWeight: 700,
              color: theme.accent,
              textTransform: "uppercase",
            }}
          >
            {documentTitle(invoice)}
          </Text>
          {invoice.number && <Text style={{ color: INK.muted, marginTop: 4 }}>{`# ${invoice.number}`}</Text>}
        </View>
        <View style={{ backgroundColor: theme.accent, padding: 14, borderRadius: 6, width: 180 }}>
          <Label color={tint(theme.accent, 0.7)}>Amount due</Label>
          <Text style={{ fontSize: 18, lineHeight: 1.25, fontWeight: 700, color: theme.onAccent }}>
            {money(invoice, computed.totals.total)}
          </Text>
          {invoice.dueDate && (
            <Text
              style={{ color: tint(theme.accent, 0.75), marginTop: 4 }}
            >{`Due ${formatDate(invoice.dueDate)}`}</Text>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 26, alignItems: "flex-start" }}>
        <View style={column}>
          <PartyBlock invoice={invoice} party={invoice.from} title="From" />
        </View>
        <View style={column}>
          <PartyBlock invoice={invoice} party={invoice.to} title="Bill to" />
        </View>
        <View>
          <Label>Details</Label>
          <MetaTable invoice={invoice} align="left" />
        </View>
      </View>

      <ItemsTable invoice={invoice} computed={computed} theme={theme} />
      <SummarySection invoice={invoice} computed={computed} theme={theme} />

      {hasPaymentDetails(invoice, qrCode) && (
        <View style={{ marginTop: 22, padding: 14, borderRadius: 6, backgroundColor: INK.surface }}>
          <PaymentBlock invoice={invoice} qrCode={qrCode} />
        </View>
      )}
      <NotesBlock invoice={invoice} computed={computed} />
    </>
  );
}
