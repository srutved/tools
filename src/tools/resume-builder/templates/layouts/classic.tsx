"use client";

import { Text, View } from "@/lib/document/primitives";
import { INK } from "@/lib/document/theme";
import { ContactLine, lightTone, Section } from "../parts";
import type { LayoutProps } from "../types";

/** Centred header and ruled section headings, in a single column that every ATS reads cleanly. */
export function ClassicLayout({ resume, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <View style={{ alignItems: "center" }}>
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
          {resume.name || " "}
        </Text>
        {resume.headline && (
          <Text style={{ fontSize: 11.5, color: INK.muted, textAlign: "center", marginTop: 2 }}>
            {resume.headline}
          </Text>
        )}
        <ContactLine contacts={resume.contacts} tone={tone} align="center" />
      </View>

      {resume.sections.map((section) => (
        <View key={section.key} style={{ marginTop: 16 }}>
          <Section
            section={section}
            resume={resume}
            tone={tone}
            heading={
              <View
                style={{
                  borderBottomWidth: 0.75,
                  borderBottomColor: theme.accent,
                  paddingBottom: 2,
                  marginBottom: 7,
                }}
              >
                <Text
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: theme.accent,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                  }}
                >
                  {section.title}
                </Text>
              </View>
            }
          />
        </View>
      ))}
    </>
  );
}
