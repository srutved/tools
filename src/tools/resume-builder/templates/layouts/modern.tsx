"use client";

import { Text, View } from "@/lib/document/primitives";
import { tint } from "@/lib/document/theme";
import { accentTone, ContactLine, lightTone, PAGE_MARGIN, Photo, Section } from "../parts";
import type { LayoutProps } from "../types";

/** Full-width colour header with an optional photo, then a single column with skill tags. */
export function ModernLayout({ resume, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <View
        style={{
          backgroundColor: theme.accent,
          // Bleed to the page edges through the page margin.
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
            {resume.name || " "}
          </Text>
          {resume.headline && (
            <Text style={{ fontSize: 12, color: tint(theme.accent, 0.8), marginTop: 3 }}>
              {resume.headline}
            </Text>
          )}
          <ContactLine contacts={resume.contacts} tone={accentTone(theme)} />
        </View>
        {resume.photo && (
          <View style={{ marginLeft: 20 }}>
            <Photo src={resume.photo} size={80} borderColor={theme.onAccent} />
          </View>
        )}
      </View>

      {resume.sections.map((section, index) => (
        <View key={section.key} style={{ marginTop: index === 0 ? 18 : 13 }}>
          <Section
            section={section}
            resume={resume}
            tone={tone}
            skillStyle="tags"
            heading={
              <View style={{ marginBottom: 6 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: theme.accent,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {section.title}
                </Text>
                <View
                  style={{
                    width: 28,
                    height: 2.5,
                    backgroundColor: theme.accent,
                    marginTop: 2,
                    borderRadius: 1,
                  }}
                />
              </View>
            }
          />
        </View>
      ))}
    </>
  );
}
