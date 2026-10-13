import { getCurrencyDecimals, getCurrencyName } from "./currency";
import { roundTo } from "./utils";

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** Minor-unit names for currencies where they are well known; others fall back to "50/100". */
const MINOR_UNITS: Record<string, string> = {
  INR: "Paise",
  GBP: "Pence",
  AED: "Fils",
  JOD: "Fils",
  BHD: "Fils",
  KWD: "Fils",
  USD: "Cents",
  EUR: "Cents",
  AUD: "Cents",
  CAD: "Cents",
  NZD: "Cents",
  SGD: "Cents",
  HKD: "Cents",
  ZAR: "Cents",
  LKR: "Cents",
  NPR: "Paisa",
  PKR: "Paisa",
  BDT: "Poisha",
  CHF: "Centimes",
};

function belowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const restWords =
    rest < 20 ? ONES[rest] : [TENS[Math.floor(rest / 10)], ONES[rest % 10]].filter(Boolean).join(" ");
  return [hundreds ? `${ONES[hundreds]} Hundred` : "", restWords].filter(Boolean).join(" ");
}

/** International grouping: thousand, million, billion, trillion. */
export function numberToWords(n: number): string {
  if (n === 0) return "Zero";
  const scales = [
    { value: 1e12, name: "Trillion" },
    { value: 1e9, name: "Billion" },
    { value: 1e6, name: "Million" },
    { value: 1e3, name: "Thousand" },
  ];
  const words: string[] = [];
  let remaining = Math.floor(n);
  for (const scale of scales) {
    if (remaining >= scale.value) {
      words.push(`${numberToWords(Math.floor(remaining / scale.value))} ${scale.name}`);
      remaining %= scale.value;
    }
  }
  if (remaining) words.push(belowThousand(remaining));
  return words.join(" ");
}

/** Indian grouping: thousand, lakh, crore (e.g. 1,25,00,000 → "One Crore Twenty Five Lakh"). */
export function numberToIndianWords(n: number): string {
  if (n === 0) return "Zero";
  const words: string[] = [];
  let remaining = Math.floor(n);
  if (remaining >= 1e7) {
    words.push(`${numberToIndianWords(Math.floor(remaining / 1e7))} Crore`);
    remaining %= 1e7;
  }
  if (remaining >= 1e5) {
    words.push(`${belowThousand(Math.floor(remaining / 1e5))} Lakh`);
    remaining %= 1e5;
  }
  if (remaining >= 1e3) {
    words.push(`${belowThousand(Math.floor(remaining / 1e3))} Thousand`);
    remaining %= 1e3;
  }
  if (remaining) words.push(belowThousand(remaining));
  return words.join(" ");
}

/**
 * Writes a money amount in words, as printed on invoices and cheques.
 *   amountInWords(120500.5, "INR") → "Indian Rupees One Lakh Twenty Thousand Five Hundred and Fifty Paise Only"
 *   amountInWords(1250.75, "USD")  → "One Thousand Two Hundred Fifty US Dollars and Seventy Five Cents Only"
 *   amountInWords(12.5, "KWD")     → "Twelve Kuwaiti Dinars and Five Hundred Fils Only"
 */
export function amountInWords(amount: number, currency: string): string {
  const decimals = getCurrencyDecimals(currency);
  const value = Math.abs(roundTo(amount, decimals));
  const major = Math.floor(value);
  const minor = Math.round((value - major) * 10 ** decimals);

  if (currency === "INR") {
    const minorPart = minor ? ` and ${numberToWords(minor)} Paise` : "";
    return `${getCurrencyName("INR", major)} ${numberToIndianWords(major)}${minorPart} Only`;
  }

  const minorUnit = MINOR_UNITS[currency];
  const minorPart = !minor
    ? ""
    : minorUnit
      ? ` and ${numberToWords(minor)} ${minorUnit}`
      : ` and ${String(minor).padStart(decimals, "0")}/${10 ** decimals}`;
  return `${numberToWords(major)} ${getCurrencyName(currency, major)}${minorPart} Only`;
}
