import { describe, expect, it } from "vitest";
import { createCoverLetter } from "../defaults";
import { SAMPLE_COVER_LETTER } from "../sample";
import { prepareCoverLetter, toParagraphs } from "./prepare";

describe("toParagraphs", () => {
  it("splits on blank lines and keeps single line breaks", () => {
    expect(toParagraphs("First line\nsame paragraph\n\n  \nSecond\r\n\r\nThird  ")).toEqual([
      "First line\nsame paragraph",
      "Second",
      "Third",
    ]);
  });
});

describe("prepareCoverLetter", () => {
  it("writes the date out and lists the recipient's lines", () => {
    const prepared = prepareCoverLetter(SAMPLE_COVER_LETTER);
    expect(prepared.date).toBe("13 October 2026");
    expect(prepared.recipient).toEqual([
      "Ms. Anita Rao",
      "Head of Engineering",
      "Brightpath Learning",
      "8th Floor, Prestige Tech Park",
      "Bengaluru, Karnataka 560103",
    ]);
    expect(prepared.paragraphs).toHaveLength(4);
    expect(prepared.contacts[0]).toMatchObject({ kind: "email" });
  });

  it("starts new letters from a resume's details and design", () => {
    const letter = createCoverLetter({ basics: SAMPLE_COVER_LETTER.basics, templateId: "sidebar-plum" });
    expect(letter.templateId).toBe("sidebar-plum");
    expect(letter.basics.name).toBe(SAMPLE_COVER_LETTER.basics.name);
    expect(letter.basics.links[0].id).not.toBe(SAMPLE_COVER_LETTER.basics.links[0].id);
  });

  it("tolerates partially typed data from the live form", () => {
    const partial = { ...createCoverLetter(), basics: undefined, recipient: undefined } as never;
    expect(() => prepareCoverLetter(partial)).not.toThrow();
  });
});
