import { addDaysIso, daysBetween, todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import type { BusinessProfile } from "@/shared/business-profile";
import type { Contract, ContractKind, ContractParty } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const EMPTY_CONTRACT_PARTY: ContractParty = {
  name: "",
  address: "",
  email: "",
  signatory: "",
  signatoryTitle: "",
};

export const createMilestone = () => ({ id: createId(), description: "", amount: 0 });
export const createDeliverable = () => ({ id: createId(), description: "", date: "" });
export const createCustomClause = () => ({ id: createId(), title: "", text: "" });

interface NewContractOptions {
  kind?: ContractKind;
  /** The user's saved business details fill in their side of the contract. */
  profile?: BusinessProfile | null;
  currency: string;
  templateId?: string;
}

/** A blank contract of the given kind, with sensible, balanced defaults for every term. */
export function createContract({
  kind = "service",
  profile,
  currency,
  templateId,
}: NewContractOptions): Contract {
  const business = profile?.business;
  return {
    kind,
    templateId: templateId ?? DEFAULT_TEMPLATE_ID,
    title: "",
    effectiveDate: todayIso(),
    you: business
      ? { ...EMPTY_CONTRACT_PARTY, name: business.name, address: business.address, email: business.email }
      : EMPTY_CONTRACT_PARTY,
    other: EMPTY_CONTRACT_PARTY,
    projectName: "",
    overview: "",
    scope: "",
    deliverables: [],
    outOfScope: "",
    assumptions: "",
    acceptanceCriteria: "",
    masterAgreement: "",
    startDate: todayIso(),
    endDate: "",
    payment: {
      currency,
      structure: "fixed",
      amount: 0,
      hoursCap: 0,
      milestones: [createMilestone()],
      dueDays: 15,
      lateFeePercent: 0,
    },
    revisions: 2,
    ipOwnership: "assign-on-payment",
    portfolioUse: true,
    ndaType: "one-way",
    purpose: "",
    confidentialityYears: 3,
    noticeDays: 15,
    governingLaw: currency === "INR" ? "the laws of India" : "",
    jurisdiction: "",
    disputes: "courts",
    limitLiability: true,
    nonSolicitation: false,
    customClauses: [],
  };
}

/** A copy with fresh list ids, e.g. when duplicating a contract or opening an example. */
export function withFreshIds(contract: Contract): Contract {
  const fresh = <T extends { id: string }>(items: T[]) => items.map((item) => ({ ...item, id: createId() }));
  return {
    ...contract,
    deliverables: fresh(contract.deliverables),
    payment: { ...contract.payment, milestones: fresh(contract.payment.milestones) },
    customClauses: fresh(contract.customClauses),
  };
}

/**
 * Makes a landing-page example the user's own: their saved business details as their side of the
 * contract, and the example's dates moved so it starts today and keeps the same timeline.
 */
export function fromContractExample(example: Contract, profile?: BusinessProfile | null): Contract {
  const today = todayIso();
  const shift = (date: string) => (date ? addDaysIso(date, daysBetween(example.startDate, today)) : "");
  const business = profile?.business;
  return {
    ...withFreshIds(example),
    effectiveDate: today,
    startDate: today,
    endDate: shift(example.endDate),
    you: business?.name.trim()
      ? { ...EMPTY_CONTRACT_PARTY, name: business.name, address: business.address, email: business.email }
      : example.you,
  };
}
