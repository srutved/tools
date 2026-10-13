import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, letting later classes override earlier conflicting ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Rounds to a fixed number of decimal places, avoiding floating point artefacts like 1.005 → 1.00. */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Treats NaN, Infinity and non-numbers (e.g. a half-typed input) as 0. */
export function toFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Short random id for list items (stable keys for react-hook-form field arrays). */
export function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}
