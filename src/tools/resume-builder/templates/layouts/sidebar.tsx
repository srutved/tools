"use client";

import { Text, View } from "@/lib/document/primitives";
import { INK } from "@/lib/document/theme";
import {
  accentTone,
  ContactList,
  lightTone,
  Photo,
  Section,
  SIDE_SECTIONS,
  splitSections,
  type Tone,
} from "../parts";
import type { LayoutProps } from "../types";

export const SIDEBAR_WIDTH = 186;
/** The page has vertical margins only; the columns set their own horizontal padding. */
export const SIDEBAR_PAGE_MARGIN = 36;

function SidebarHeading({ title, tone }: { title: string; tone: Tone }) {
  return (
    <View
      style={{ borderBottomWidth: 0.75, borderBottomColor: tone.rule, paddingBottom: 3, marginBottom: 7 }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: tone.accent,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

/**
 * A coloured sidebar with photo, contact details, skills and languages; experience takes the main
 * column. The sidebar colour is a fixed background repeated on every page, and both columns flow
 * onto the next page when they run long.
 */
export function SidebarLayout({ resume, theme }: LayoutProps) {
  const side = accentTone(theme);
  const main = lightTone(theme);
  const sections = splitSections(resume, SIDE_SECTIONS);

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
      {/* Columns must stretch (the default): with "flex-start" the shorter column ends on page 1 and
          the PDF engine shifts the other one sideways on later pages. */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: SIDEBAR_WIDTH, flexShrink: 0, paddingHorizontal: 20 }}>
          {resume.photo && (
            <View style={{ alignItems: "center", marginBottom: 18 }}>
              <Photo src={resume.photo} size={96} borderColor={theme.onAccent} />
            </View>
          )}
          {resume.contacts.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <SidebarHeading title="Contact" tone={side} />
              <ContactList contacts={resume.contacts} tone={side} />
            </View>
          )}
          {sections.side.map((section) => (
            <View key={section.key} style={{ marginBottom: 16 }}>
              <Section
                section={section}
                resume={resume}
                tone={side}
                narrow
                skillStyle="stacked"
                heading={<SidebarHeading title={section.title} tone={side} />}
              />
            </View>
          ))}
        </View>

        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, paddingLeft: 26, paddingRight: 36 }}>
          <Text style={{ fontSize: 25, lineHeight: 1.15, fontWeight: 700, color: theme.accent }}>
            {resume.name || " "}
          </Text>
          {resume.headline && (
            <Text style={{ fontSize: 12, color: INK.muted, marginTop: 3 }}>{resume.headline}</Text>
          )}
          {sections.main.map((section) => (
            <View key={section.key} style={{ marginTop: 18 }}>
              <Section
                section={section}
                resume={resume}
                tone={main}
                heading={<SidebarHeading title={section.title} tone={main} />}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
