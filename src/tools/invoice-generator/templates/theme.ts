/** Neutral colours shared by every template, so only the accent varies between them. */
export const INK = {
  text: "#1f2937",
  muted: "#6b7280",
  faint: "#9ca3af",
  border: "#e5e7eb",
  surface: "#f9fafb",
} as const;

/** Mixes a hex colour with white. `amount` 0 → original colour, 1 → white. */
export function tint(hex: string, amount: number): string {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  const mixed = channels.map((channel) => Math.round(channel + (255 - channel) * amount));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}
