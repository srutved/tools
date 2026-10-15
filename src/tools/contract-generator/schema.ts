import { z } from "zod";

/**
 * - service: a freelance or service agreement between a provider and a client
 * - nda:     a non-disclosure agreement, one-way or mutual
 * - sow:     a statement of work for one project
 */
export const CONTRACT_KINDS = ["service", "nda", "sow"] as const;
export type ContractKind = (typeof CONTRACT_KINDS)[number];

export const contractPartySchema = z.object({
  /** Person or company name. */
  name: z.string().max(120),
  address: z.string().max(300),
  email: z.string().max(120),
  /** Who signs for a company, e.g. "Anita Rao". Blank when an individual signs for themselves. */
  signatory: z.string().max(80),
  /** e.g. "Director". */
  signatoryTitle: z.string().max(80),
});

export type ContractParty = z.infer<typeof contractPartySchema>;

const listItem = z.object({ id: z.string(), description: z.string().max(300), date: z.string().max(40) });

export const PAYMENT_STRUCTURES = ["fixed", "hourly", "milestones"] as const;

export const paymentTermsSchema = z.object({
  currency: z.string().length(3),
  structure: z.enum(PAYMENT_STRUCTURES),
  /** Fixed fee, or hourly rate. */
  amount: z.number().min(0),
  /** Hourly only: hours that may be billed without further approval (0 = no cap). */
  hoursCap: z.number().min(0),
  milestones: z.array(
    z.object({ id: z.string(), description: z.string().max(200), amount: z.number().min(0) }),
  ),
  /** Days the client has to pay each invoice. */
  dueDays: z.number().int().min(0).max(365),
  /** Interest on late payments, % per month (0 = none). */
  lateFeePercent: z.number().min(0).max(10),
});

export type PaymentTerms = z.infer<typeof paymentTermsSchema>;

/** Shape of a saved contract. Lenient on purpose: drafts are allowed to be incomplete. */
export const contractSchema = z.object({
  kind: z.enum(CONTRACT_KINDS),
  templateId: z.string(),
  /** Custom title; blank uses the standard one for the kind. */
  title: z.string().max(120),
  /** "YYYY-MM-DD". */
  effectiveDate: z.string(),
  /** The user: service provider, or the disclosing party / first party of an NDA. */
  you: contractPartySchema,
  /** The client, or the receiving party / second party of an NDA. */
  other: contractPartySchema,

  // Services and statements of work
  projectName: z.string().max(120),
  overview: z.string().max(2000),
  /** One service or task per line. */
  scope: z.string().max(4000),
  deliverables: z.array(listItem),
  /** Statement of work: one item per line. */
  outOfScope: z.string().max(2000),
  assumptions: z.string().max(2000),
  acceptanceCriteria: z.string().max(2000),
  /** Statement of work: the master agreement it falls under, if any. */
  masterAgreement: z.string().max(200),
  startDate: z.string(),
  /** Blank: until the services are completed. */
  endDate: z.string(),
  payment: paymentTermsSchema,
  revisions: z.number().int().min(0).max(20),
  /** Who owns the work: assigned to the client on full payment, or licensed to them. */
  ipOwnership: z.enum(["assign-on-payment", "licence"]),
  portfolioUse: z.boolean(),

  // NDA
  ndaType: z.enum(["one-way", "mutual"]),
  /** Why information is being shared, e.g. "evaluating a potential partnership". */
  purpose: z.string().max(300),

  // Common terms
  /** Years confidentiality lasts after the agreement ends (or after each disclosure, for NDAs). */
  confidentialityYears: z.number().int().min(0).max(20),
  noticeDays: z.number().int().min(0).max(365),
  /** e.g. "the laws of India". */
  governingLaw: z.string().max(120),
  /** City for courts or arbitration, e.g. "Bengaluru, Karnataka". */
  jurisdiction: z.string().max(120),
  disputes: z.enum(["courts", "arbitration"]),
  limitLiability: z.boolean(),
  nonSolicitation: z.boolean(),
  /** Extra clauses the user writes themselves. */
  customClauses: z.array(
    z.object({ id: z.string(), title: z.string().max(120), text: z.string().max(3000) }),
  ),
});

export type Contract = z.infer<typeof contractSchema>;

const required = (message: string) => z.string().trim().min(1, message);

/** Stricter rules applied before a contract is downloaded or printed. */
export const contractExportSchema = contractSchema
  .extend({
    effectiveDate: required("Add the date the agreement starts"),
    you: contractPartySchema.extend({ name: required("Add your name or company") }),
    other: contractPartySchema.extend({ name: required("Add the other party's name") }),
    governingLaw: required("Add the governing law, e.g. the laws of India"),
    jurisdiction: required("Add a city for disputes, e.g. Mumbai"),
  })
  .superRefine((contract, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    if (contract.kind === "nda") {
      if (!contract.purpose.trim()) issue(["purpose"], "Say why information is being shared");
      return;
    }
    if (!contract.scope.trim()) issue(["scope"], "Describe the work");
    if (contract.kind === "sow" && !contract.projectName.trim()) issue(["projectName"], "Name the project");
    const { payment } = contract;
    if (payment.structure === "milestones") {
      if (!payment.milestones.some((milestone) => milestone.description.trim())) {
        issue(["payment", "milestones"], "Add at least one milestone");
      }
      payment.milestones.forEach((milestone, index) => {
        if (milestone.amount > 0 && !milestone.description.trim()) {
          issue(["payment", "milestones", index, "description"], "Describe this milestone");
        }
      });
    } else if (!(payment.amount > 0)) {
      issue(["payment", "amount"], payment.structure === "hourly" ? "Add your hourly rate" : "Add the fee");
    }
  });
