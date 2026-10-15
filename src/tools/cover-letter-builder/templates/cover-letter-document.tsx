"use client";

/**
 * Cover letters are drawn with the resume templates' designs: the same header, colours and fonts,
 * followed by the letter. A letter and a resume with the same template id look like a set.
 */

import type { ReactNode } from "react";
import { Text, View, type DocStyle, type PageComponent } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import { SIDEBAR_PAGE_MARGIN, SIDEBAR_WIDTH } from "@/tools/resume-builder/templates/layouts/sidebar";
import {
  accentTone,
  ContactLine,
  ContactList,
  lightTone,
  PAGE_MARGIN,
  pageStyle,
  Photo,
  type Tone,
} from "@/tools/resume-builder/templates/parts";
import { getTemplate } from "@/tools/resume-builder/templates/registry";
import type { LayoutId } from "@/tools/resume-builder/templates/types";
import type { PreparedCoverLetter } from "../lib/prepare";

const LETTER_SIZE = 10;

interface LayoutProps {
  letter: PreparedCoverLetter;
  theme: DocumentTheme;
}

/** Date, recipient, subject, greeting, paragraphs and sign-off. Shared by every design. */
function LetterBody({ letter, tone }: { letter: PreparedCoverLetter; tone: Tone }) {
  const body: DocStyle = { fontSize: LETTER_SIZE, lineHeight: 1.55, color: tone.text };
  return (
    <>
      {letter.date && <Text style={[body, { color: tone.muted }]}>{letter.date}</Text>}
      {letter.recipient.length > 0 && (
        <View style={{ marginTop: 14 }}>
          {letter.recipient.map((line, index) => (
            <Text key={index} style={[body, { lineHeight: 1.4 }, index === 0 && { fontWeight: 700 }]}>
              {line}
            </Text>
          ))}
        </View>
      )}
      {letter.subject && (
        <Text style={[body, { fontWeight: 700, marginTop: 16, color: tone.accent }]}>{letter.subject}</Text>
      )}
      {letter.greeting && <Text style={[body, { marginTop: 14 }]}>{letter.greeting}</Text>}
      {letter.paragraphs.map((paragraph, index) => (
        <Text key={index} style={[body, { marginTop: 10 }]}>
          {paragraph}
        </Text>
      ))}
      {/* The sign-off never ends up alone at the top of a page. */}
      <View keepTogether style={{ marginTop: 18 }}>
        {letter.closing && <Text style={body}>{letter.closing}</Text>}
        <Text style={[body, { fontWeight: 700, marginTop: 20 }]}>{letter.name || " "}</Text>
        {letter.headline && <Text style={[body, { fontSize: 9, color: tone.muted }]}>{letter.headline}</Text>}
      </View>
    </>
  );
}

function ClassicLetter({ letter, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <View
        style={{
          alignItems: "center",
          paddingBottom: 14,
          borderBottomWidth: 0.75,
          borderBottomColor: theme.accent,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
            color: theme.accent,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {letter.name || " "}
        </Text>
        {letter.headline && (
          <Text style={{ fontSize: 11.5, color: INK.muted, textAlign: "center", marginTop: 2 }}>
            {letter.headline}
          </Text>
        )}
        <ContactLine contacts={letter.contacts} tone={tone} align="center" />
      </View>
      <View style={{ marginTop: 24 }}>
        <LetterBody letter={letter} tone={tone} />
      </View>
    </>
  );
}

function ModernLetter({ letter, theme }: LayoutProps) {
  return (
    <>
      <View
        style={{
          backgroundColor: theme.accent,
          marginTop: -PAGE_MARGIN,
          marginHorizontal: -PAGE_MARGIN,
          paddingHorizontal: PAGE_MARGIN,
          paddingTop: 28,
          paddingBottom: 22,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
          <Text style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 700, color: theme.onAccent }}>
            {letter.name || " "}
          </Text>
          {letter.headline && (
            <Text style={{ fontSize: 12, color: tint(theme.accent, 0.8), marginTop: 3 }}>
              {letter.headline}
            </Text>
          )}
          <ContactLine contacts={letter.contacts} tone={accentTone(theme)} />
        </View>
        {letter.photo && (
          <View style={{ marginLeft: 20 }}>
            <Photo src={letter.photo} size={72} borderColor={theme.onAccent} />
          </View>
        )}
      </View>
      <View style={{ marginTop: 28 }}>
        <LetterBody letter={letter} tone={lightTone(theme)} />
      </View>
    </>
  );
}

function ExecutiveLetter({ letter, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <Text style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 700, color: INK.text, letterSpacing: 0.3 }}>
        {letter.name || " "}
      </Text>
      {letter.headline && (
        <Text style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginTop: 3 }}>
          {letter.headline}
        </Text>
      )}
      <ContactLine contacts={letter.contacts} tone={tone} />
      <View style={{ height: 2, backgroundColor: theme.accent, marginTop: 12, marginBottom: 24 }} />
      <LetterBody letter={letter} tone={tone} />
    </>
  );
}

