"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  findDocument,
  removeDocument,
  upsertDocument,
  type DocumentCollection,
  type DocumentStore,
} from "@/lib/saved-documents";
import { createId } from "@/lib/utils";

const AUTOSAVE_DELAY_MS = 400;

type ActiveCollection<T> = DocumentCollection<T> & { activeId: string };

/**
 * Reads a tool's saved documents on first load, creating a first document for new visitors.
 * `patch` adjusts the opened document, e.g. to apply a template chosen through the URL.
 * `startWith` opens a new document instead (e.g. an example chosen on a landing page), added
 * alongside the saved ones so nothing the user made is overwritten.
 */
export function loadDocumentLibrary<T>(
  store: DocumentStore<T>,
  { create, patch = (data) => data, startWith }: { create: () => T; patch?: (data: T) => T; startWith?: T },
): ActiveCollection<T> & { active: T } {
  const collection = store.load();
  if (startWith) {
    const id = createId();
    const active = patch(startWith);
    return { ...upsertDocument(collection, id, active), activeId: id, active };
  }
  const existing = findDocument(collection, collection.activeId) ?? collection.documents[0];
  const id = existing?.id ?? createId();
  const active = patch(existing ? existing.data : create());
  return { ...upsertDocument(collection, id, active), activeId: id, active };
}

/** The example named by `?example=`, if any. ToolGate removes the parameter once it's been read. */
export function exampleFromQuery<E extends { slug: string }>(
  query: URLSearchParams,
  examples: readonly E[],
): E | undefined {
  const slug = query.get("example");
  return slug ? examples.find((example) => example.slug === slug) : undefined;
}

/** The template named by `?template=`, if it's one of the given templates. */
export function templateFromQuery(query: URLSearchParams, templates: { id: string }[]): string | undefined {
  const requested = query.get("template");
  return templates.some((template) => template.id === requested) ? requested! : undefined;
}

interface UseDocumentLibraryOptions<T extends FieldValues> {
  store: DocumentStore<T>;
  form: UseFormReturn<T>;
  /** From loadDocumentLibrary(), read once on mount. */
  initial: ActiveCollection<T>;
  /** Plural shown in messages, e.g. "invoices". */
  noun: string;
  setAlert: (message: string | null) => void;
  /** Runs after every save, e.g. to remember the user's business details for next time. */
  onSave?: (data: T) => void;
  /** Runs whenever a different document is opened in the editor. */
  onOpen?: () => void;
}

/**
 * Everything around the document being edited: autosaving it, and creating, opening, duplicating
 * and deleting saved documents. Shared by every document tool so they all behave the same way.
 */
export function useDocumentLibrary<T extends FieldValues>({
  store,
  form,
  initial,
  noun,
  setAlert,
  onSave,
  onOpen,
}: UseDocumentLibraryOptions<T>) {
  const [collection, setCollection] = useState<DocumentCollection<T>>(initial);
  const collectionRef = useRef<DocumentCollection<T>>(initial);

  const commit = useCallback(
    (next: DocumentCollection<T>) => {
      collectionRef.current = next;
      setCollection(next);
      if (!store.save(next)) {
        setAlert(
          `Your browser's storage is full, so recent changes may not be saved. Delete old ${noun} to free space.`,
        );
      }
    },
    [noun, setAlert, store],
  );

  // Latest callbacks in refs, so the autosave subscription below never has to be recreated.
  const onSaveRef = useRef(onSave);
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onSaveRef.current = onSave;
    onOpenRef.current = onOpen;
  });

  const saveNow = useCallback(() => {
    const data = form.getValues();
    commit(upsertDocument(collectionRef.current, collectionRef.current.activeId ?? createId(), data));
    onSaveRef.current?.(data);
  }, [commit, form]);

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flushSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveNow();
  }, [saveNow]);

  useEffect(() => {
    store.save(initial); // Persist the first document, or a template chosen through the URL.
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: () => {
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(saveNow, AUTOSAVE_DELAY_MS);
      },
    });
    return () => {
      unsubscribe();
      clearTimeout(saveTimer.current);
    };
  }, [form, initial, saveNow, store]);

  const openDocument = useCallback(
    (id: string, data: T) => {
      commit(upsertDocument(collectionRef.current, id, data));
      form.reset(data);
      setAlert(null);
      onOpenRef.current?.();
    },
    [commit, form, setAlert],
  );

  /** Saves the current document, then opens a new one. */
  const create = (data: T) => {
    flushSave();
    openDocument(createId(), data);
  };

  const open = (id: string) => {
    flushSave();
    const saved = findDocument(collectionRef.current, id);
    if (saved) openDocument(id, saved.data);
  };

  /** Opens a copy of a saved document; `transform` adjusts it (new number, fresh ids...). */
  const duplicate = (id: string, transform: (data: T) => T) => {
    flushSave();
    const saved = findDocument(collectionRef.current, id);
    if (saved) openDocument(createId(), transform(saved.data));
  };

  /**
   * Deletes a saved document after confirming. Deleting the open one opens the next most recent,
   * or `createFallback()` when nothing is left.
   */
  const remove = (id: string, { label, createFallback }: { label: string; createFallback: () => T }) => {
    if (
      !findDocument(collectionRef.current, id) ||
      !window.confirm(`Delete ${label}? This can't be undone.`)
    ) {
      return;
    }
    const next = removeDocument(collectionRef.current, id);
    if (id !== collectionRef.current.activeId) {
      commit(next);
      return;
    }
    collectionRef.current = next;
    const fallback = findDocument(next, next.activeId);
    if (fallback) openDocument(fallback.id, fallback.data);
    else openDocument(createId(), createFallback());
  };

  /** The most recently edited saved document. */
  const latest = (): T | undefined => collectionRef.current.documents[0]?.data;

  return { collection, flushSave, create, open, duplicate, remove, latest };
}
