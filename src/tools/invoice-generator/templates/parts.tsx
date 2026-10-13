"use client";

/**
 * Building blocks shared by every invoice layout. Layouts decide *where* things go; these decide
 * *what* is shown (and are themed), so business rules - which columns appear, how tax is labelled,
 * when the QR code is printed - live in exactly one place.
 */

import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { Image, Link, Text, View, type DocStyle } from "@/lib/document/primitives";
import type { Party } from "@/shared/business-profile";
import { stateName } from "../lib/gst";
import type { Invoice } from "../schema";
import { INK, tint } from "./theme";
import type { LayoutProps, TemplateTheme } from "./types";

export const PAGE_PADDING = 40;

/**
 * Base text style for a page; children inherit it on both render targets. Font size and
 * line height are deliberately not set here - every Text sets its own (see DEFAULT_FONT_SIZE).
 */
export function pageStyle(theme: TemplateTheme): DocStyle {
  return { fontFamily: theme.font, color: INK.text };
}

const isGstInvoice = (invoice: Invoice) => invoice.taxMode === "gst" || invoice.taxMode === "gst-export";

/** Registered GST suppliers must title the document "Tax Invoice". */
export function documentTitle(invoice: Invoice): string {
  return isGstInvoice(invoice) ? "Tax Invoice" : "Invoice";
}

export const money = (invoice: Invoice, amount: number) => formatMoney(amount, invoice.currency);

/* ---------------------------------------------------------------- Labels */

