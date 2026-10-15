"use client";

import { Image, Text, View, type DocStyle, type PageComponent } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { PreparedReceipt, PreparedRentReceipts } from "../lib/receipts";
import { getTemplate, type ReceiptLayoutId } from "./registry";

const BODY: DocStyle = { fontSize: 9.5, lineHeight: 1.5, color: INK.text };
const SMALL: DocStyle = { fontSize: 8, lineHeight: 1.4, color: INK.muted };

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 2 }}>
      <Text style={[SMALL, { width: 78, flexShrink: 0, fontSize: 8.5 }]}>{label}</Text>
      <Text style={[BODY, { flexGrow: 1, flexShrink: 1, flexBasis: 0, fontWeight: 700 }]}>
        {value || " "}
      </Text>
    </View>
  );
}

/** The landlord's signature, name, PAN and (for large cash payments) a revenue stamp box. */
function SignatureBlock({ data }: { data: PreparedRentReceipts }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 4 }}>
      {data.revenueStamp && (
        <View
          style={{
            width: 44,
            height: 44,
            borderWidth: 0.75,
            borderColor: INK.faint,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <Text style={[SMALL, { fontSize: 6.5, textAlign: "center" }]}>{"Revenue\nstamp"}</Text>
        </View>
      )}
      <View style={{ flexGrow: 1 }} />
      <View style={{ width: 190, alignItems: "flex-end" }}>
        {data.signature ? (
          <Image
            src={data.signature}
            alt="Landlord's signature"
            style={{ maxWidth: 140, maxHeight: 30, objectFit: "contain" }}
          />
        ) : (
          <View style={{ height: 26 }} />
        )}
        <View
          style={{ width: 170, borderTopWidth: 0.75, borderTopColor: INK.text, marginTop: 2, paddingTop: 2 }}
        >
          <Text style={[BODY, { textAlign: "right", fontWeight: 700 }]}>{data.landlordName || " "}</Text>
          <Text style={[SMALL, { textAlign: "right" }]}>
            {data.landlordPan ? `Landlord · PAN ${data.landlordPan}` : "Landlord"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReceiptBody({ data, receipt }: { data: PreparedRentReceipts; receipt: PreparedReceipt }) {
  return (
    <>
      <Text style={[BODY, { marginTop: 6 }]}>
        {`Received with thanks from ${data.tenantName || "[tenant]"} the sum of ${data.amount} (${data.amountInWords}) by ${data.paymentMode}, towards rent for ${receipt.period} for the property at ${data.propertyAddress || "[property address]"}.`}
      </Text>
      <View style={{ marginTop: 6 }}>
        <Detail label="Rent period" value={receipt.period} />
        <Detail label="Amount" value={data.amount} />
        {data.landlordAddress && <Detail label="Landlord address" value={data.landlordAddress} />}
      </View>
    </>
  );
}

function Receipt({
  data,
  receipt,
  layout,
  theme,
}: {
  data: PreparedRentReceipts;
  receipt: PreparedReceipt;
  layout: ReceiptLayoutId;
  theme: DocumentTheme;
}) {
  const meta = `No. ${receipt.number}   ·   Date ${receipt.date}`;

  if (layout === "modern") {
    return (
      <View style={{ flexDirection: "row", borderWidth: 0.75, borderColor: INK.border }}>
        <View style={{ width: 6, backgroundColor: theme.accent }} />
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, padding: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 15, lineHeight: 1.2, fontWeight: 700, color: theme.accent }}>
              Rent Receipt
            </Text>
            <Text style={[SMALL, { textAlign: "right" }]}>{meta}</Text>
          </View>
          <ReceiptBody data={data} receipt={receipt} />
          <SignatureBlock data={data} />
        </View>
      </View>
    );
  }

  if (layout === "minimal") {
    return (
      <View style={{ paddingVertical: 4 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottomWidth: 1.5,
            borderBottomColor: theme.accent,
            paddingBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              lineHeight: 1.3,
              fontWeight: 700,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Rent receipt
          </Text>
          <Text style={SMALL}>{meta}</Text>
        </View>
        <ReceiptBody data={data} receipt={receipt} />
        <SignatureBlock data={data} />
      </View>
    );
  }

  return (
    <View style={{ borderWidth: 1.25, borderColor: theme.accent, padding: 3 }}>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: tint(theme.accent, 0.5),
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            lineHeight: 1.3,
            fontWeight: 700,
            textAlign: "center",
            color: theme.accent,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Rent Receipt
        </Text>
        <Text style={[SMALL, { textAlign: "center", marginTop: 1 }]}>{meta}</Text>
        <ReceiptBody data={data} receipt={receipt} />
        <SignatureBlock data={data} />
      </View>
    </View>
  );
}

/** A dashed line to cut along between receipts. */
function CutLine() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}>
      <View style={{ flexGrow: 1, borderTopWidth: 0.75, borderTopColor: INK.faint, borderStyle: "dashed" }} />
      <Text style={[SMALL, { fontSize: 6.5, color: INK.faint, marginHorizontal: 6 }]}>cut here</Text>
      <View style={{ flexGrow: 1, borderTopWidth: 0.75, borderTopColor: INK.faint, borderStyle: "dashed" }} />
    </View>
  );
}

interface ReceiptDocumentProps {
  templateId: string;
  data: PreparedRentReceipts;
  Page: PageComponent;
}

/** All the receipts, about three to an A4 page, each kept whole across page breaks. */
export function ReceiptDocument({ templateId, data, Page }: ReceiptDocumentProps) {
  const { layout, theme } = getTemplate(templateId);
  const receipts = data.receipts.length
    ? data.receipts
    : [{ number: "-", date: "-", period: "[choose the months]" }];
  return (
    <Page style={{ fontFamily: theme.font, color: INK.text, paddingVertical: 32, paddingHorizontal: 40 }}>
      {receipts.map((receipt, index) => (
        <View key={receipt.number + index} keepTogether>
          {index > 0 && <CutLine />}
          <Receipt data={data} receipt={receipt} layout={layout} theme={theme} />
        </View>
      ))}
    </Page>
  );
}
