/**
 * Local-first persistence. Everything a user creates is stored in their own browser (localStorage);
 * nothing is sent to a server. Keys are namespaced and versioned so the format can evolve safely:
 * data that no longer matches its schema is ignored rather than crashing the app.
 */

import type { z } from "zod";

const NAMESPACE = "srutved-tools/v1";

const storageKey = (key: string) => `${NAMESPACE}/${key}`;

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null; // Disabled storage, e.g. some private-browsing modes.
  }
}

export function readStored<T>(key: string, schema: z.ZodType<T>): T | null {
  const raw = getStorage()?.getItem(storageKey(key));
  if (!raw) return null;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Returns false if the value could not be saved (e.g. the browser's storage quota is full). */
export function writeStored(key: string, value: unknown): boolean {
  try {
    getStorage()?.setItem(storageKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStored(key: string): void {
  getStorage()?.removeItem(storageKey(key));
}

/** Keys shared by every tool, so details entered once can be reused everywhere. */
export const SHARED_KEYS = {
  businessProfile: "shared/business-profile",
} as const;
