/**
 * Assembles a contract from the user's answers: title, preamble, numbered clauses and signature
 * blocks. Pure and tolerant of half-filled forms, so the preview can update on every keystroke.
 *
 * The wording is plain English and balanced between the parties. It is a starting point, not legal
 * advice - the tool says so to the user, and recommends a lawyer for important agreements.
 */

import { formatMoney } from "@/lib/currency";
import { formatLongDate } from "@/lib/date";
import { toBullets } from "@/lib/text";
import type { Contract, ContractKind, ContractParty } from "../schema";

export type ClauseBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  /** Two columns, e.g. milestone and amount, or deliverable and due date. */
  | { type: "table"; rows: [string, string][] };

export interface PreparedClause {
  number: number;
  heading: string;
  blocks: ClauseBlock[];
}

export interface SignatureBlock {
  /** e.g. "Client". */
  role: string;
  name: string;
  /** The person signing, when it differs from the party (a company). */
  signatory: string;
  signatoryTitle: string;
}

export interface PreparedContract {
  title: string;
  /** Shown under the title, e.g. the project of a statement of work. */
  subtitle: string;
  preamble: string;
  clauses: PreparedClause[];
  signatures: SignatureBlock[];
}

export const DEFAULT_TITLES: Record<ContractKind, string> = {
  service: "Service Agreement",
  nda: "Non-Disclosure Agreement",
  sow: "Statement of Work",
};

export function defaultTitle(contract: Pick<Contract, "kind" | "ndaType">): string {
  if (contract.kind === "nda" && contract.ndaType === "mutual") return "Mutual Non-Disclosure Agreement";
  return DEFAULT_TITLES[contract.kind];
}

/** What each party is called in the contract. */
export function partyRoles(contract: Pick<Contract, "kind" | "ndaType">): { you: string; other: string } {
  if (contract.kind !== "nda") return { you: "Service Provider", other: "Client" };
  return contract.ndaType === "mutual"
    ? { you: "Party", other: "Party" }
    : { you: "Disclosing Party", other: "Receiving Party" };
}

