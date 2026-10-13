/**
 * Currency helpers built on the platform Intl APIs, so every ISO 4217 currency is supported
 * with the correct symbol, decimal places and digit grouping - no hand-maintained tables.
 */

export interface CurrencyOption {
  code: string;
  name: string;
}

/** Shown first in currency pickers. */
export const POPULAR_CURRENCIES = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "JPY", "CHF"];

const FALLBACK_CURRENCIES = POPULAR_CURRENCIES;

/** Best-guess default currency from the browser's locale region, e.g. "en-IN" → INR. */
const REGION_CURRENCIES: Record<string, string> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  AE: "AED",
  JP: "JPY",
  CH: "CHF",
  NZ: "NZD",
  ZA: "ZAR",
  NG: "NGN",
  KE: "KES",
  BR: "BRL",
  MX: "MXN",
  CN: "CNY",
  HK: "HKD",
  KR: "KRW",
  SA: "SAR",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  NP: "NPR",
  PH: "PHP",
  ID: "IDR",
  MY: "MYR",
  TH: "THB",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  TR: "TRY",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  IE: "EUR",
  PT: "EUR",
  BE: "EUR",
  AT: "EUR",
  FI: "EUR",
};

export function guessCurrencyFromLocale(locale: string | undefined): string {
  try {
    const region = locale ? new Intl.Locale(locale).maximize().region : undefined;
    return (region && REGION_CURRENCIES[region]) || "USD";
  } catch {
    return "USD";
  }
}

let cachedOptions: CurrencyOption[] | null = null;

/** All currencies the runtime knows about, sorted by code. */
export function getCurrencyOptions(): CurrencyOption[] {
  if (cachedOptions) return cachedOptions;

  const codes =
    typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("currency") : FALLBACK_CURRENCIES;
  const names = new Intl.DisplayNames(["en"], { type: "currency" });

  cachedOptions = codes.map((code) => ({ code, name: names.of(code) ?? code }));
  return cachedOptions;
}

/** Number of minor-unit digits, e.g. 2 for USD, 0 for JPY, 3 for KWD. */
export function getCurrencyDecimals(currency: string): number {
  try {
    return (
      new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ??
      2
    );
  } catch {
    return 2;
  }
}

/** Indian digit grouping (1,00,000) for rupees; international grouping (100,000) otherwise. */
export function getNumberLocale(currency: string): string {
  return currency === "INR" ? "en-IN" : "en-US";
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(getNumberLocale(currency), { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** English currency name in title case, singular or plural for the count: "US Dollar" / "US Dollars". */
export function getCurrencyName(currency: string, count = 2): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "name",
      // Whole numbers, so English plural rules see "1" (euro), not "1.00" (euros).
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(count);
    const name = parts.find((part) => part.type === "currency")?.value ?? currency;
    return name.replace(/\b\p{Ll}/gu, (letter) => letter.toUpperCase());
  } catch {
    return currency;
  }
}
