"use client";

import {
  A4,
  Image,
  PageNumber,
  Text,
  View,
  type DocStyle,
  type PageComponent,
} from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { LetterBlock, PreparedLetter } from "../lib/letters";
import { getTemplate, type LetterLayoutId } from "./registry";

const BODY: DocStyle = { fontSize: 10, lineHeight: 1.55, color: INK.text };
const SMALL: DocStyle = { fontSize: 8, lineHeight: 1.45, color: INK.muted };
const MARGIN = 54;
/** Room at the foot of every page for the running footer. */
const FOOTER_SPACE = 60;

interface LookProps {
  letter: PreparedLetter;
  layout: LetterLayoutId;
  theme: DocumentTheme;
}

function Logo({
  letter,
  size = 46,
  centred = false,
}: {
  letter: PreparedLetter;
  size?: number;
  centred?: boolean;
}) {
  if (!letter.company.logo) return null;
  return (
    <Image
      src={letter.company.logo}
      alt={`${letter.company.name} logo`}
      style={{
        maxWidth: size * 2.6,
        maxHeight: size,
        objectFit: "contain",
        alignSelf: centred ? "center" : "flex-start",
      }}
    />
  );
}

/** Email, phone and website on their own lines, right-aligned beside the company name. */
function ContactLines({ letter }: { letter: PreparedLetter }) {
  return letter.company.contact.map((line) => (
    <Text key={line} style={[SMALL, { textAlign: "right" }]}>
      {line}
    </Text>
  ));
}

function Letterhead({ letter, layout, theme }: LookProps) {
  const { company } = letter;

  if (layout === "modern") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: tint(theme.accent, 0.92),
          borderLeftWidth: 5,
          borderLeftColor: theme.accent,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
        >
          {company.logo && (
            <View style={{ marginRight: 12 }}>
              <Logo letter={letter} size={40} />
            </View>
          )}
          <Text
            style={{
              fontSize: 15,
              lineHeight: 1.25,
              fontWeight: 700,
              color: theme.accent,
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
            }}
          >
            {company.name}
          </Text>
        </View>
        <View style={{ width: 210, alignItems: "flex-end", marginLeft: 12 }}>
          {company.address && <Text style={[SMALL, { textAlign: "right" }]}>{company.address}</Text>}
          <ContactLines letter={letter} />
        </View>
      </View>
    );
  }

  if (layout === "minimal") {
    return (
      <View style={{ borderBottomWidth: 0.75, borderBottomColor: INK.border, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
            {company.logo && (
              <View style={{ marginBottom: 6 }}>
                <Logo letter={letter} size={36} />
              </View>
            )}
            <Text
              style={{
                fontSize: 11.5,
                lineHeight: 1.3,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: theme.accent,
              }}
            >
              {company.name}
            </Text>
          </View>
          <View style={{ width: 230, alignItems: "flex-end" }}>
            {company.address && <Text style={[SMALL, { textAlign: "right" }]}>{company.address}</Text>}
            <ContactLines letter={letter} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center" }}>
      {company.logo && (
        <View style={{ marginBottom: 6 }}>
          <Logo letter={letter} centred />
        </View>
      )}
      <Text
        style={{ fontSize: 16, lineHeight: 1.25, fontWeight: 700, color: theme.accent, textAlign: "center" }}
      >
        {company.name}
      </Text>
      {company.address && (
        <Text style={[SMALL, { textAlign: "center", marginTop: 2 }]}>{company.address}</Text>
      )}
      {company.contact.length > 0 && (
        <Text style={[SMALL, { textAlign: "center" }]}>{company.contact.join("   ·   ")}</Text>
      )}
      <View
        style={{ alignSelf: "stretch", marginTop: 10, borderTopWidth: 1.5, borderTopColor: theme.accent }}
      />
      <View
        style={{ alignSelf: "stretch", marginTop: 1.5, borderTopWidth: 0.5, borderTopColor: theme.accent }}
      />
    </View>
  );
}

function Title({ letter, layout, theme }: LookProps) {
  if (layout === "classic") {
    return (
      <Text
        style={{
          marginTop: 18,
          fontSize: 12,
          lineHeight: 1.3,
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 2,
          color: INK.text,
          textDecoration: "underline",
        }}
      >
        {letter.title}
      </Text>
    );
  }
  return (
    <Text
      style={{
        marginTop: 18,
        fontSize: layout === "modern" ? 15 : 13,
        lineHeight: 1.3,
        fontWeight: 700,
        color: layout === "modern" ? theme.accent : INK.text,
      }}
    >
      {letter.title}
    </Text>
  );
}

function Block({
  block,
  layout,
  theme,
}: {
  block: LetterBlock;
  layout: LetterLayoutId;
  theme: DocumentTheme;
}) {
  if (block.type === "paragraph") return <Text style={[BODY, { marginTop: 9 }]}>{block.text}</Text>;
  return (
    <View keepTogether style={{ flexDirection: "row", marginTop: 7 }}>
      <Text
        style={[
          BODY,
          {
            width: 18,
            flexShrink: 0,
            fontWeight: 700,
            color: layout === "classic" ? INK.text : theme.accent,
          },
        ]}
      >
        {`${block.number}.`}
      </Text>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
        <Text style={[BODY, { fontWeight: 700 }]}>{block.heading}</Text>
        <Text style={BODY}>{block.text}</Text>
      </View>
    </View>
  );
}

function Signoff({ letter }: { letter: PreparedLetter }) {
  const { signoff } = letter;
  return (
    <View keepTogether style={{ marginTop: 22 }}>
      <Text style={BODY}>Yours sincerely,</Text>
      <Text style={[BODY, { fontWeight: 700 }]}>For {signoff.company}</Text>
      {signoff.signature ? (
        <Image
          src={signoff.signature}
          alt={`${signoff.name}'s signature`}
          style={{
            maxWidth: 150,
            maxHeight: 44,
            objectFit: "contain",
            marginTop: 6,
            alignSelf: "flex-start",
          }}
        />
      ) : (
        <View style={{ height: 44 }} />
      )}
      <Text style={[BODY, { fontWeight: 700 }]}>{signoff.name}</Text>
      {signoff.title && <Text style={[BODY, { color: INK.muted }]}>{signoff.title}</Text>}
    </View>
  );
}

function SignLine({ label }: { label: string }) {
  return (
    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 18 }}>
      <View style={{ height: 30, borderBottomWidth: 0.75, borderBottomColor: INK.faint }} />
      <Text style={[SMALL, { marginTop: 2 }]}>{label}</Text>
    </View>
  );
}

