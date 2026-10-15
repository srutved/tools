/**
 * Writes an HR letter from the form: letterhead, recipient, subject, paragraphs, numbered terms,
 * sign-off, an acceptance block and a salary annexure, depending on the kind of letter. Pure and
 * tolerant of half-filled forms, so the preview can update on every keystroke.
 *
 * The wording is the plain, formal English Indian employers use. It refers to the employee by name
 * and by the pronoun chosen (they by default).
 */

import { amountInWords } from "@/lib/amount-in-words";
import { formatMoney } from "@/lib/currency";
import { formatLongDate } from "@/lib/date";
import { roundTo, toFiniteNumber } from "@/lib/utils";
import type { HrLetter, LetterKind, Pronoun } from "../schema";

export type LetterBlock =
  | { type: "paragraph"; text: string }
  /** A numbered term of employment. */
  | { type: "term"; number: number; heading: string; text: string };

export interface PreparedLetter {
  title: string;
  /** Contact lines: email, phone and website, each only if given. */
  company: { name: string; address: string; contact: string[]; logo: string };
  reference: string;
  date: string;
  /** Name and address lines; empty for letters addressed to whom it may concern. */
  recipient: string[];
  subject: string;
  salutation: string;
  blocks: LetterBlock[];
  signoff: { company: string; name: string; title: string; signature: string };
  /** For the employee to sign and return. */
  acceptance: { heading: string; text: string; name: string } | null;
  annexure: { title: string; rows: [string, string, string][]; total: [string, string] } | null;
}

export const KIND_LABELS: Record<LetterKind, string> = {
  offer: "Offer letter",
  appointment: "Appointment letter",
  experience: "Experience letter",
  relieving: "Relieving letter",
  increment: "Increment letter",
};

/** The letter's title, which also tells internship and promotion letters apart. */
export function letterTitle(letter: Pick<HrLetter, "kind" | "employmentType" | "newDesignation">): string {
  const internship = letter.employmentType === "internship";
  switch (letter.kind) {
    case "offer":
      return internship ? "Internship Offer Letter" : "Offer Letter";
    case "appointment":
      return "Appointment Letter";
    case "experience":
      return internship ? "Internship Certificate" : "Experience Certificate";
    case "relieving":
      return "Relieving Letter";
    case "increment":
      return letter.newDesignation.trim() ? "Promotion Letter" : "Increment Letter";
  }
}

const PRONOUN_FORMS: Record<Pronoun, { object: string; possessive: string }> = {
  they: { object: "them", possessive: "their" },
  she: { object: "her", possessive: "her" },
  he: { object: "him", possessive: "his" },
};

const text = (value: string | undefined) => (value ?? "").trim();
const oneLine = (value: string) =>
  text(value)
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/,$/, ""))
    .filter(Boolean)
    .join(", ");
