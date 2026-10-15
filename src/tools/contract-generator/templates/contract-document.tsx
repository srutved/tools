"use client";

import { A4, PageNumber, Text, View, type DocStyle, type PageComponent } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { ClauseBlock, PreparedClause, PreparedContract, SignatureBlock } from "../lib/clauses";
import { getTemplate, type ContractLayoutId } from "./registry";

const BODY: DocStyle = { fontSize: 9.5, lineHeight: 1.55, color: INK.text };
const MARGIN = 52;
/** Room at the foot of every page for the running footer. */
const FOOTER_SPACE = 64;

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function Block({ block, theme }: { block: ClauseBlock; theme: DocumentTheme }) {
  switch (block.type) {
    case "text":
      return <Text style={[BODY, { marginTop: 5 }]}>{block.text}</Text>;
    case "list":
      return (
        <View style={{ marginTop: 4 }}>
          {block.items.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", marginTop: 3, paddingLeft: 6 }}>
              <Text
                style={[BODY, { width: 20, flexShrink: 0, color: INK.muted }]}
              >{`(${LETTERS[index % 26]})`}</Text>
              <Text style={[BODY, { flexGrow: 1, flexShrink: 1, flexBasis: 0 }]}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case "table":
      return (
        <View style={{ marginTop: 6, borderWidth: 0.75, borderColor: INK.border }}>
          {block.rows.map(([left, right], index) => (
            <View
              key={index}
              keepTogether
              style={[
                { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8 },
                index > 0 && { borderTopWidth: 0.75, borderTopColor: INK.border },
                index % 2 === 1 && { backgroundColor: tint(theme.accent, 0.95) },
              ]}
            >
              <Text style={[BODY, { flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 10 }]}>
                {left}
              </Text>
              <Text style={[BODY, { fontWeight: 700, textAlign: "right", flexShrink: 0 }]}>{right}</Text>
            </View>
          ))}
        </View>
      );
  }
}

function ClauseHeading({
  clause,
  layout,
  theme,
}: {
  clause: PreparedClause;
  layout: ContractLayoutId;
  theme: DocumentTheme;
}) {
  const label = `${clause.number}. ${clause.heading}`;
  if (layout === "minimal") {
    return (
      <Text
        style={{
          fontSize: 8.5,
          lineHeight: 1.4,
          fontWeight: 700,
          color: theme.accent,
          textTransform: "uppercase",
          letterSpacing: 1.1,
        }}
      >
        {label}
      </Text>
    );
  }
  return (
    <Text
      style={{
        fontSize: 10.5,
        lineHeight: 1.4,
        fontWeight: 700,
        color: layout === "modern" ? theme.accent : INK.text,
      }}
    >
      {label}
    </Text>
  );
}

/**
 * One clause. The heading and first block are kept together, and live directly in the clause's
 * View, so a clause that doesn't fit moves to the next page whole instead of being squeezed.
 */
function Clause({
  clause,
  layout,
  theme,
}: {
  clause: PreparedClause;
  layout: ContractLayoutId;
  theme: DocumentTheme;
}) {
  const [first, ...rest] = clause.blocks;
  return (
    <View style={{ marginTop: 14 }}>
      <View keepTogether>
        <ClauseHeading clause={clause} layout={layout} theme={theme} />
        {first && <Block block={first} theme={theme} />}
      </View>
      {rest.map((block, index) => (
        <Block key={index} block={block} theme={theme} />
      ))}
    </View>
  );
}

function SignatureLine({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 8 }}>
      <Text style={[BODY, { width: 44, flexShrink: 0, color: INK.muted, fontSize: 8.5 }]}>{label}</Text>
      <View
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          borderBottomWidth: 0.75,
          borderBottomColor: INK.faint,
          paddingBottom: 1,
        }}
      >
        <Text style={BODY}>{value || " "}</Text>
      </View>
    </View>
  );
}

