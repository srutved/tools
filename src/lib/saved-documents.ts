/**
 * A tool's saved documents ("My invoices", "My resumes"...), kept in localStorage. Each document is
 * validated on its own, so one corrupted entry never wipes out the rest.
 */

import { z } from "zod";
import { readStored, writeStored } from "./storage";

export interface SavedDocument<T> {
  id: string;
  /** Epoch milliseconds of the last change. */
  updatedAt: number;
  data: T;
}

export interface DocumentCollection<T> {
  /** The document open in the editor. */
  activeId: string | null;
  /** Most recently edited first. */
  documents: SavedDocument<T>[];
}

export interface DocumentStore<T> {
  load(): DocumentCollection<T>;
  /** Returns false if the browser refused to save (e.g. its storage quota is full). */
  save(collection: DocumentCollection<T>): boolean;
}

const rawCollectionSchema = z.object({
  activeId: z.string().nullable(),
  documents: z.array(z.unknown()),
});

interface DocumentStoreOptions<T> {
  /** Storage key, namespaced by tool, e.g. "resume-builder/resumes". */
  key: string;
  schema: z.ZodType<T>;
  /** Converts data saved in an older format into the current collection shape. */
  migrate?: (raw: unknown) => unknown;
}

type Issue = z.core.$ZodIssue;

const isNumberIssue = (issue: Issue) =>
  (issue.code === "invalid_type" && (issue.expected === "number" || issue.expected === "int")) ||
  ((issue.code === "too_small" || issue.code === "too_big") && issue.origin === "number");

/** The nearest valid number: 0 for an emptied field, the limit for one out of range. */
function repairedNumber(issue: Issue, value: unknown): number {
  if (issue.code === "too_small") return Number(issue.minimum);
  if (issue.code === "too_big") return Number(issue.maximum);
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
}

/**
 * Parses a saved document, repairing numbers a half-typed form can leave behind (an emptied number
 * field saves as null, and a value can be out of range) rather than dropping the whole draft.
 * Returns null if anything else is wrong.
 */
function parseRepairingNumbers<S extends z.ZodType>(schema: S, entry: unknown): z.infer<S> | null {
  let candidate = entry;
  // A repaired value can reveal one more issue (e.g. an emptied integer field), so allow a few rounds.
  for (let round = 0; round < 3; round++) {
    const parsed = schema.safeParse(candidate);
    if (parsed.success) return parsed.data;
    if (!parsed.error.issues.every(isNumberIssue)) return null;
    candidate = structuredClone(candidate);
    for (const issue of parsed.error.issues) {
      const parent = issue.path
        .slice(0, -1)
        .reduce<unknown>((node, key) => (node as Record<PropertyKey, unknown>)?.[key], candidate) as
        Record<PropertyKey, unknown> | undefined;
      const key = issue.path.at(-1);
      if (!parent || key === undefined) return null;
      parent[key] = repairedNumber(issue, parent[key]);
    }
  }
  return null;
}

export function createDocumentStore<T>({ key, schema, migrate }: DocumentStoreOptions<T>): DocumentStore<T> {
  const savedSchema = z.object({ id: z.string(), updatedAt: z.number(), data: schema });

  return {
    load() {
      const stored = readStored(key, z.unknown());
      const raw = rawCollectionSchema.safeParse(migrate && stored ? migrate(stored) : stored);
      if (!raw.success) return { activeId: null, documents: [] };
      const documents = raw.data.documents.flatMap((entry) => {
        const parsed = parseRepairingNumbers(savedSchema, entry);
        return parsed ? [parsed as SavedDocument<T>] : [];
      });
      return { activeId: raw.data.activeId, documents };
    },
    save({ activeId, documents }) {
      // Pick the fields explicitly so nothing else on the object (e.g. extra state) is persisted.
      return writeStored(key, { activeId, documents });
    },
  };
}

/** Inserts or replaces a document, moves it to the top and makes it the active one. */
export function upsertDocument<T>(
  collection: DocumentCollection<T>,
  id: string,
  data: T,
): DocumentCollection<T> {
  return {
    activeId: id,
    documents: [{ id, updatedAt: Date.now(), data }, ...collection.documents.filter((doc) => doc.id !== id)],
  };
}

export function removeDocument<T>(collection: DocumentCollection<T>, id: string): DocumentCollection<T> {
  const documents = collection.documents.filter((doc) => doc.id !== id);
  return {
    activeId: collection.activeId === id ? (documents[0]?.id ?? null) : collection.activeId,
    documents,
  };
}

export const findDocument = <T>(collection: DocumentCollection<T>, id: string | null) =>
  collection.documents.find((doc) => doc.id === id);
