const BULLET_MARKER = /^\s*(?:[-*•▪◦·‣–]|\d+[.)])\s+/;

/** Splits text into non-empty lines, removing bullet markers people type or paste ("- ", "• ", "1. "). */
export function toBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(BULLET_MARKER, "").trim())
    .filter(Boolean);
}
