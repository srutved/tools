"use client";

import { Text, View } from "@/lib/document/primitives";
import { INK } from "@/lib/document/theme";
import { ContactLine, lightTone, Section } from "../parts";
import type { LayoutProps } from "../types";

const LABEL_WIDTH = 104;

/** Strong left-aligned header; section titles sit in the left margin beside their content. */
export function ExecutiveLayout({ resume, theme }: LayoutProps) {
  const tone = lightTone(theme);
  return (
    <>
      <Text style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 700, color: INK.text, letterSpacing: 0.3 }}>
        {resume.name || " "}
      </Text>
      {resume.headline && (
        <Text style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginTop: 3 }}>
          {resume.headline}
        </Text>
      )}
      <ContactLine contacts={resume.contacts} tone={tone} />
      <View style={{ height: 2, backgroundColor: theme.accent, marginTop: 12 }} />

      {resume.sections.map((section, index) => (
        <View
          key={section.key}
          style={[
            { paddingTop: 12, paddingLeft: LABEL_WIDTH, marginTop: index === 0 ? 2 : 10 },
            index > 0 && { borderTopWidth: 0.75, borderTopColor: INK.border },
          ]}
        >
          <Section
            section={section}
            resume={resume}
            tone={tone}
            // The title hangs in the margin, but belongs to the first entry so they share a page.
            heading={
              <View style={{ position: "absolute", top: 0, left: -LABEL_WIDTH, width: LABEL_WIDTH - 12 }}>
                <Text
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: theme.accent,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    lineHeight: 1.6,
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