function Signature({ signature, theme }: { signature: SignatureBlock; theme: DocumentTheme }) {
  // No flex sizing here: the column wrapper sizes it. flexBasis 0 in a column would collapse its height.
  return (
    <View>
      <Text
        style={{
          fontSize: 8,
          lineHeight: 1.4,
          fontWeight: 700,
          color: theme.accent,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {signature.role === "Party" ? "Signed for" : `Signed for the ${signature.role}`}
      </Text>
      <Text style={[BODY, { fontWeight: 700, marginTop: 2 }]}>{signature.name || " "}</Text>
      <View style={{ height: 34, borderBottomWidth: 0.75, borderBottomColor: INK.text, marginTop: 6 }} />
      <Text style={{ fontSize: 7.5, lineHeight: 1.4, color: INK.muted, marginTop: 2 }}>Signature</Text>
      <SignatureLine label="Name" value={signature.signatory || signature.name} />
      <SignatureLine label="Title" value={signature.signatoryTitle} />
      <SignatureLine label="Date" />
    </View>
  );
}

function Title({
  contract,
  layout,
  theme,
}: {
  contract: PreparedContract;
  layout: ContractLayoutId;
  theme: DocumentTheme;
}) {
  if (layout === "classic") {
    return (
      <View
        style={{
          alignItems: "center",
          paddingBottom: 12,
          borderBottomWidth: 2,
          borderBottomColor: theme.accent,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            lineHeight: 1.3,
            fontWeight: 700,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 2,
            color: theme.accent,
          }}
        >
          {contract.title}
        </Text>
        {contract.subtitle && (
          <Text
            style={{ fontSize: 11, lineHeight: 1.4, color: INK.muted, marginTop: 3, textAlign: "center" }}
          >
            {contract.subtitle}
          </Text>
        )}
      </View>
    );
  }
  if (layout === "modern") {
    return (
      <View
        style={{ borderLeftWidth: 4, borderLeftColor: theme.accent, paddingLeft: 12, paddingVertical: 2 }}
      >
        <Text style={{ fontSize: 20, lineHeight: 1.25, fontWeight: 700, color: INK.text }}>
          {contract.title}
        </Text>
        {contract.subtitle && (
          <Text style={{ fontSize: 11, lineHeight: 1.4, color: theme.accent, marginTop: 2 }}>
            {contract.subtitle}
          </Text>
        )}
      </View>
    );
  }
  return (
    <View style={{ paddingBottom: 10, borderBottomWidth: 0.75, borderBottomColor: INK.border }}>
      <Text style={{ fontSize: 18, lineHeight: 1.3, fontWeight: 700, color: INK.text }}>
        {contract.title}
      </Text>
      {contract.subtitle && (
        <Text style={{ fontSize: 10.5, lineHeight: 1.4, color: theme.accent, marginTop: 2 }}>
          {contract.subtitle}
        </Text>
      )}
    </View>
  );
}

interface ContractDocumentProps {
  templateId: string;
  contract: PreparedContract;
  Page: PageComponent;
}

/** Renders a contract in the given design onto any render target. */
export function ContractDocument({ templateId, contract, Page }: ContractDocumentProps) {
  const { layout, theme } = getTemplate(templateId);
  return (
    <Page
      style={{
        fontFamily: theme.font,
        color: INK.text,
        paddingTop: MARGIN,
        paddingHorizontal: MARGIN + 4,
        paddingBottom: FOOTER_SPACE,
      }}
    >
      {/*
        Running footer on every PDF page: the title and the page number. It's anchored from the top:
        anchored with "bottom", the PDF engine measures it against all the content, not one page.
      */}
      <View
        fixed
        pdfOnly
        style={{
          position: "absolute",
          left: MARGIN + 4,
          right: MARGIN + 4,
          top: A4.height - 44,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 0.75,
          borderTopColor: INK.border,
          paddingTop: 5,
        }}
      >
        <Text style={{ fontSize: 7.5, lineHeight: 1.4, color: INK.faint }}>{contract.title}</Text>
        <PageNumber style={{ fontSize: 7.5, lineHeight: 1.4, color: INK.faint }} />
      </View>

      <Title contract={contract} layout={layout} theme={theme} />
      <Text style={[BODY, { marginTop: 16 }]}>{contract.preamble}</Text>

      {contract.clauses.map((clause) => (
        <Clause key={clause.number} clause={clause} layout={layout} theme={theme} />
      ))}

      <View keepTogether style={{ marginTop: 26 }}>
        <Text style={BODY}>Signed by the Parties on the dates below.</Text>
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          {contract.signatures.map((signature, index) => (
            <View
              key={index}
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                paddingRight: index === 0 ? 24 : 0,
                paddingLeft: index === 0 ? 0 : 24,
              }}
            >
              <Signature signature={signature} theme={theme} />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
