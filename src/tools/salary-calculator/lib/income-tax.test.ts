import { describe, expect, it } from "vitest";
import { incomeTax, slabTax } from "./income-tax";

describe("slabTax", () => {
  it("applies the new regime slabs", () => {
    expect(slabTax(400000, "new")).toBe(0);
    expect(slabTax(800000, "new")).toBe(20000);
    expect(slabTax(1200000, "new")).toBe(60000);
    expect(slabTax(2400000, "new")).toBe(300000);
    expect(slabTax(3000000, "new")).toBe(480000);
  });

  it("applies the old regime slabs", () => {
    expect(slabTax(250000, "old")).toBe(0);
    expect(slabTax(500000, "old")).toBe(12500);
    expect(slabTax(1000000, "old")).toBe(112500);
    expect(slabTax(1500000, "old")).toBe(262500);
  });
});

describe("incomeTax, new regime", () => {
  it("charges nothing up to ₹12 lakh", () => {
    expect(incomeTax(1200000, "new")).toMatchObject({ slabTax: 60000, rebate: 60000, total: 0 });
  });

  it("gives marginal relief just above ₹12 lakh", () => {
    expect(incomeTax(1250000, "new").total).toBe(52000);
    expect(incomeTax(1270000, "new").total).toBe(72800);
  });

  it("charges full slab tax once relief runs out", () => {
    expect(incomeTax(1300000, "new")).toMatchObject({ rebate: 0, cess: 3000, total: 78000 });
    expect(incomeTax(2400000, "new").total).toBe(312000);
  });

  it("adds surcharge with marginal relief above ₹50 lakh", () => {
    const justAbove = incomeTax(5100000, "new");
    expect(justAbove.surcharge).toBe(70000);
    expect(justAbove.total).toBe(1227200);
    const wellAbove = incomeTax(6000000, "new");
    expect(wellAbove.surcharge).toBe(138000);
    expect(wellAbove.total).toBe(1578720);
  });

  it("caps the surcharge at 25%", () => {
    expect(incomeTax(60000000, "new").surcharge).toBe(4395000);
  });

  it("treats negative income as nil", () => {
    expect(incomeTax(-5, "new").total).toBe(0);
  });
});

describe("incomeTax, old regime", () => {
  it("charges nothing up to ₹5 lakh, with no marginal relief above it", () => {
    expect(incomeTax(500000, "old").total).toBe(0);
    expect(incomeTax(510000, "old").total).toBe(15080);
  });

  it("adds 4% cess", () => {
    expect(incomeTax(1000000, "old")).toMatchObject({ slabTax: 112500, cess: 4500, total: 117000 });
  });

  it("goes up to a 37% surcharge above ₹5 crore", () => {
    expect(incomeTax(60000000, "old").surcharge).toBe(6590625);
  });
});
