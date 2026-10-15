import { addDaysIso, daysBetween, todayIso } from "@/lib/date";
import { createId, roundTo } from "@/lib/utils";
import type { BusinessProfile } from "@/shared/business-profile";
import type { HrLetter, LetterKind } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const createBreakdownRow = (label = "", monthly = 0) => ({ id: createId(), label, monthly });
export const createCustomTerm = () => ({ id: createId(), title: "", text: "" });

/**
 * A typical Indian salary structure from an annual CTC: basic 50%, HRA half of basic, the
 * employer's PF at the ₹1,800 ceiling, and a special allowance for the rest. Monthly amounts.
 */
export function breakdownFromCtc(annualCtc: number) {
  const monthly = annualCtc / 12;
  const basic = roundTo(monthly * 0.5, 0);
  const hra = roundTo(basic * 0.5, 0);
  const pf = Math.min(1800, roundTo(basic * 0.12, 0));
  const special = Math.max(roundTo(monthly - basic - hra - pf, 0), 0);
  return [
    createBreakdownRow("Basic salary", basic),
    createBreakdownRow("House rent allowance (HRA)", hra),
    createBreakdownRow("Special allowance", special),
    createBreakdownRow("Employer's PF contribution", pf),
  ];
}

interface NewLetterOptions {
  kind?: LetterKind;
  /** The user's saved business details fill in the letterhead. */
  profile?: BusinessProfile | null;
  currency?: string;
  templateId?: string;
}

/** A blank letter with sensible defaults for the terms. */
export function createHrLetter({
  kind = "offer",
  profile,
  currency = "INR",
  templateId = DEFAULT_TEMPLATE_ID,
}: NewLetterOptions = {}): HrLetter {
  const business = profile?.business;
  const today = todayIso();
  return {
    kind,
    templateId,
    letterDate: today,
    reference: "",
    company: {
      name: business?.name ?? "",
      address: business?.address ?? "",
      email: business?.email ?? "",
      phone: business?.phone ?? "",
      website: "",
      logo: profile?.logo ?? "",
    },
    signatory: { name: "", title: "", signature: "" },
    employee: { name: "", address: "", employeeId: "", pronoun: "they" },
    designation: "",
    department: "",
    employmentType: "full-time",
    location: "",
    reportingTo: "",
    workingHours: "",
    joiningDate: kind === "offer" || kind === "appointment" ? addDaysIso(today, 30) : "",
    endDate: kind === "relieving" ? today : "",
    resignationDate: "",
    offerValidUntil: kind === "offer" ? addDaysIso(today, 7) : "",
    effectiveDate: kind === "increment" ? today : "",
    currency,
    pay: 0,
    previousPay: 0,
    newDesignation: "",
    salaryBreakdown: [],
    probationMonths: 6,
    noticeDays: 30,
    remarks: "",
    customTerms: [],
  };
}

/** A copy with fresh list ids, e.g. when duplicating a letter or opening an example. */
export function withFreshIds(letter: HrLetter): HrLetter {
  const fresh = <T extends { id: string }>(items: T[]) => items.map((item) => ({ ...item, id: createId() }));
  return {
    ...letter,
    salaryBreakdown: fresh(letter.salaryBreakdown),
    customTerms: fresh(letter.customTerms),
  };
}

/**
 * Makes a landing-page example the user's own: dated today with its timeline moved to match, and
 * the user's saved business details on the letterhead when they have them.
 */
export function fromLetterExample(example: HrLetter, profile?: BusinessProfile | null): HrLetter {
  const today = todayIso();
  const offset = daysBetween(example.letterDate, today);
  const shift = (date: string) => (date ? addDaysIso(date, offset) : "");
  const business = profile?.business;
  return {
    ...withFreshIds(example),
    letterDate: today,
    joiningDate: shift(example.joiningDate),
    endDate: shift(example.endDate),
    resignationDate: shift(example.resignationDate),
    offerValidUntil: shift(example.offerValidUntil),
    effectiveDate: shift(example.effectiveDate),
    company: business?.name.trim()
      ? {
          ...example.company,
          name: business.name,
          address: business.address,
          email: business.email,
          phone: business.phone,
          website: "",
          logo: profile?.logo ?? "",
        }
      : example.company,
  };
}
