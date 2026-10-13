"use client";

import { Text, View } from "@/lib/document/primitives";
import { INK, tint, type DocumentTheme } from "@/lib/document/theme";
import type { SectionId } from "../../schema";
import { ContactLine, lightTone, Photo, Section, splitSections } from "../parts";
import type { LayoutProps } from "../types";

const SIDE_WIDTH = 168;
const SPLIT_SIDE: readonly SectionId[] = ["skills", "education", "languages", "certifications"];

function SplitHeading({ title, theme }: { title: string; theme: DocumentTheme }) {
  return (
    <View
      style={{
        backgroundColor: tint(theme.accent, 0.9),
        borderLeftWidth: 3,
        borderLeftColor: theme.accent,
        paddingVertical: 3,
        paddingHorizontal: 7,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: theme.accent,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

/** Header across the page, then a wide main column and a narrow column for skills and education. */
export function SplitLayout({ resume, theme }: LayoutProps) {
  const tone = lightTone(theme);
  const sections = splitSections(resume, SPLIT_SIDE);

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
        {resume.photo && (
          <View style={{ marginRight: 16 }}>
            <Photo src={resume.photo} size={72} />
          </View>
        )}
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
          <Text style={{ fontSize: 25, lineHeight: 1.15, fontWeight: 700, color: INK.text }}>
            {resume.name || " "}
          </Text>
          {resume.headline && (
            <Text style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginTop: 2 }}>
              {resume.headline}
            </Text>
          )}
          <ContactLine contacts={resume.contacts} tone={tone} />
        </View>
      </View>

      {/* Columns stretch (the default) so both keep their place on every PDF page. */}
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingRight: 18 }}>
          {sections.main.map((section, index) => (
            <View key={section.key} style={{ marginTop: index === 0 ? 0 : 14 }}>
              <Section
                section={section}
                resume={resume}
                tone={tone}
                heading={<SplitHeading title={section.title} theme={theme} />}
              />
            </View>
          ))}
        </View>
        <View style={{ width: SIDE_WIDTH, flexShrink: 0 }}>
          {sections.side.map((section, index) => (
            <View key={section.key} style={{ marginTop: index === 0 ? 0 : 14 }}>
              <Section
                section={section}
                resume={resume}
                tone={tone}
                narrow
                skillStyle="tags"
                heading={<SplitHeading title={section.title} theme={theme} />}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