function Acceptance({ letter, theme }: { letter: PreparedLetter; theme: DocumentTheme }) {
  if (!letter.acceptance) return null;
  return (
    <View
      keepTogether
      style={{
        marginTop: 24,
        borderTopWidth: 0.75,
        borderTopColor: INK.faint,
        borderStyle: "dashed",
        paddingTop: 12,
      }}
    >
      <Text
        style={{
          fontSize: 8.5,
          lineHeight: 1.4,
          fontWeight: 700,
          color: theme.accent,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {letter.acceptance.heading}
      </Text>
      <Text style={[BODY, { marginTop: 4 }]}>{letter.acceptance.text}</Text>
      <View style={{ flexDirection: "row", marginTop: 6 }}>
        <SignLine label="Signature" />
        <SignLine label={`Name: ${letter.acceptance.name}`} />
        <SignLine label="Date" />
      </View>
    </View>
  );
}

function Annexure({ letter, theme }: { letter: PreparedLetter; theme: DocumentTheme }) {
  const { annexure } = letter;
  if (!annexure) return null;
  const cell = (value: string, bold: boolean, align: "left" | "right", width?: number) => (
    <Text
      style={[
        BODY,
        { fontSize: 9.5, fontWeight: bold ? 700 : 400, textAlign: align },
        width ? { width, flexShrink: 0 } : { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
      ]}
    >
      {value}
    </Text>
  );
  const row = (
    cells: [string, string, string],
    options: { head?: boolean; bold?: boolean; shade?: boolean },
  ) => (
    <View
      style={[
        { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8 },
        options.head && { backgroundColor: tint(theme.accent, 0.88) },
        options.shade && { backgroundColor: tint(theme.accent, 0.96) },
        options.bold && { borderTopWidth: 1, borderTopColor: INK.text },
      ]}
    >
      {cell(cells[0], !!(options.head || options.bold), "left")}
      {cell(cells[1], !!(options.head || options.bold), "right", 110)}
      {cell(cells[2], !!(options.head || options.bold), "right", 120)}
    </View>
  );
  return (
    <View keepTogether style={{ marginTop: 26 }}>
      <Text style={{ fontSize: 11, lineHeight: 1.4, fontWeight: 700, color: theme.accent }}>
        {annexure.title}
      </Text>
      <View style={{ marginTop: 6, borderWidth: 0.75, borderColor: INK.border }}>
        {row(["Component", "Monthly", "Annual"], { head: true })}
        {annexure.rows.map((cells, index) => (
          <View key={index}>{row(cells, { shade: index % 2 === 1 })}</View>
        ))}
        {row(["Total", ...annexure.total], { bold: true })}
      </View>
    </View>
  );
}

interface LetterDocumentProps {
  templateId: string;
  letter: PreparedLetter;
  Page: PageComponent;
}

/** Renders an HR letter on the company's letterhead, in the given design. */
export function LetterDocument({ templateId, letter, Page }: LetterDocumentProps) {
  const { layout, theme } = getTemplate(templateId);
  const look = { letter, layout, theme };
  return (
    <Page
      style={{
        fontFamily: theme.font,
        color: INK.text,
        paddingTop: 40,
        paddingHorizontal: MARGIN,
        paddingBottom: FOOTER_SPACE,
      }}
    >
      {/* Running footer on every PDF page, anchored from the top (see the contract document). */}
      <View
        fixed
        pdfOnly
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          top: A4.height - 42,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 0.75,
          borderTopColor: INK.border,
          paddingTop: 5,
        }}
      >
        <Text style={{ fontSize: 7.5, lineHeight: 1.4, color: INK.faint }}>
          {letter.company.name} · {letter.title}
        </Text>
        <PageNumber style={{ fontSize: 7.5, lineHeight: 1.4, color: INK.faint }} />
      </View>

      <Letterhead {...look} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Text style={BODY}>{letter.reference ? `Ref: ${letter.reference}` : " "}</Text>
        <Text style={BODY}>Date: {letter.date}</Text>
      </View>

      <Title {...look} />

      {letter.recipient.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={[BODY, { color: INK.muted }]}>To,</Text>
          {letter.recipient.map((line, index) => (
            <Text key={index} style={[BODY, index === 0 && { fontWeight: 700 }]}>
              {line}
            </Text>
          ))}
        </View>
      )}

      {letter.subject && (
        <Text style={[BODY, { marginTop: 12, fontWeight: 700 }]}>Subject: {letter.subject}</Text>
      )}
      <Text style={[BODY, { marginTop: 12 }, !letter.recipient.length && { fontWeight: 700 }]}>
        {letter.salutation}
      </Text>

      {letter.blocks.map((block, index) => (
        <Block key={index} block={block} layout={layout} theme={theme} />
      ))}

      <Signoff letter={letter} />
      <Acceptance letter={letter} theme={theme} />
      <Annexure letter={letter} theme={theme} />
    </Page>
  );
}
