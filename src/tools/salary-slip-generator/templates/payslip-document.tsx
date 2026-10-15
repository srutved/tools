"use client";

import { Image, Text, View, type DocStyle, type PageComponent } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { PreparedPayItem, PreparedPayslip } from "../lib/payslip";
import { getTemplate, type PayslipLayoutId } from "./registry";

const BODY: DocStyle = { fontSize: 9, lineHeight: 1.4, color: INK.text };
const LABEL: DocStyle = { fontSize: 8, lineHeight: 1.4, color: INK.muted };
const BOLD: DocStyle = { fontWeight: 700 };
const AMOUNT_WIDTH = 84;

interface LookProps {
  slip: PreparedPayslip;
  layout: PayslipLayoutId;
  theme: DocumentTheme;
}

function Logo({ slip, align }: { slip: PreparedPayslip; align?: "center" }) {
  if (!slip.logo) return null;
  return (
    <Image
      src={slip.logo}
      alt={`${slip.companyName} logo`}
      style={{
        maxWidth: 120,
        maxHeight: 44,
        objectFit: "contain",
        marginBottom: 6,
        alignSelf: align === "center" ? "center" : "flex-start",
      }}
    />
  );
}

function Header({ slip, layout, theme }: LookProps) {
  const title = slip.period ? `Payslip for ${slip.period}` : "Payslip";

  if (layout === "modern") {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.accent,
          paddingHorizontal: 18,
          paddingVertical: 16,
          borderRadius: 6,
        }}
      >
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 16 }}>
          {slip.logo && (
            <View
              style={{ backgroundColor: "#ffffff", borderRadius: 4, padding: 4, alignSelf: "flex-start" }}
            >
              <Image
                src={slip.logo}
                alt={`${slip.companyName} logo`}
                style={{ maxWidth: 110, maxHeight: 34, objectFit: "contain" }}
              />
            </View>
          )}
          <Text
            style={{
              fontSize: 15,
              lineHeight: 1.25,
              fontWeight: 700,
              color: theme.onAccent,
              marginTop: slip.logo ? 6 : 0,
            }}
          >
            {slip.companyName || "Company name"}
          </Text>
          {slip.companyAddress && (
            <Text style={{ fontSize: 8, lineHeight: 1.4, color: tint(theme.accent, 0.75), marginTop: 2 }}>
              {slip.companyAddress}
            </Text>
          )}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 8,
              lineHeight: 1.3,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: tint(theme.accent, 0.7),
            }}
          >
            Payslip
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 1.3, fontWeight: 700, color: theme.onAccent }}>
            {slip.period || "Month"}
          </Text>
        </View>
      </View>
    );
  }

  if (layout === "minimal") {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottomWidth: 1.5,
          borderBottomColor: theme.accent,
          paddingBottom: 10,
        }}
      >
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 16 }}>
          <Logo slip={slip} />
          <Text style={{ fontSize: 14, lineHeight: 1.25, fontWeight: 700 }}>
            {slip.companyName || "Company name"}
          </Text>
          {slip.companyAddress && <Text style={[LABEL, { marginTop: 2 }]}>{slip.companyAddress}</Text>}
        </View>
        <Text style={{ fontSize: 11, lineHeight: 1.3, fontWeight: 700, color: theme.accent }}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={{ borderWidth: 1, borderColor: INK.text }}>
      <View style={{ alignItems: "center", paddingVertical: 12, paddingHorizontal: 16 }}>
        <Logo slip={slip} align="center" />
        <Text style={{ fontSize: 14, lineHeight: 1.25, fontWeight: 700, textAlign: "center" }}>
          {slip.companyName || "Company name"}
        </Text>
        {slip.companyAddress && (
          <Text style={[LABEL, { textAlign: "center", marginTop: 2 }]}>{slip.companyAddress}</Text>
        )}
      </View>
      <View
        style={{
          backgroundColor: tint(theme.accent, 0.88),
          borderTopWidth: 1,
          borderTopColor: INK.text,
          paddingVertical: 5,
        }}
      >
        <Text style={[BODY, BOLD, { textAlign: "center", color: theme.accent }]}>{title}</Text>
      </View>
    </View>
  );
}

