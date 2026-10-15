import { describe, expect, it } from "vitest";
import { becameMetroIn2026, calculateHraExemption, isMetro, metroCities } from "./hra";

describe("metro cities", () => {
  it("has four metros up to FY 2025-26 and eight from FY 2026-27", () => {
    expect(metroCities("2025-26")).toEqual(["delhi", "mumbai", "kolkata", "chennai"]);
    expect(metroCities("2026-27")).toHaveLength(8);
    expect(isMetro("bengaluru", "2025-26")).toBe(false);
    expect(isMetro("bengaluru", "2026-27")).toBe(true);
    expect(isMetro("ahmedabad", "2026-27")).toBe(true);
    expect(isMetro("other", "2026-27")).toBe(false);
    expect(isMetro("", "2026-27")).toBe(false);
  });

  it("knows which cities were added in 2026", () => {
    expect(becameMetroIn2026("pune")).toBe(true);
    expect(becameMetroIn2026("delhi")).toBe(false);
    expect(becameMetroIn2026("")).toBe(false);
  });
});

describe("calculateHraExemption", () => {
  it("takes the least of the three limits in a metro", () => {
    const result = calculateHraExemption({
      basic: 50000,
      hraReceived: 25000,
      rentPaid: 20000,
      city: "mumbai",
      taxYear: "2026-27",
    });
    expect(result.limits).toEqual({ actualHra: 25000, rentOverTenPercent: 15000, percentOfBasic: 25000 });
    expect(result.least).toBe("rentOverTenPercent");
    expect(result.exempt).toBe(15000);
    expect(result.taxable).toBe(10000);
    expect(result.basicPercent).toBe(50);
  });

  it("uses 40% of basic outside the metros", () => {
    const result = calculateHraExemption({
      basic: 40000,
      hraReceived: 20000,
      rentPaid: 30000,
      city: "other",
      taxYear: "2026-27",
    });
    expect(result.basicPercent).toBe(40);
    expect(result.limits.percentOfBasic).toBe(16000);
    expect(result.least).toBe("percentOfBasic");
    expect(result.exempt).toBe(16000);
    expect(result.taxable).toBe(4000);
  });

  it("treats Bengaluru as a metro only from FY 2026-27", () => {
    const input = { basic: 60000, hraReceived: 30000, rentPaid: 40000, city: "bengaluru" as const };
    expect(calculateHraExemption({ ...input, taxYear: "2025-26" }).exempt).toBe(24000);
    expect(calculateHraExemption({ ...input, taxYear: "2026-27" }).exempt).toBe(30000);
  });

  it("is capped at the HRA actually received", () => {
    const result = calculateHraExemption({
      basic: 100000,
      hraReceived: 10000,
      rentPaid: 50000,
      city: "delhi",
      taxYear: "2026-27",
    });
    expect(result.least).toBe("actualHra");
    expect(result.exempt).toBe(10000);
    expect(result.taxable).toBe(0);
  });

  it("gives nothing when the rent is no more than 10% of basic", () => {
    const result = calculateHraExemption({
      basic: 50000,
      hraReceived: 20000,
      rentPaid: 4000,
      city: "chennai",
      taxYear: "2026-27",
    });
    expect(result.limits.rentOverTenPercent).toBe(0);
    expect(result.exempt).toBe(0);
    expect(result.taxable).toBe(20000);
  });

  it("works the same for yearly amounts", () => {
    const monthly = calculateHraExemption({
      basic: 50000,
      hraReceived: 25000,
      rentPaid: 20000,
      city: "pune",
      taxYear: "2026-27",
    });
    const yearly = calculateHraExemption({
      basic: 600000,
      hraReceived: 300000,
      rentPaid: 240000,
      city: "pune",
      taxYear: "2026-27",
    });
    expect(yearly.exempt).toBe(monthly.exempt * 12);
  });

  it("ignores negative amounts", () => {
    const result = calculateHraExemption({
      basic: -1,
      hraReceived: -1,
      rentPaid: -1,
      city: "",
      taxYear: "2026-27",
    });
    expect(result.exempt).toBe(0);
    expect(result.taxable).toBe(0);
  });
});
