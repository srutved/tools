import { describe, expect, it } from "vitest";
import { rentFromQuery } from "./handoff";

const query = (text: string) => new URLSearchParams(text);

describe("rentFromQuery", () => {
  it("reads the monthly rent", () => {
    expect(rentFromQuery(query("rent=25000"))).toBe(25000);
    expect(rentFromQuery(query("rent=18500.456"))).toBe(18500.46);
  });

  it("ignores a missing, zero, negative or invalid rent", () => {
    expect(rentFromQuery(query(""))).toBeUndefined();
    expect(rentFromQuery(query("rent=0"))).toBeUndefined();
    expect(rentFromQuery(query("rent=-100"))).toBeUndefined();
    expect(rentFromQuery(query("rent=abc"))).toBeUndefined();
  });
});