export function Label({
  children,
  color = INK.muted,
  style,
}: {
  children: string;
  color?: string;
  style?: DocStyle;
}) {
  return (
    <Text
      style={[
        {
          fontSize: 7.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color,
          marginBottom: 4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/* ---------------------------------------------------------------- Logo */

export function Logo({
  invoice,
  maxWidth = 120,
  maxHeight = 48,
}: {
  invoice: Invoice;
  maxWidth?: number;
  maxHeight?: number;
}) {
  if (!invoice.logo) return null;
  return (
    <Image
      src={invoice.logo}
      alt="Logo"
      style={{ maxWidth, maxHeight, objectFit: "contain", marginBottom: 10 }}
    />
  );
}

/* ---------------------------------------------------------------- Parties */

interface PartyBlockProps {
  invoice: Invoice;
  party: Party;
  title?: string;
  color?: string;
  mutedColor?: string;
  hideName?: boolean;
}

export function PartyBlock({
  invoice,
  party,
  title,
  color = INK.text,
  mutedColor = INK.muted,
  hideName,
}: PartyBlockProps) {
  const taxIdLabel = isGstInvoice(invoice) ? "GSTIN" : "Tax ID";
  const state = invoice.taxMode === "gst" && party.stateCode ? stateName(party.stateCode) : null;
  return (
    <View>
      {title && <Label color={mutedColor}>{title}</Label>}
      {!hideName && (
        <Text style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{party.name || " "}</Text>
      )}
      {party.address && <Text style={{ color: mutedColor }}>{party.address}</Text>}
      {state && <Text style={{ color: mutedColor }}>{`State: ${state} (${party.stateCode})`}</Text>}
      {party.taxId && <Text style={{ color }}>{`${taxIdLabel}: ${party.taxId}`}</Text>}
      {party.email && <Text style={{ color: mutedColor }}>{party.email}</Text>}
      {party.phone && <Text style={{ color: mutedColor }}>{party.phone}</Text>}
    </View>
  );
}

/* ---------------------------------------------------------------- Invoice meta */

export function metaRows(invoice: Invoice): { label: string; value: string }[] {
  const rows = [
    { label: "Invoice No.", value: invoice.number },
    { label: "Invoice Date", value: invoice.issueDate ? formatDate(invoice.issueDate) : "" },
    { label: "Due Date", value: invoice.dueDate ? formatDate(invoice.dueDate) : "" },
  ];
  if (invoice.taxMode === "gst") {
    const code = invoice.placeOfSupply || invoice.to.stateCode;
    const name = code ? stateName(code) : null;
    if (name) rows.push({ label: "Place of Supply", value: `${name} (${code})` });
  }
  return rows.filter((row) => row.value);
}

export function MetaTable({
  invoice,
  align = "right",
  labelColor = INK.muted,
  valueColor = INK.text,
}: {
  invoice: Invoice;
  align?: "left" | "right";
  labelColor?: string;
  valueColor?: string;
}) {
  return (
    <View style={{ alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      {metaRows(invoice).map((row) => (
        <View key={row.label} style={{ flexDirection: "row", marginBottom: 2 }}>
          <Text style={{ color: labelColor, width: 78, textAlign: align }}>{row.label}</Text>
          <Text style={{ color: valueColor, fontWeight: 700, marginLeft: 8 }}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------------------------------------------------------------- Items table */

interface Column {
  key: string;
  label: string;
  width: string | number;
  align: "left" | "right" | "center";
}

/**
 * Column widths in points. Fixed numeric columns are sized for 9pt amounts like "₹1,45,000.00";
 * the description takes whatever is left. Compact mode is for narrow layouts (e.g. Sidebar),
 * folding the HSN/SAC code under the description and tightening the numeric columns.
 */
function tableColumns(
  { invoice, computed }: Pick<LayoutProps, "invoice" | "computed">,
  compact: boolean,
): Column[] {
  const columns: Column[] = [{ key: "index", label: "#", width: compact ? 16 : 20, align: "left" }];
  columns.push({ key: "description", label: "Item", width: "auto", align: "left" });
  if (computed.showCodeColumn && !compact) {
    columns.push({
      key: "code",
      label: isGstInvoice(invoice) ? "HSN/SAC" : "Code",
      width: 52,
      align: "left",
    });
  }
  columns.push({ key: "quantity", label: "Qty", width: compact ? 30 : 38, align: "right" });
  columns.push({ key: "unitPrice", label: "Rate", width: compact ? 64 : 70, align: "right" });
  if (computed.showTaxColumn) {
    const label = invoice.taxMode === "gst" ? "GST" : invoice.taxLabel || "Tax";
    columns.push({ key: "taxRate", label, width: compact ? 32 : 38, align: "right" });
  }
  columns.push({ key: "amount", label: "Amount", width: compact ? 70 : 78, align: "right" });
  return columns;
}

function cellStyle(column: Column): DocStyle {
  return column.width === "auto"
    ? { flexGrow: 1, flexShrink: 1, flexBasis: 0, textAlign: column.align, paddingRight: 6 }
    : { width: column.width, flexShrink: 0, textAlign: column.align, paddingLeft: 4 };
}

interface ItemsTableProps extends Pick<LayoutProps, "invoice" | "computed" | "theme"> {
  /** Filled header in the accent colour (default) or a plain header with an accent rule. */
  headerVariant?: "filled" | "plain";
  /** Narrow layouts: item codes go under the description and numeric columns shrink. */
  compact?: boolean;
}

/** The line-items table. Each row is kept whole across page breaks. */
export function ItemsTable({
  invoice,
  computed,
  theme,
  headerVariant = "filled",
  compact = false,
}: ItemsTableProps) {
  const columns = tableColumns({ invoice, computed }, compact);
  const filled = headerVariant === "filled";
  const boxed = theme.table === "boxed";
  const rowBorder: DocStyle =
    theme.table === "striped" ? {} : { borderBottomWidth: 0.75, borderBottomColor: INK.border };
  const codeLabel = isGstInvoice(invoice) ? "HSN/SAC" : "Code";

  const cell = (column: Column, index: number) => {
    const line = computed.lines[index];
    const style = cellStyle(column);
    switch (column.key) {
      case "index":
        return (
          <Text key={column.key} style={[style, { color: INK.muted }]}>
            {String(index + 1)}
          </Text>
        );
      case "description":
        return (
          <View key={column.key} keepTogether style={style}>
            <Text>{line.description}</Text>
            {compact && line.code && (
              <Text style={{ fontSize: 7.5, color: INK.muted }}>{`${codeLabel}: ${line.code}`}</Text>
            )}
          </View>
        );
      case "code":
        return (
          <Text key={column.key} style={style}>
            {line.code}
          </Text>
        );
      case "quantity":
        return (
          <Text key={column.key} style={style}>
            {String(line.quantity)}
          </Text>
        );
      case "unitPrice":
        return (
          <Text key={column.key} style={style}>
            {money(invoice, line.unitPrice)}
          </Text>
        );
      case "taxRate":
        return (
          <Text key={column.key} style={style}>
            {`${line.taxRate}%`}
          </Text>
        );
      default:
        return (
          <Text key={column.key} style={[style, { fontWeight: 700 }]}>
            {money(invoice, line.amount)}
          </Text>
        );
    }
  };

  return (
    <View style={[{ marginTop: 18 }, boxed && { borderWidth: 0.75, borderColor: INK.border }]}>
      <View
        keepTogether
        style={[
          { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 8 },
          filled
            ? { backgroundColor: theme.accent }
            : { borderBottomWidth: 1.5, borderBottomColor: theme.accent },
        ]}
      >
        {columns.map((column) => (
          <Text
            key={column.key}
            style={[
              cellStyle(column),
              {
                fontSize: 7.5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                color: filled ? theme.onAccent : theme.accent,
              },
            ]}
          >
            {column.label}
          </Text>
        ))}
      </View>
      {computed.lines.map((line, index) => (
        <View
          key={line.id}
          keepTogether
          style={[
            { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 8 },
            rowBorder,
            theme.table === "striped" && index % 2 === 1 && { backgroundColor: tint(theme.accent, 0.93) },
          ]}
        >
          {columns.map((column) => cell(column, index))}
        </View>
      ))}
    </View>
  );
}

/* ---------------------------------------------------------------- Totals */

export function TotalsBlock({
  invoice,
  computed,
  theme,
  width = 220,
  highlightTotal = true,
}: Pick<LayoutProps, "invoice" | "computed" | "theme"> & { width?: number; highlightTotal?: boolean }) {
  const { totals } = computed;
  const rows = [
    { label: "Subtotal", value: money(invoice, totals.subtotal) },
    ...(totals.discount > 0 ? [{ label: "Discount", value: `- ${money(invoice, totals.discount)}` }] : []),
    ...totals.taxLines.map((line) => ({ label: line.label, value: money(invoice, line.amount) })),
  ];

  return (
    <View style={{ width, flexShrink: 0 }}>
      {rows.map((row) => (
        <View
          key={row.label}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 3,
            paddingHorizontal: 8,
          }}
        >
          <Text style={{ color: INK.muted }}>{row.label}</Text>
          <Text>{row.value}</Text>
        </View>
      ))}
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 7,
            paddingHorizontal: 8,
            marginTop: 4,
          },
          highlightTotal
            ? { backgroundColor: theme.accent }
            : { borderTopWidth: 1.5, borderTopColor: theme.accent },
        ]}
      >
        <Text style={{ fontWeight: 700, color: highlightTotal ? theme.onAccent : INK.text }}>Total</Text>
        <Text
          style={{
            fontWeight: 700,
            fontSize: 11,
            lineHeight: 1.2,
            color: highlightTotal ? theme.onAccent : theme.accent,
          }}
        >
          {money(invoice, totals.total)}
        </Text>
      </View>
    </View>
  );
}

export function AmountInWords({ computed }: Pick<LayoutProps, "computed">) {
  return (
    <View>
      <Label>Amount in words</Label>
      <Text style={{ fontStyle: "italic" }}>{computed.amountInWords}</Text>
    </View>
  );
}

/**
 * Totals plus amount in words as one block that is never split across pages: words on the left and
 * totals on the right, or stacked (totals, then words) for narrow layouts like Sidebar.
 */
export function SummarySection({
  invoice,
  computed,
  theme,
  highlightTotal = true,
  stacked = false,
}: Pick<LayoutProps, "invoice" | "computed" | "theme"> & { highlightTotal?: boolean; stacked?: boolean }) {
  if (stacked) {
    return (
      <View keepTogether style={{ marginTop: 12 }}>
        <View style={{ alignItems: "flex-end" }}>
          <TotalsBlock
            invoice={invoice}
            computed={computed}
            theme={theme}
            width={210}
            highlightTotal={highlightTotal}
          />
        </View>
        <View style={{ marginTop: 14 }}>
          <AmountInWords computed={computed} />
        </View>
      </View>
    );
  }
  return (
    <View keepTogether style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 12 }}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 24, paddingTop: 4 }}>
        <AmountInWords computed={computed} />
      </View>
      <TotalsBlock invoice={invoice} computed={computed} theme={theme} highlightTotal={highlightTotal} />
    </View>
  );
}

/* ---------------------------------------------------------------- Payment */

export function hasPaymentDetails(invoice: Invoice, qrCode: string | null): boolean {
  const { payment } = invoice;
  return Boolean(qrCode || payment.upiId || payment.paymentLink || payment.accountNumber || payment.bankName);
}

export function PaymentBlock({
  invoice,
  qrCode,
  color = INK.text,
  mutedColor = INK.muted,
  stacked = false,
}: Pick<LayoutProps, "invoice" | "qrCode"> & { color?: string; mutedColor?: string; stacked?: boolean }) {
  if (!hasPaymentDetails(invoice, qrCode)) return null;
  const { payment } = invoice;
  const bankRows = [
    { label: "Bank", value: payment.bankName },
    { label: "Account name", value: payment.accountName },
    { label: "Account / IBAN", value: payment.accountNumber },
    { label: invoice.currency === "INR" ? "IFSC" : "SWIFT / Routing", value: payment.bankCode },
    { label: "UPI", value: payment.upiId },
  ].filter((row) => row.value);

  return (
    <View keepTogether>
      <View style={{ flexDirection: stacked ? "column" : "row", alignItems: "flex-start" }}>
        {/* flexBasis 0 makes the details fill the width beside the QR code instead of shrinking to fit. */}
        <View style={stacked ? {} : { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 12 }}>
          <Label color={mutedColor}>Payment details</Label>
          {bankRows.map((row) =>
            // Narrow columns stack the label above the value; wide ones use a two-column grid.
            stacked ? (
              <View key={row.label} style={{ marginBottom: 5 }}>
                <Text style={{ color: mutedColor, fontSize: 7.5 }}>{row.label}</Text>
                <Text style={{ color }}>{row.value}</Text>
              </View>
            ) : (
              <View key={row.label} style={{ flexDirection: "row", marginBottom: 1 }}>
                <Text style={{ color: mutedColor, width: 88, flexShrink: 0, paddingRight: 6 }}>
                  {row.label}
                </Text>
                <Text style={{ color, flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>{row.value}</Text>
              </View>
            ),
          )}
          {payment.paymentLink && (
            <Link href={payment.paymentLink} style={{ color, textDecoration: "underline" }}>
              <Text style={{ color, marginTop: 4 }}>{`Pay online: ${payment.paymentLink}`}</Text>
            </Link>
          )}
        </View>
        {qrCode && (
          <View style={{ alignItems: "center", marginTop: stacked ? 10 : 0 }}>
            {/* White backing keeps the code scannable on coloured backgrounds. */}
            <View style={{ backgroundColor: "#ffffff", padding: 4, borderRadius: 4 }}>
              <Image src={qrCode} alt="UPI payment QR code" style={{ width: 74, height: 74 }} />
            </View>
            <Text style={{ fontSize: 7, color: mutedColor, marginTop: 2 }}>Scan to pay with UPI</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* ---------------------------------------------------------------- Notes */

export function NotesBlock({ invoice, computed }: Pick<LayoutProps, "invoice" | "computed">) {
  const hasContent = invoice.notes || invoice.terms || computed.notices.length > 0;
  if (!hasContent) return null;
  return (
    <View keepTogether style={{ marginTop: 18 }}>
      {computed.notices.map((notice) => (
        <Text key={notice} style={{ fontWeight: 700, marginBottom: 2 }}>
          {notice}
        </Text>
      ))}
      {invoice.notes && (
        <View style={{ marginTop: computed.notices.length ? 8 : 0 }}>
          <Label>Notes</Label>
          <Text style={{ color: INK.muted }}>{invoice.notes}</Text>
        </View>
      )}
      {invoice.terms && (
        <View style={{ marginTop: 8 }}>
          <Label>Terms & conditions</Label>
          <Text style={{ color: INK.muted }}>{invoice.terms}</Text>
        </View>
      )}
    </View>
  );
}
