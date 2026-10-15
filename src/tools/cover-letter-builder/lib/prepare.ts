/**
 * Turns a cover letter as typed into what templates render: contact items, a written-out date,
 * the recipient's address lines and the body split into paragraphs.
 */

import { formatLongDate } from "@/lib/date";
import { buildContacts, type ContactItem } from "@/tools/resume-builder/lib/prepare";
import type { CoverLetter } from "../schema";

export interface PreparedCoverLetter {
  name: string;
  headline: string;
  photo: string;
  contacts: ContactItem[];
  /** e.g. "13 October 2026". */
  date: string;
  /** Recipient name, title, company and address, one line each. */
  recipient: string[];
  subject: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
}

/** Paragraphs are separated by blank lines; single line breaks inside one are kept. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const text = (value: string | undefined) => (value ?? "").trim();

/** Lenient about missing fields, because the live preview renders while the user is still typing. */
export function prepareCoverLetter(letter: CoverLetter): PreparedCoverLetter {
  const basics = letter.basics ?? ({} as Partial<CoverLetter["basics"]>);
  const recipient = letter.recipient ?? ({} as Partial<CoverLetter["recipient"]>);
  return {
    name: text(basics.name),
    headline: text(basics.headline),
    photo: basics.photo ?? "",
    contacts: buildContacts(basics),
    date: letter.date ? formatLongDate(letter.date) : "",
    recipient: [
      text(recipient.name),
      text(recipient.title),
      text(recipient.company),
      ...text(recipient.address).split(/\r?\n/),
    ]
      .map((line) => line.trim())
      .filter(Boolean),
    subject: text(letter.subject),
    greeting: text(letter.greeting),
    paragraphs: toParagraphs(letter.body ?? ""),
    closing: text(letter.closing),
  };
}
