"use client";

import { track } from "@vercel/analytics";
import { BASE_PATH } from "@/config/site";

/**
 * Product events (downloads, examples opened...), sent to Vercel Web Analytics as custom events so
 * we can see which tools people actually use. Only names and tool/template ids are sent - never
 * anything a user typed. Custom events need a paid Vercel plan; elsewhere they're simply dropped.
 */
export type ToolEvent = "PDF Downloaded" | "PDF Printed" | "Example Opened" | "Quote Converted";

/** The tool on the current page, e.g. "invoice-generator", from /tools/invoice-generator. */
export function currentToolSlug(): string {
  const path = window.location.pathname.startsWith(BASE_PATH)
    ? window.location.pathname.slice(BASE_PATH.length)
    : window.location.pathname;
  return path.split("/").filter(Boolean)[0] ?? "hub";
}

export function trackToolEvent(event: ToolEvent, properties: Record<string, string> = {}) {
  try {
    track(event, { tool: currentToolSlug(), ...properties });
  } catch {
    // Analytics must never break the tool.
  }
}
