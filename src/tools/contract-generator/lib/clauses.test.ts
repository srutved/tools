import { describe, expect, it } from "vitest";
import { createContract } from "../defaults";
import { CONTRACT_EXAMPLES, SAMPLE_CONTRACT } from "../examples";
import { contractExportSchema, type Contract } from "../schema";
import { defaultTitle, prepareContract, type ClauseBlock } from "./clauses";

const headings = (contract: Contract) => prepareContract(contract).clauses.map((clause) => clause.heading);
const allText = (contract: Contract) =>
  prepareContract(contract)
    .clauses.flatMap((clause) => clause.blocks)
    .map((block: ClauseBlock) =>
      block.type === "text"
        ? block.text
        : block.type === "list"
          ? block.items.join(" ")
          : block.rows.flat().join(" "),
    )
    .join(" ");

describe("prepareContract", () => {
  it("numbers clauses in order", () => {
    const { clauses } = prepareContract(SAMPLE_CONTRACT);
    expect(clauses.map((clause) => clause.number)).toEqual(clauses.map((_, index) => index + 1));
  });

  it("names the client first in service agreements", () => {
    const { preamble, signatures } = prepareContract(SAMPLE_CONTRACT);
    expect(preamble).toMatch(/between Brightside Cafe Pvt Ltd, of .*\(the “Client”\) and Riya Sharma/);
    expect(signatures.map((signature) => signature.role)).toEqual(["Client", "Service Provider"]);
  });

  it("totals milestones and lists them", () => {
    const text = allText(SAMPLE_CONTRACT);
    expect(text).toContain("₹30,000.00 in the following instalments");
    expect(text).toContain("On signing this Agreement");
  });

  it("describes hourly fees with a cap", () => {
    const contract = createContract({ currency: "USD" });
    contract.payment = { ...contract.payment, structure: "hourly", amount: 50, hoursCap: 40 };
    expect(allText(contract)).toMatch(/\$50\.00 per hour.*more than 40 hours/);
  });

  it("includes optional clauses only when switched on", () => {
    const base = { ...SAMPLE_CONTRACT, limitLiability: false, nonSolicitation: false };
    expect(headings(base)).not.toContain("Limitation of liability");
    expect(headings({ ...base, limitLiability: true, nonSolicitation: true })).toEqual(
      expect.arrayContaining(["Limitation of liability", "Non-solicitation"]),
    );
  });

  it("adds custom clauses before the governing law clause", () => {
    const contract = {
      ...SAMPLE_CONTRACT,
      customClauses: [{ id: "x", title: "Travel", text: "Travel outside Pune is billed at cost." }],
    };
    const list = headings(contract);
    expect(list.indexOf("Travel")).toBeLessThan(list.indexOf("Governing law and disputes"));
    expect(list.at(-1)).toBe("General");
  });

  it("switches between courts and arbitration", () => {
    expect(allText({ ...SAMPLE_CONTRACT, disputes: "courts" })).toContain("courts at Pune, Maharashtra");
    expect(allText({ ...SAMPLE_CONTRACT, disputes: "arbitration" })).toContain(
      "seat of arbitration will be Pune",
    );
  });

  it("titles NDAs by type and describes mutual parties without roles", () => {
    const nda = { ...createContract({ kind: "nda", currency: "INR" }), ndaType: "mutual" as const };
    expect(defaultTitle(nda)).toBe("Mutual Non-Disclosure Agreement");
    expect(prepareContract(nda).preamble).toContain("(each a “Party” and together the “Parties”)");
  });

  it("uses the master agreement instead of repeating general terms in a statement of work", () => {
    const sow = CONTRACT_EXAMPLES.find((example) => example.slug === "statement-of-work")!.document;
    expect(headings(sow)).toContain("Governing law and disputes");
    const underMsa = headings({ ...sow, masterAgreement: "the Master Services Agreement dated 1 June 2026" });
    expect(underMsa).toContain("Relationship to the master agreement");
    expect(underMsa).not.toContain("Governing law and disputes");
  });

  it("tolerates partially typed data from the live form", () => {
    const partial = {
      ...createContract({ currency: "INR" }),
      you: undefined,
      deliverables: undefined,
    } as never;
    expect(() => prepareContract(partial)).not.toThrow();
  });
});

describe("contract templates (landing pages)", () => {
  for (const example of CONTRACT_EXAMPLES) {
    it(`${example.slug} is a complete, valid contract`, () => {
      const result = contractExportSchema.safeParse(example.document);
      expect(result.success ? [] : result.error.issues.map((issue) => issue.message)).toEqual([]);
    });
  }
});