function pairs<T>(items: T[]): [T, T | undefined][] {
  const rows: [T, T | undefined][] = [];
  for (let index = 0; index < items.length; index += 2) rows.push([items[index], items[index + 1]]);
  return rows;
}

function Details({ slip, layout, theme }: LookProps) {
  if (slip.details.length === 0) return null;
  const boxed = layout === "classic";
  const rows = pairs(slip.details);

  return (
    <View
      style={[
        { marginTop: boxed ? 0 : 14 },
        boxed && { borderWidth: 1, borderTopWidth: 0, borderColor: INK.text },
        layout === "modern" && {
          backgroundColor: tint(theme.accent, 0.94),
          borderRadius: 6,
          paddingHorizontal: 14,
          paddingVertical: 8,
        },
      ]}
    >
      {rows.map(([left, right], index) => (
        <View
          key={left.label}
          style={[
            { flexDirection: "row" },
            boxed && index > 0 && { borderTopWidth: 0.5, borderTopColor: INK.faint },
          ]}
        >
          {[left, right].map((detail, column) => (
            <View
              key={column}
              style={[
                { flexDirection: "row", flexGrow: 1, flexShrink: 1, flexBasis: 0 },
                boxed
                  ? { paddingHorizontal: 8, paddingVertical: 4 }
                  : { paddingVertical: 2.5, paddingRight: column === 0 ? 16 : 0 },
                boxed && column === 0 && { borderRightWidth: 0.5, borderRightColor: INK.faint },
              ]}
            >
              {detail && (
                <>
                  <Text style={[LABEL, { width: 92, flexShrink: 0 }]}>{detail.label}</Text>
                  <Text style={[BODY, BOLD, { flexGrow: 1, flexShrink: 1, flexBasis: 0 }]}>
                    {detail.value}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function PayRow({
  left,
  right,
  style,
  textStyle,
  divider,
}: {
  left?: PreparedPayItem;
  right?: PreparedPayItem;
  style?: DocStyle;
  textStyle?: DocStyle;
  /** Rule between the earnings and deductions halves. */
  divider?: DocStyle;
}) {
  const half = (item: PreparedPayItem | undefined, column: number) => (
    <View
      style={[
        { flexDirection: "row", flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingHorizontal: 8 },
        column === 0 && divider,
      ]}
    >
      <Text style={[BODY, textStyle, { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 6 }]}>
        {item?.label ?? " "}
      </Text>
      <Text style={[BODY, textStyle, { width: AMOUNT_WIDTH, flexShrink: 0, textAlign: "right" }]}>
        {item?.amount ?? ""}
      </Text>
    </View>
  );
  return (
    <View style={[{ flexDirection: "row", paddingVertical: 4 }, style]}>
      {half(left, 0)}
      {half(right, 1)}
    </View>
  );
}

function PayTable({ slip, layout, theme }: LookProps) {
  const count = Math.max(slip.earnings.length, slip.deductions.length, 1);
  const boxed = layout === "classic";
  const divider: DocStyle | undefined = boxed
    ? { borderRightWidth: 0.5, borderRightColor: INK.faint }
    : undefined;
  const rule: DocStyle = { borderTopWidth: 0.5, borderTopColor: boxed ? INK.faint : INK.border };

  const headStyle: DocStyle =
    layout === "modern"
      ? { backgroundColor: theme.accent, borderRadius: 4 }
      : layout === "minimal"
        ? { borderBottomWidth: 1, borderBottomColor: theme.accent }
        : { backgroundColor: tint(theme.accent, 0.88) };
  const headText: DocStyle = {
    fontWeight: 700,
    color: layout === "modern" ? theme.onAccent : theme.accent,
    ...(layout === "minimal" && { textTransform: "uppercase", letterSpacing: 1, fontSize: 8 }),
  };
  const totalStyle: DocStyle =
    layout === "modern"
      ? { backgroundColor: tint(theme.accent, 0.92), borderRadius: 4, marginTop: 2 }
      : { borderTopWidth: boxed ? 1 : 0.75, borderTopColor: boxed ? INK.text : INK.faint };

  return (
    <View
      style={[
        { marginTop: 14 },
        boxed && { borderWidth: 1, borderColor: INK.text, marginTop: 0, borderTopWidth: 0 },
      ]}
    >
      <PayRow
        left={{ label: "Earnings", amount: "Amount" }}
        right={{ label: "Deductions", amount: "Amount" }}
        style={boxed ? { ...headStyle, borderBottomWidth: 1, borderBottomColor: INK.text } : headStyle}
        textStyle={headText}
        divider={divider}
      />
      {Array.from({ length: count }, (_, index) => (
        <PayRow
          key={index}
          left={slip.earnings[index]}
          right={slip.deductions[index]}
          style={index > 0 ? rule : undefined}
          divider={divider}
        />
      ))}
      <PayRow
        left={{ label: "Gross earnings", amount: slip.grossEarnings }}
        right={{ label: "Total deductions", amount: slip.totalDeductions }}
        style={totalStyle}
        textStyle={BOLD}
        divider={divider}
      />
    </View>
  );
}

function NetPay({ slip, layout, theme }: LookProps) {
  if (layout === "modern") {
    return (
      <View
        style={{
          marginTop: 14,
          backgroundColor: theme.accent,
          borderRadius: 6,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 11, lineHeight: 1.3, fontWeight: 700, color: theme.onAccent }}>
            Net pay
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 1.3, fontWeight: 700, color: theme.onAccent }}>
            {slip.netPay}
          </Text>
        </View>
        <Text style={{ fontSize: 8, lineHeight: 1.4, color: tint(theme.accent, 0.75), marginTop: 2 }}>
          {slip.netPayInWords}
        </Text>
      </View>
    );
  }

  const boxed = layout === "classic";
  return (
    <View
      style={[
        { marginTop: boxed ? 0 : 14, paddingHorizontal: 8, paddingVertical: 8 },
        boxed
          ? { borderWidth: 1, borderTopWidth: 0, borderColor: INK.text }
          : {
              borderTopWidth: 1.5,
              borderTopColor: theme.accent,
              borderBottomWidth: 0.75,
              borderBottomColor: INK.border,
            },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 11, lineHeight: 1.3, fontWeight: 700 }}>Net pay</Text>
        <Text style={{ fontSize: 13, lineHeight: 1.3, fontWeight: 700, color: theme.accent }}>
          {slip.netPay}
        </Text>
      </View>
      <Text style={[LABEL, { marginTop: 2 }]}>{slip.netPayInWords}</Text>
    </View>
  );
}

interface PayslipDocumentProps {
  templateId: string;
  slip: PreparedPayslip;
  Page: PageComponent;
}

/** A one-page payslip: company, employee details, earnings beside deductions, and net pay. */
export function PayslipDocument({ templateId, slip, Page }: PayslipDocumentProps) {
  const { layout, theme } = getTemplate(templateId);
  const look = { slip, layout, theme };
  return (
    <Page style={{ fontFamily: theme.font, color: INK.text, paddingVertical: 40, paddingHorizontal: 44 }}>
      <Header {...look} />
      <Details {...look} />
      <PayTable {...look} />
      <NetPay {...look} />
      {slip.notes && (
        <View style={{ marginTop: 14 }}>
          <Text style={[LABEL, BOLD]}>Notes</Text>
          <Text style={[BODY, { marginTop: 2 }]}>{slip.notes}</Text>
        </View>
      )}
      <Text style={[LABEL, { marginTop: 18, textAlign: "center", color: INK.faint }]}>
        This is a computer-generated payslip and does not need a signature.
      </Text>
    </Page>
  );
}