function SidebarLetter({ letter, theme }: LayoutProps) {
  const side = accentTone(theme);
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
      {/* Columns stretch (the default) so both keep their place on every PDF page. */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: SIDEBAR_WIDTH, flexShrink: 0, paddingHorizontal: 20 }}>
          {letter.photo && (
            <View style={{ alignItems: "center", marginBottom: 18 }}>
              <Photo src={letter.photo} size={96} borderColor={theme.onAccent} />
            </View>
          )}
          {letter.contacts.length > 0 && (
            <View>
              <View
                style={{
                  borderBottomWidth: 0.75,
                  borderBottomColor: side.rule,
                  paddingBottom: 3,
                  marginBottom: 7,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: side.accent,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                  }}
                >
                  Contact
                </Text>
              </View>
              <ContactList contacts={letter.contacts} tone={side} />
            </View>
          )}
        </View>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingLeft: 26, paddingRight: 36 }}>
          <Text style={{ fontSize: 25, lineHeight: 1.15, fontWeight: 700, color: theme.accent }}>
            {letter.name || " "}
          </Text>
          {letter.headline && (
            <Text style={{ fontSize: 12, color: INK.muted, marginTop: 3 }}>{letter.headline}</Text>
          )}
          <View style={{ marginTop: 26 }}>
            <LetterBody letter={letter} tone={lightTone(theme)} />
          </View>
        </View>
      </View>
    </>
  );
}

function SplitLetter({ letter, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 14,
          borderBottomWidth: 2,
          borderBottomColor: theme.accent,
        }}
      >
        {letter.photo && (
          <View style={{ marginRight: 16 }}>
            <Photo src={letter.photo} size={72} />
          </View>
        )}
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
          <Text style={{ fontSize: 25, lineHeight: 1.15, fontWeight: 700, color: INK.text }}>
            {letter.name || " "}
          </Text>
          {letter.headline && (
            <Text style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginTop: 2 }}>
              {letter.headline}
            </Text>
          )}
          <ContactLine contacts={letter.contacts} tone={tone} />
        </View>
      </View>
      <View style={{ marginTop: 26 }}>
        <LetterBody letter={letter} tone={tone} />
      </View>
    </>
  );
}

const LAYOUTS: Record<LayoutId, { Component: (props: LayoutProps) => ReactNode; page: DocStyle }> = {
  classic: { Component: ClassicLetter, page: { paddingVertical: PAGE_MARGIN, paddingHorizontal: 56 } },
  modern: { Component: ModernLetter, page: { padding: PAGE_MARGIN } },
  executive: { Component: ExecutiveLetter, page: { paddingVertical: PAGE_MARGIN, paddingHorizontal: 52 } },
  sidebar: { Component: SidebarLetter, page: { paddingVertical: SIDEBAR_PAGE_MARGIN } },
  split: { Component: SplitLetter, page: { padding: PAGE_MARGIN } },
};

interface CoverLetterDocumentProps {
  templateId: string;
  letter: PreparedCoverLetter;
  Page: PageComponent;
}

/** Renders a cover letter in the given (resume) template onto any render target. */
export function CoverLetterDocument({ templateId, letter, Page }: CoverLetterDocumentProps) {
  const template = getTemplate(templateId);
  const { Component, page } = LAYOUTS[template.layout];
  return (
    <Page style={[pageStyle(template.theme), page]}>
      <Component letter={letter} theme={template.theme} />
    </Page>
  );
}