const text = (value: string | undefined) => (value ?? "").trim();
const oneLine = (value: string) =>
  text(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ");
const p = (value: string): ClauseBlock => ({ type: "text", text: value });
const list = (items: string[]): ClauseBlock => ({ type: "list", items });

/** "Acme Pvt Ltd, of 12 MG Road, Bengaluru (the “Client”)". */
function describeParty(party: Partial<ContractParty>, role: string | null): string {
  const name = text(party.name) || `[${role ?? "Party"} name]`;
  const address = oneLine(party.address ?? "");
  return `${name}${address ? `, of ${address}` : ""}${role ? ` (the “${role}”)` : ""}`;
}

/* ---------------------------------------------------------------- Shared clauses */

function paymentClause(contract: Contract): ClauseBlock[] {
  const { payment } = contract;
  const money = (amount: number) => formatMoney(amount || 0, payment.currency);
  const blocks: ClauseBlock[] = [];
  if (payment.structure === "fixed") {
    blocks.push(
      p(`The Client will pay the Service Provider a fixed fee of ${money(payment.amount)} for the Services.`),
    );
  } else if (payment.structure === "hourly") {
    const cap =
      payment.hoursCap > 0
        ? ` The Service Provider will not bill more than ${payment.hoursCap} hours without the Client's prior written approval.`
        : "";
    blocks.push(
      p(
        `The Client will pay the Service Provider ${money(payment.amount)} per hour for time spent on the Services, invoiced monthly with a summary of hours worked.${cap}`,
      ),
    );
  } else {
    const milestones = payment.milestones.filter((milestone) => text(milestone.description));
    const total = milestones.reduce((sum, milestone) => sum + (milestone.amount || 0), 0);
    blocks.push(p(`The Client will pay the Service Provider ${money(total)} in the following instalments:`));
    blocks.push({
      type: "table",
      rows: milestones.map((milestone) => [text(milestone.description), money(milestone.amount)]),
    });
  }
  const late =
    payment.lateFeePercent > 0
      ? ` Overdue amounts bear interest at ${payment.lateFeePercent}% per month until paid.`
      : "";
  blocks.push(
    p(
      `Invoices are payable within ${payment.dueDays} days of receipt.${late} Fees are exclusive of applicable taxes such as GST or VAT, which the Client will pay in addition where they apply.`,
    ),
  );
  blocks.push(p("Expenses are reimbursed only if the Client approves them in writing in advance."));
  return blocks;
}

function ipClause(contract: Contract): ClauseBlock[] {
  const blocks =
    contract.ipOwnership === "assign-on-payment"
      ? [
          p(
            "On receiving full payment, the Service Provider assigns to the Client all intellectual property rights in the final deliverables created specifically for the Client under this Agreement.",
          ),
          p(
            "The Service Provider keeps ownership of its pre-existing materials, tools, templates and know-how. Where any of these form part of the deliverables, the Service Provider grants the Client a non-exclusive, perpetual, royalty-free licence to use them as part of the deliverables.",
          ),
        ]
      : [
          p(
            "The Service Provider keeps ownership of all intellectual property in the deliverables. On receiving full payment, the Service Provider grants the Client a non-exclusive, perpetual, royalty-free licence to use the final deliverables for the Client's business.",
          ),
        ];
  if (contract.portfolioUse) {
    blocks.push(
      p(
        "The Service Provider may show the work in its portfolio and marketing, without disclosing the Client's confidential information, unless the Client objects in writing.",
      ),
    );
  }
  return blocks;
}

function confidentialityClause(contract: Contract): ClauseBlock[] {
  return [
    p(
      "Each Party will keep the other Party's confidential information private and use it only to perform this Agreement. This does not apply to information that is or becomes public through no fault of the receiving Party, was already known to it, is independently developed, or must be disclosed by law.",
    ),
    p(`This obligation continues for ${contract.confidentialityYears} years after this Agreement ends.`),
  ];
}

function terminationClause(contract: Contract): ClauseBlock[] {
  return [
    p(
      `Either Party may end this Agreement by giving ${contract.noticeDays} days' written notice. Either Party may end it immediately by written notice if the other Party materially breaches it and does not remedy the breach within 7 days of being asked to.`,
    ),
    p(
      "On termination, the Client will pay for the Services performed up to the termination date, and each Party will return or delete the other's confidential information. Clauses that by their nature should survive termination - including payment, intellectual property, confidentiality and liability - continue to apply.",
    ),
  ];
}

function liabilityClause(): ClauseBlock[] {
  return [
    p(
      "Neither Party is liable for indirect, incidental or consequential losses, or for loss of profit or data. Each Party's total liability under this Agreement is limited to the total fees paid or payable under it. These limits do not apply to breach of confidentiality, fraud, or wilful misconduct.",
    ),
  ];
}

function disputesClause(contract: Contract): ClauseBlock[] {
  const law = text(contract.governingLaw) || "[governing law]";
  const place = text(contract.jurisdiction) || "[city]";
  const resolution =
    contract.disputes === "arbitration"
      ? `If a dispute is not resolved within 30 days, it will be referred to arbitration by a sole arbitrator appointed by agreement of the Parties. The seat of arbitration will be ${place}, the proceedings will be in English, and the award will be final and binding.`
      : `If a dispute is not resolved within 30 days, the courts at ${place} will have exclusive jurisdiction.`;
  return [
    p(
      `This Agreement is governed by ${law}. The Parties will first try to resolve any dispute through good-faith discussion. ${resolution}`,
    ),
  ];
}

function generalClause(): ClauseBlock[] {
  return [
    list([
      "Entire agreement: this Agreement is the whole agreement between the Parties about its subject and replaces any earlier discussions or agreements on it.",
      "Changes: any change to this Agreement must be agreed in writing by both Parties. Email is sufficient.",
      "Notices: notices may be sent by email to the addresses the Parties use for this engagement, or delivered to the addresses above.",
      "Assignment: neither Party may transfer this Agreement without the other's written consent.",
      "Severability: if any part of this Agreement is found unenforceable, the rest continues in effect.",
      "Signatures: this Agreement may be signed electronically and in counterparts, each of which is an original.",
    ]),
  ];
}

/* ---------------------------------------------------------------- Kind-specific clauses */

type Clause = [heading: string, blocks: ClauseBlock[]];

function servicesClauses(contract: Contract): Clause[] {
  const scope = toBullets(contract.scope ?? "");
  const deliverables = (contract.deliverables ?? []).filter((item) => text(item.description));
  const blocks: ClauseBlock[] = [
    p("The Service Provider will provide the following services (the “Services”):"),
  ];
  blocks.push(list(scope.length ? scope : ["[Describe the services]"]));
  if (deliverables.length) {
    blocks.push(p("The Service Provider will deliver the following by the dates shown:"));
    blocks.push({
      type: "table",
      rows: deliverables.map((item) => [text(item.description), text(item.date) || "To be agreed"]),
    });
  }
  return [["Services", blocks]];
}

function termClause(contract: Contract): Clause {
  const start = contract.startDate ? formatLongDate(contract.startDate) : "the date of this Agreement";
  const end = contract.endDate
    ? `until ${formatLongDate(contract.endDate)}`
    : "until the Services are completed";
  return [
    "Term",
    [
      p(
        `This Agreement starts on ${start} and continues ${end}, unless it is ended earlier under the Termination clause.`,
      ),
    ],
  ];
}

function workingTogetherClauses(contract: Contract): Clause[] {
  const revisions =
    contract.revisions > 0
      ? `The fees include ${contract.revisions} round${contract.revisions === 1 ? "" : "s"} of revisions to each deliverable. Further changes will be quoted separately.`
      : "Changes after a deliverable is approved will be quoted separately.";
  return [
    [
      "Revisions and acceptance",
      [
        p(revisions),
        p(
          "The Client will review each deliverable and raise any issues within 7 days of delivery. A deliverable is treated as accepted if no specific issues are raised in that time.",
        ),
      ],
    ],
    [
      "Changes to the work",
      [
        p(
          "Either Party may request changes to the Services. A change takes effect only when both Parties agree it in writing, including any change to fees or timelines.",
        ),
      ],
    ],
    [
      "Client responsibilities",
      [
        p(
          "The Client will provide the information, content, access and feedback reasonably needed for the Services, on time. Timelines may be extended by any delay caused by the Client.",
        ),
      ],
    ],
  ];
}

function independentContractorClause(): Clause {
  return [
    "Independent contractor",
    [
      p(
        "The Service Provider is an independent contractor, not an employee, partner or agent of the Client, and is responsible for its own taxes and statutory contributions. The Service Provider decides how to perform the Services and may work for other clients.",
      ),
    ],
  ];
}

function nonSolicitationClause(): Clause {
  return [
    "Non-solicitation",
    [
      p(
        "During this Agreement and for 12 months after it ends, neither Party will directly solicit any employee or contractor of the other Party who was involved in the Services to work for it, without the other Party's written consent. General job advertisements are not solicitation.",
      ),
    ],
  ];
}

function closingClauses(contract: Contract): Clause[] {
  const clauses: Clause[] = [];
  if (contract.limitLiability) clauses.push(["Limitation of liability", liabilityClause()]);
  if (contract.nonSolicitation) clauses.push(nonSolicitationClause());
  for (const custom of contract.customClauses ?? []) {
    if (text(custom.title) || text(custom.text)) {
      clauses.push([text(custom.title) || "Additional terms", toParagraphBlocks(custom.text)]);
    }
  }
  clauses.push(["Governing law and disputes", disputesClause(contract)]);
  clauses.push(["General", generalClause()]);
  return clauses;
}

const toParagraphBlocks = (value: string): ClauseBlock[] =>
  text(value)
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(p);

function serviceAgreement(contract: Contract): Clause[] {
  return [
    ...servicesClauses(contract),
    termClause(contract),
    ["Fees and payment", paymentClause(contract)],
    ...workingTogetherClauses(contract),
    ["Intellectual property", ipClause(contract)],
    ["Confidentiality", confidentialityClause(contract)],
    independentContractorClause(),
    ["Termination", terminationClause(contract)],
    ...closingClauses(contract),
  ];
}

function statementOfWork(contract: Contract): Clause[] {
  const listOrNothing = (heading: string, value: string, intro: string): Clause[] => {
    const items = toBullets(value ?? "");
    return items.length ? [[heading, [p(intro), list(items)]]] : [];
  };
  const overview = toParagraphBlocks(contract.overview);
  const acceptance = toBullets(contract.acceptanceCriteria ?? "");
  const master = text(contract.masterAgreement);

  const clauses: Clause[] = [
    ...(overview.length ? [["Project overview", overview] as Clause] : []),
    ...servicesClauses(contract).map(([, blocks]): Clause => ["Scope of work", blocks]),
    ...listOrNothing(
      "Out of scope",
      contract.outOfScope,
      "The following are not included in this Statement of Work:",
    ),
    ...listOrNothing("Assumptions", contract.assumptions, "This Statement of Work assumes that:"),
    termClause(contract),
    ["Fees and payment", paymentClause(contract)],
    [
      "Acceptance",
      [
        p(
          "The Client will review each deliverable within 7 days of delivery and either accept it or describe specifically how it does not meet the acceptance criteria. A deliverable is treated as accepted if no such issues are raised in that time.",
        ),
        ...(acceptance.length ? [p("Acceptance criteria:"), list(acceptance)] : []),
      ],
    ],
    [
      "Change requests",
      [
        p(
          "Changes to the scope, deliverables or timeline must be agreed in writing by both Parties before work on them starts, including any change to fees.",
        ),
      ],
    ],
  ];

  if (master) {
    // Under a master agreement, its terms (IP, confidentiality, liability...) already apply.
    clauses.push([
      "Relationship to the master agreement",
      [
        p(
          `This Statement of Work is entered into under ${master} between the Parties, whose terms apply to it. If there is a conflict, this Statement of Work prevails for this project only.`,
        ),
      ],
    ]);
    return clauses;
  }
  return [
    ...clauses,
    ["Intellectual property", ipClause(contract)],
    ["Confidentiality", confidentialityClause(contract)],
    independentContractorClause(),
    ["Termination", terminationClause(contract)],
    ...closingClauses(contract),
  ];
}

function nonDisclosureAgreement(contract: Contract): Clause[] {
  const mutual = contract.ndaType === "mutual";
  const purpose = text(contract.purpose) || "[purpose]";
  const discloser = mutual ? "a Party (the “Disclosing Party”)" : "the Disclosing Party";
  const recipient = mutual ? "the other Party (the “Receiving Party”)" : "the Receiving Party";

  const clauses: Clause[] = [
    [
      "Purpose",
      [
        p(
          `The Parties wish to share confidential information for the purpose of ${purpose} (the “Purpose”).${
            mutual ? " Each Party may disclose information to the other." : ""
          }`,
        ),
      ],
    ],
    [
      "Confidential information",
      [
        p(
          `“Confidential Information” means any non-public information disclosed by ${discloser} to ${recipient}, in any form, that is marked confidential or that a reasonable person would understand to be confidential. It includes business plans, financial information, customer and supplier details, product designs, software, data and know-how.`,
        ),
      ],
    ],
    [
      "Obligations",
      [
        p("The Receiving Party will:"),
        list([
          "keep the Confidential Information confidential and protect it with at least reasonable care",
          "use it only for the Purpose",
          "share it only with its employees, contractors and professional advisers who need to know it for the Purpose and are bound by confidentiality duties at least as strict as these",
          "not copy, reverse engineer or decompile it, except as needed for the Purpose",
          "tell the Disclosing Party promptly if it becomes aware of any unauthorised use or disclosure",
        ]),
      ],
    ],
    [
      "Exclusions",
      [
        p("These obligations do not apply to information that:"),
        list([
          "is or becomes public through no fault of the Receiving Party",
          "the Receiving Party already lawfully knew before receiving it",
          "the Receiving Party receives lawfully from a third party without a duty of confidentiality",
          "the Receiving Party develops independently without using the Confidential Information",
        ]),
      ],
    ],
    [
      "Required disclosure",
      [
        p(
          "The Receiving Party may disclose Confidential Information if required by law, regulation or court order, provided that, where lawful, it gives the Disclosing Party prompt notice and discloses only what is required.",
        ),
      ],
    ],
    [
      "Return or destruction",
      [
        p(
          "On the Disclosing Party's request, or when the Purpose ends, the Receiving Party will return or destroy the Confidential Information, except copies it must keep by law or in routine backups, which remain subject to this Agreement.",
        ),
      ],
    ],
    [
      "No licence or obligation",
      [
        p(
          "All Confidential Information remains the property of the Disclosing Party and is provided “as is”. This Agreement does not grant any licence or other rights in it, and does not oblige either Party to enter into any further agreement or transaction.",
        ),
      ],
    ],
    [
      "Duration",
      [
        p(
          `The obligations in this Agreement last for ${contract.confidentialityYears} years from the date of each disclosure. Trade secrets remain protected for as long as they remain trade secrets under applicable law.`,
        ),
      ],
    ],
    [
      "Remedies",
      [
        p(
          "Unauthorised use or disclosure may cause harm for which damages alone are not an adequate remedy, so the Disclosing Party may seek an injunction or other equitable relief in addition to any other remedy available.",
        ),
      ],
    ],
  ];
  if (contract.nonSolicitation) clauses.push(nonSolicitationClause());
  for (const custom of contract.customClauses ?? []) {
    if (text(custom.title) || text(custom.text)) {
      clauses.push([text(custom.title) || "Additional terms", toParagraphBlocks(custom.text)]);
    }
  }
  clauses.push(["Governing law and disputes", disputesClause(contract)]);
  clauses.push(["General", generalClause()]);
  return clauses;
}

/* ---------------------------------------------------------------- Assembly */

export function prepareContract(contract: Contract): PreparedContract {
  const roles = partyRoles(contract);
  const mutual = contract.kind === "nda" && contract.ndaType === "mutual";
  const title = text(contract.title) || defaultTitle(contract);
  const date = contract.effectiveDate ? formatLongDate(contract.effectiveDate) : "[date]";

  const you = contract.you ?? ({} as Partial<ContractParty>);
  const other = contract.other ?? ({} as Partial<ContractParty>);
  // Clients come first in service agreements; in NDAs the disclosing party (the user) does.
  const [first, second] =
    contract.kind === "nda"
      ? [describeParty(you, mutual ? null : roles.you), describeParty(other, mutual ? null : roles.other)]
      : [describeParty(other, roles.other), describeParty(you, roles.you)];
  const together = mutual
    ? ` (each a “Party” and together the “Parties”)`
    : ", each a “Party” and together the “Parties”";
  const preamble = `This ${title} (the “Agreement”) is made on ${date} between ${first} and ${second}${together}.`;

  const build = { service: serviceAgreement, nda: nonDisclosureAgreement, sow: statementOfWork }[
    contract.kind
  ];
  const clauses = build(contract).map(([heading, blocks], index) => ({ number: index + 1, heading, blocks }));

  const signature = (party: Partial<ContractParty>, role: string): SignatureBlock => ({
    role,
    name: text(party.name),
    signatory: text(party.signatory),
    signatoryTitle: text(party.signatoryTitle),
  });

  return {
    title,
    subtitle: contract.kind === "sow" ? text(contract.projectName) : "",
    preamble,
    clauses,
    signatures:
      contract.kind === "nda"
        ? [signature(you, mutual ? "Party" : roles.you), signature(other, mutual ? "Party" : roles.other)]
        : [signature(other, roles.other), signature(you, roles.you)],
  };
}