const lines = (value: string) =>
  text(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
const date = (iso: string, fallback: string) => (iso ? formatLongDate(iso) : `[${fallback}]`);
const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** "full-time" → "on a full-time basis"; nothing for the usual case of an internship. */
const BASIS: Record<HrLetter["employmentType"], string> = {
  "full-time": " on a full-time basis",
  "part-time": " on a part-time basis",
  internship: "",
  contract: " on a fixed-term contract",
};

export function prepareLetter(letter: HrLetter): PreparedLetter {
  const { kind, company, employee } = letter;
  const internship = letter.employmentType === "internship";
  const companyName = text(company.name) || "[Company name]";
  const name = text(employee.name) || "[Employee name]";
  const firstName = name.startsWith("[") ? name : name.split(/\s+/)[0];
  const forms = PRONOUN_FORMS[employee.pronoun] ?? PRONOUN_FORMS.they;
  const designation = text(letter.designation) || "[Designation]";
  const department = text(letter.department);
  const money = (amount: number) => formatMoney(toFiniteNumber(amount), letter.currency);
  const inWords = (amount: number) => amountInWords(toFiniteNumber(amount), letter.currency);
  const pay = toFiniteNumber(letter.pay);

  const blocks: LetterBlock[] = [];
  const paragraph = (value: string) => blocks.push({ type: "paragraph", text: value });
  let termNumber = 0;
  const term = (heading: string, value: string) =>
    blocks.push({ type: "term", number: ++termNumber, heading, text: value });
  const customTerms = () =>
    letter.customTerms
      .filter((custom) => text(custom.text))
      .forEach((custom) =>
        text(custom.title) ? term(text(custom.title), text(custom.text)) : paragraph(text(custom.text)),
      );

  const breakdown = letter.salaryBreakdown.filter(
    (row) => text(row.label) || toFiniteNumber(row.monthly) > 0,
  );
  const hasAnnexure =
    (kind === "offer" || kind === "appointment" || kind === "increment") && breakdown.length > 0;
  const annexureNote = hasAnnexure ? " The salary breakdown is set out in Annexure A." : "";

  let subject = "";
  let salutation = `Dear ${firstName},`;
  let recipient = [name, ...lines(employee.address)];
  let acceptance: PreparedLetter["acceptance"] = null;
  const role = `${designation}${department ? ` in the ${department} team` : ""}`;

  /* ------------------------------------------------------------------ Shared terms */
  const placeTerm = () => {
    const where = text(letter.location);
    const manager = text(letter.reportingTo);
    if (!where && !manager) return;
    term(
      "Place of work",
      `${where ? `You will be based at ${where}` : "You will work at the place the company assigns you"}${
        manager ? ` and will report to ${manager}` : ""
      }. The company may ask you to work at another location as business needs require.`,
    );
  };
  const hoursTerm = () => {
    if (text(letter.workingHours))
      term("Working hours", `Your working hours will be ${text(letter.workingHours)}.`);
  };
  const probationTerm = () => {
    if (internship || !(letter.probationMonths > 0)) return;
    const months = `${letter.probationMonths} month${letter.probationMonths === 1 ? "" : "s"}`;
    term(
      "Probation",
      `You will be on probation for ${months} from your date of joining. On satisfactory completion, your employment will be confirmed in writing. The company may extend the probation period if needed.`,
    );
  };
  const noticeTerm = (withMisconduct: boolean) => {
    if (!(letter.noticeDays > 0)) return;
    term(
      "Notice period",
      `Either you or the company may end your ${internship ? "internship" : "employment"} by giving ${letter.noticeDays} days' written notice, or ${internship ? "stipend" : "salary"} in lieu of notice.${
        withMisconduct
          ? " The company may end your employment without notice in case of misconduct, as set out in its policies."
          : ""
      }`,
    );
  };
  const confidentialityTerm = () =>
    term(
      "Confidentiality",
      `You will keep the company's confidential information, and that of its clients, private during and after your ${internship ? "internship" : "employment"}, and you will follow the company's policies as updated from time to time.`,
    );
  const payTerm = () => {
    if (internship) {
      term(
        "Stipend",
        `You will receive a monthly stipend of ${money(pay)} (${inWords(pay)}), paid at the end of each month.`,
      );
    } else {
      term(
        "Compensation",
        `Your annual cost to company (CTC) will be ${money(pay)} (${inWords(pay)}).${annexureNote} Salary is paid monthly, after deduction of applicable taxes and statutory contributions.`,
      );
    }
  };
  const durationTerm = () => {
    if (!internship) return;
    term(
      "Duration",
      `Your internship will run from ${date(letter.joiningDate, "start date")} to ${date(letter.endDate, "end date")}. It does not by itself lead to an offer of employment.`,
    );
  };

  /* ------------------------------------------------------------------ Each kind */
  switch (kind) {
    case "offer": {
      subject = internship ? `Offer of internship - ${designation}` : `Offer of employment - ${designation}`;
      paragraph(
        internship
          ? `We are pleased to offer you an internship as ${role} at ${companyName}. We enjoyed getting to know you and look forward to learning together.`
          : `We are delighted to offer you the position of ${role} at ${companyName}${BASIS[letter.employmentType]}. We were impressed by your experience and believe you will be a great addition to the team.`,
      );
      term(
        "Start date",
        `Your ${internship ? "internship" : "employment"} will begin on ${date(letter.joiningDate, "joining date")}.`,
      );
      durationTerm();
      placeTerm();
      payTerm();
      probationTerm();
      hoursTerm();
      noticeTerm(false);
      confidentialityTerm();
      term(
        "Documents",
        internship
          ? "On your first day, please bring a copy of your college ID, identity and address proof, and a letter from your college if it requires one for the internship."
          : "On your first day, please bring copies of your educational certificates, identity and address proof, PAN card and, if you have worked before, the relieving letter and last three payslips from your previous employer.",
      );
      customTerms();
      paragraph(
        `${letter.offerValidUntil ? `This offer is valid until ${formatLongDate(letter.offerValidUntil)}. ` : ""}To accept it, please sign and return a copy of this letter. We look forward to welcoming you to ${companyName}.`,
      );
      acceptance = {
        heading: "Acceptance",
        text: `I accept the offer of ${internship ? "internship" : "employment"} on the terms set out above and will join on ${date(letter.joiningDate, "joining date")}.`,
        name,
      };
      break;
    }

    case "appointment": {
      subject = `Appointment as ${designation}`;
      paragraph(
        `Further to your application and the interviews you had with us, we are pleased to appoint you as ${role} at ${companyName}${BASIS[letter.employmentType]}, with effect from ${date(letter.joiningDate, "joining date")}, on the following terms and conditions.`,
      );
      durationTerm();
      placeTerm();
      payTerm();
      probationTerm();
      hoursTerm();
      term("Leave", "You will be entitled to leave and holidays as set out in the company's leave policy.");
      noticeTerm(true);
      confidentialityTerm();
      if (!internship) {
        term(
          "Other work",
          "While employed with us, you will not take up any other employment or business without the company's written permission.",
        );
      }
      customTerms();
      paragraph(
        `Please sign and return the duplicate copy of this letter as acceptance of these terms. We welcome you to ${companyName} and wish you a long and rewarding career with us.`,
      );
      acceptance = {
        heading: "Acceptance",
        text: "I have read and understood the terms of this appointment and accept them.",
        name,
      };
      break;
    }

    case "experience": {
      recipient = [];
      subject = "";
      salutation = "To whom it may concern";
      const id = text(employee.employeeId) ? ` (employee ID ${text(employee.employeeId)})` : "";
      paragraph(
        internship
          ? `This is to certify that ${name}${id} completed an internship with ${companyName} as ${role} from ${date(letter.joiningDate, "start date")} to ${date(letter.endDate, "end date")}.`
          : `This is to certify that ${name}${id} worked with ${companyName} as ${role} from ${date(letter.joiningDate, "joining date")} to ${date(letter.endDate, "last working day")}.`,
      );
      paragraph(
        text(letter.remarks) ||
          `During ${forms.possessive} time with us, ${firstName} was sincere, hardworking and a valued member of the team.`,
      );
      customTerms();
      paragraph(`We wish ${forms.object} every success in ${forms.possessive} future endeavours.`);
      break;
    }

    case "relieving": {
      subject = "Relieving letter";
      const id = text(employee.employeeId);
      recipient = [name, ...(id ? [`Employee ID: ${id}`] : []), designation, ...lines(employee.address)];
      paragraph(
        `This is with reference to your resignation${letter.resignationDate ? ` dated ${formatLongDate(letter.resignationDate)}` : ""}. We confirm that your resignation has been accepted and that you are relieved of your duties as ${designation} at ${companyName} with effect from the close of business on ${date(letter.endDate, "last working day")}.`,
      );
      if (letter.joiningDate) {
        paragraph(
          `Your employment with us was from ${formatLongDate(letter.joiningDate)} to ${date(letter.endDate, "last working day")}.`,
        );
      }
      paragraph(
        text(letter.remarks) || "Your full and final settlement will be processed as per company policy.",
      );
      customTerms();
      paragraph(
        `We thank you for your contributions to ${companyName} and wish you success in your future endeavours.`,
      );
      break;
    }

    case "increment": {
      const promotion = text(letter.newDesignation);
      const previous = toFiniteNumber(letter.previousPay);
      subject = promotion ? `Promotion to ${promotion}` : "Revision of your salary";
      const id = text(employee.employeeId);
      recipient = [
        name,
        ...(id ? [`Employee ID: ${id}`] : []),
        ...(text(letter.designation) ? [designation] : []),
      ];
      const rise = previous > 0 && pay > previous ? roundTo(((pay - previous) / previous) * 100, 1) : 0;
      const from =
        previous > 0 ? ` from ${money(previous)} to ${money(pay)}` : ` to ${money(pay)} (${inWords(pay)})`;
      paragraph(
        `In recognition of your performance and contribution to ${companyName}, we are pleased to ${
          promotion ? `promote you to the position of ${promotion} and to ` : ""
        }revise your annual cost to company (CTC)${from}${rise ? `, an increase of ${rise}%` : ""}, with effect from ${date(letter.effectiveDate, "effective date")}.`,
      );
      if (hasAnnexure) paragraph("Your revised salary breakdown is set out in Annexure A.");
      customTerms();
      paragraph("All other terms and conditions of your employment remain unchanged.");
      paragraph(
        `We appreciate your hard work and look forward to your continued contribution${promotion ? " in your new role" : ""}. Congratulations!`,
      );
      break;
    }
  }

  const monthlyTotal = breakdown.reduce((sum, row) => sum + toFiniteNumber(row.monthly), 0);
  const contact = [text(company.email), text(company.phone), text(company.website)].filter(Boolean);

  return {
    title: letterTitle(letter),
    company: { name: companyName, address: oneLine(company.address), contact, logo: company.logo },
    reference: text(letter.reference),
    date: date(letter.letterDate, "date"),
    recipient,
    subject: subject && capitalise(subject),
    salutation,
    blocks,
    signoff: {
      company: companyName,
      name: text(letter.signatory.name) || "[Signatory name]",
      title: text(letter.signatory.title),
      signature: letter.signatory.signature,
    },
    acceptance,
    annexure: hasAnnexure
      ? {
          title:
            kind === "increment" ? "Annexure A: Revised salary breakdown" : "Annexure A: Salary breakdown",
          rows: breakdown.map((row) => [
            text(row.label) || "-",
            money(toFiniteNumber(row.monthly)),
            money(toFiniteNumber(row.monthly) * 12),
          ]),
          total: [money(monthlyTotal), money(monthlyTotal * 12)],
        }
      : null,
  };
}

/** The yearly total of the salary breakdown, to compare with the CTC in the editor. */
export const breakdownAnnualTotal = (letter: Pick<HrLetter, "salaryBreakdown">) =>
  letter.salaryBreakdown.reduce((sum, row) => sum + toFiniteNumber(row.monthly), 0) * 12;
