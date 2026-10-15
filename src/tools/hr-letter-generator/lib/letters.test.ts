import { describe, expect, it } from "vitest";
import { breakdownFromCtc } from "../defaults";
import { SAMPLE_HR_LETTER } from "../sample";
import { hrLetterExportSchema, type HrLetter } from "../schema";
import { breakdownAnnualTotal, letterTitle, prepareLetter } from "./letters";

const letter = (overrides: Partial<HrLetter>): HrLetter => ({ ...SAMPLE_HR_LETTER, ...overrides });
const allText = (prepared: ReturnType<typeof prepareLetter>) =>
  prepared.blocks
    .map((block) => (block.type === "term" ? `${block.heading}: ${block.text}` : block.text))
    .join("\n");
const errorPaths = (value: HrLetter) => {
  const result = hrLetterExportSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("prepareLetter", () => {
  it("writes an offer letter with numbered terms, an acceptance block and the annexure", () => {
    const prepared = prepareLetter(SAMPLE_HR_LETTER);
    expect(prepared.title).toBe("Offer Letter");
    expect(prepared.subject).toBe("Offer of employment - Senior Product Designer");
    expect(prepared.salutation).toBe("Dear Priya,");
    const terms = prepared.blocks.filter((block) => block.type === "term").map((block) => block.heading);
    expect(terms).toEqual([
      "Start date",
      "Place of work",
      "Compensation",
      "Probation",
      "Working hours",
      "Notice period",
      "Confidentiality",
      "Documents",
    ]);
    expect(allText(prepared)).toContain("₹18,00,000.00 (Indian Rupees Eighteen Lakh Only)");
    expect(allText(prepared)).toContain("This offer is valid until 22 October 2026.");
    expect(prepared.acceptance?.name).toBe("Priya Nair");
    expect(prepared.annexure?.total).toEqual(["₹1,50,000.00", "₹18,00,000.00"]);
  });

  it("turns an offer into an internship offer with a stipend and no probation", () => {
    const prepared = prepareLetter(
      letter({ employmentType: "internship", pay: 15000, endDate: "2027-02-15", salaryBreakdown: [] }),
    );
    expect(prepared.title).toBe("Internship Offer Letter");
    const text = allText(prepared);
    expect(text).toContain("monthly stipend of ₹15,000.00");
    expect(text).toContain("from 16 November 2026 to 15 February 2027");
    expect(text).not.toContain("Probation");
    expect(prepared.annexure).toBeNull();
  });

  it("addresses experience certificates to whom it may concern, with the chosen pronoun", () => {
    const base = { kind: "experience" as const, joiningDate: "2023-06-01", endDate: "2026-10-10" };
    const they = prepareLetter(letter(base));
    expect(they.title).toBe("Experience Certificate");
    expect(they.recipient).toEqual([]);
    expect(they.salutation).toBe("To whom it may concern");
    expect(they.acceptance).toBeNull();
    expect(they.annexure).toBeNull();
    expect(allText(they)).toContain("We wish them every success in their future endeavours.");
    const she = prepareLetter(
      letter({ ...base, employee: { ...SAMPLE_HR_LETTER.employee, pronoun: "she" } }),
    );
    expect(allText(she)).toContain("We wish her every success in her future endeavours.");
  });

  it("confirms the resignation and last working day in a relieving letter", () => {
    const prepared = prepareLetter(
      letter({
        kind: "relieving",
        resignationDate: "2026-08-10",
        endDate: "2026-10-10",
        joiningDate: "2023-06-01",
      }),
    );
    expect(prepared.title).toBe("Relieving Letter");
    expect(allText(prepared)).toContain("your resignation dated 10 August 2026");
    expect(allText(prepared)).toContain("with effect from the close of business on 10 October 2026");
  });

  it("works out the rise in an increment letter, and names a promotion", () => {
    const increment = letter({ kind: "increment", previousPay: 1500000, effectiveDate: "2027-04-01" });
    expect(allText(prepareLetter(increment))).toContain(
      "revise your annual cost to company (CTC) from ₹15,00,000.00 to ₹18,00,000.00, an increase of 20%, with effect from 1 April 2027",
    );
    const promotion = prepareLetter({ ...increment, newDesignation: "Design Lead" });
    expect(promotion.title).toBe("Promotion Letter");
    expect(promotion.subject).toBe("Promotion to Design Lead");
    expect(promotion.annexure?.title).toBe("Annexure A: Revised salary breakdown");
  });

  it("adds custom terms as numbered terms after the standard ones", () => {
    const prepared = prepareLetter(
      letter({ customTerms: [{ id: "c", title: "Laptop", text: "You will be given a company laptop." }] }),
    );
    const last = prepared.blocks.filter((block) => block.type === "term").at(-1);
    expect(last).toMatchObject({ number: 9, heading: "Laptop" });
  });

  it("titles each kind", () => {
    expect(letterTitle({ kind: "experience", employmentType: "internship", newDesignation: "" })).toBe(
      "Internship Certificate",
    );
    expect(letterTitle({ kind: "appointment", employmentType: "full-time", newDesignation: "" })).toBe(
      "Appointment Letter",
    );
  });
});

describe("breakdownFromCtc", () => {
  it("splits a CTC into components that add back up to it", () => {
    const rows = breakdownFromCtc(1800000);
    expect(rows.map((row) => [row.label, row.monthly])).toEqual([
      ["Basic salary", 75000],
      ["House rent allowance (HRA)", 37500],
      ["Special allowance", 35700],
      ["Employer's PF contribution", 1800],
    ]);
    expect(breakdownAnnualTotal({ salaryBreakdown: rows })).toBe(1800000);
  });
});

describe("hrLetterExportSchema", () => {
  it("accepts the sample", () => {
    expect(errorPaths(SAMPLE_HR_LETTER)).toEqual([]);
  });

  it("checks only the fields the kind of letter uses", () => {
    expect(errorPaths(letter({ kind: "experience", joiningDate: "", endDate: "" }))).toEqual([
      "joiningDate",
      "endDate",
    ]);
    expect(errorPaths(letter({ kind: "increment", pay: 0, effectiveDate: "", designation: "" }))).toEqual([
      "pay",
      "effectiveDate",
    ]);
    expect(errorPaths(letter({ offerValidUntil: "2026-10-01" }))).toEqual(["offerValidUntil"]);
  });
});
