import { describe, expect, it } from "vitest";
import { createResume } from "../defaults";
import { SAMPLE_RESUME } from "../sample";
import {
  displayUrl,
  formatDateRange,
  normalizeSectionOrder,
  prepareResume,
  toBullets,
  toHref,
  toSkillList,
} from "./prepare";

describe("toBullets", () => {
  it("splits lines and strips typed or pasted bullet markers", () => {
    expect(
      toBullets("- Led a team\n• Shipped v2\n\n* Cut costs\n1. Hired 4 engineers\n  Plain line  "),
    ).toEqual(["Led a team", "Shipped v2", "Cut costs", "Hired 4 engineers", "Plain line"]);
  });

  it("keeps hyphens that are part of the text", () => {
    expect(toBullets("Built a real-time dashboard\n-5% churn")).toEqual([
      "Built a real-time dashboard",
      "-5% churn",
    ]);
  });
});

describe("toSkillList", () => {
  it("accepts commas, semicolons and new lines", () => {
    expect(toSkillList("React, Node.js; SQL\nFigma,, ")).toEqual(["React", "Node.js", "SQL", "Figma"]);
  });
});

describe("formatDateRange", () => {
  it("joins start and end with an en dash", () => {
    expect(formatDateRange("2018", "2022")).toBe("2018 – 2022");
  });
  it("uses Present for current roles", () => {
    expect(formatDateRange("Jan 2022", "Mar 2023", true)).toBe("Jan 2022 – Present");
  });
  it("handles a single or repeated date", () => {
    expect(formatDateRange("2020", "")).toBe("2020");
    expect(formatDateRange("", "2021")).toBe("2021");
    expect(formatDateRange("2021", "2021")).toBe("2021");
    expect(formatDateRange("", "")).toBe("");
  });
});

describe("links", () => {
  it("shows URLs without protocol, www or trailing slash", () => {
    expect(displayUrl("https://www.linkedin.com/in/aarav/")).toBe("linkedin.com/in/aarav");
    expect(displayUrl("github.com/aarav")).toBe("github.com/aarav");
  });
  it("makes bare domains clickable", () => {
    expect(toHref("aarav.dev")).toBe("https://aarav.dev");
    expect(toHref("http://aarav.dev")).toBe("http://aarav.dev");
    expect(toHref("mailto:a@b.co")).toBe("mailto:a@b.co");
  });
});

describe("normalizeSectionOrder", () => {
  it("drops unknown and duplicate ids and appends missing sections", () => {
    expect(normalizeSectionOrder(["skills", "bogus", "skills", "summary"])).toEqual([
      "skills",
      "summary",
      "experience",
      "education",
      "projects",
      "certifications",
      "languages",
    ]);
  });
});

describe("prepareResume", () => {
  it("drops empty entries and sections", () => {
    const prepared = prepareResume(createResume());
    expect(prepared.experience).toEqual([]);
    expect(prepared.sections).toEqual([]);
    expect(prepared.contacts).toEqual([]);
  });

  it("orders sections as the user chose and only includes ones with content", () => {
    const prepared = prepareResume({ ...SAMPLE_RESUME, sectionOrder: ["skills", "experience"] });
    expect(prepared.sections.slice(0, 2).map((section) => section.key)).toEqual(["skills", "experience"]);
    expect(prepared.sections.map((section) => section.key)).toContain("summary");
  });

  it("builds clickable contact details", () => {
    const prepared = prepareResume(SAMPLE_RESUME);
    expect(prepared.contacts[0]).toMatchObject({
      kind: "email",
      href: `mailto:${SAMPLE_RESUME.basics.email}`,
    });
    expect(prepared.contacts.find((contact) => contact.kind === "phone")?.href).toBe("tel:+919876543210");
    expect(prepared.contacts.find((contact) => contact.kind === "link")?.href).toMatch(/^https:\/\//);
  });

  it("tolerates partially typed data from the live form", () => {
    const partial = { ...createResume(), basics: undefined, experience: undefined } as never;
    expect(() => prepareResume(partial)).not.toThrow();
  });
});

describe("custom sections and section settings", () => {
  const base = createResume();
  const awards = {
    id: "a1",
    title: "Awards",
    format: "entries" as const,
    placement: "main" as const,
    text: "",
    entries: [
      { id: "x", title: "Employee of the Year", subtitle: "Acme", date: "2023", description: "- Top 1%" },
    ],
  };
  const interests = {
    id: "i1",
    title: "Interests",
    format: "list" as const,
    placement: "side" as const,
    text: "Chess\n- Running",
    entries: [],
  };

  it("adds custom sections after built-in ones, in the user's order", () => {
    const prepared = prepareResume({
      ...base,
      summary: "Hello",
      customSections: [awards, interests],
      sectionOrder: ["custom:i1", "summary"],
    });
    expect(prepared.sections.map((section) => section.key)).toEqual(["custom:i1", "summary", "custom:a1"]);
    const list = prepared.sections[0];
    expect(list.kind === "custom" && list.lines).toEqual(["Chess", "Running"]);
    const entries = prepared.sections[2];
    expect(entries.kind === "custom" && entries.entries[0].bullets).toEqual(["Top 1%"]);
  });

  it("skips empty custom sections", () => {
    const empty = { ...interests, text: "  " };
    expect(prepareResume({ ...base, customSections: [empty] }).sections).toEqual([]);
  });

  it("applies renamed headings and hides hidden sections", () => {
    const prepared = prepareResume({
      ...SAMPLE_RESUME,
      sectionTitles: { experience: "Work History", skills: "  " },
      hiddenSections: ["languages"],
    });
    const titles = Object.fromEntries(prepared.sections.map((section) => [section.key, section.title]));
    expect(titles.experience).toBe("Work History");
    expect(titles.skills).toBe("Skills");
    expect(titles.languages).toBeUndefined();
  });

  it("shows custom personal details with the contact details", () => {
    const prepared = prepareResume({
      ...base,
      basics: { ...base.basics, details: [{ id: "d", label: "Nationality", value: "Indian" }] },
    });
    expect(prepared.contacts).toEqual([{ kind: "detail", label: "Nationality", text: "Indian" }]);
  });
});
