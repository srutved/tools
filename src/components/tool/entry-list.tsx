"use client";

import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type ArrayPath,
  type FieldArray,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormSection } from "./form";

interface EntryListProps<T extends FieldValues, N extends ArrayPath<T>> {
  /** The array field, e.g. "experience". */
  name: N;
  title: string;
  description?: string;
  /** e.g. "Add job". */
  addLabel: string;
  create: () => FieldArray<T, N>;
  /** Card title for an entry, e.g. "Designer at Acme"; falls back to `fallbackTitle`. */
  summarize: (entry: FieldArray<T, N>) => string;
  /** e.g. "New job". */
  fallbackTitle: string;
  renderFields: (index: number) => ReactNode;
  /** Shown when the list is empty. */
  emptyText?: string;
  /** Without the card around the list, for lists nested inside another entry. */
  bare?: boolean;
}

/**
 * An editable list of repeating entries (jobs, schools, projects...) in collapsible cards that can be
 * reordered and removed. Shared by every tool with repeating groups of fields.
 */
export function EntryList<T extends FieldValues, N extends ArrayPath<T>>({
  name,
  title,
  description,
  addLabel,
  create,
  summarize,
  fallbackTitle,
  renderFields,
  emptyText,
  bare = false,
}: EntryListProps<T, N>) {
  const { control } = useFormContext<T>();
  // keyName avoids clashing with each entry's own `id` field.
  const { fields, append, remove, move } = useFieldArray<T, N, "key">({ control, name, keyName: "key" });

  const addButton = (
    <Button variant="outline" size="sm" onClick={() => append(create())}>
      <Plus /> {addLabel}
    </Button>
  );
  const items = (
    <>
      {fields.length === 0 && emptyText && <p className="text-sm text-muted">{emptyText}</p>}
      {fields.map((field, index) => (
        <EntryCard
          key={field.key}
          name={`${name}.${index}` as Path<T>}
          number={index + 1}
          summarize={summarize as (entry: unknown) => string}
          fallbackTitle={fallbackTitle}
          onMoveUp={index > 0 ? () => move(index, index - 1) : undefined}
          onMoveDown={index < fields.length - 1 ? () => move(index, index + 1) : undefined}
          onRemove={() => remove(index)}
        >
          {renderFields(index)}
        </EntryCard>
      ))}
    </>
  );

  if (bare) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold">{title}</p>
          {addButton}
        </div>
        {items}
      </div>
    );
  }
  return (
    <FormSection title={title} description={description} action={addButton}>
      {items}
    </FormSection>
  );
}

interface EntryCardProps {
  name: string;
  number: number;
  summarize: (entry: unknown) => string;
  fallbackTitle: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
  children: ReactNode;
}

function EntryCard({
  name,
  number,
  summarize,
  fallbackTitle,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: EntryCardProps) {
  const entry = useWatch({ name });
  const title = (entry && summarize(entry).trim()) || fallbackTitle;

  // Buttons live inside <summary>, so stop their clicks from also opening/closing the card.
  const action = (handler: () => void) => (event: MouseEvent) => {
    event.preventDefault();
    handler();
  };

  return (
    <details open className="group rounded-lg border border-border open:pb-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 hover:bg-subtle/60 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="size-4 shrink-0 -rotate-90 text-muted transition-transform group-open:rotate-0"
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</span>
        <span className="flex shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={action(() => onMoveUp?.())}
            disabled={!onMoveUp}
            aria-label={`Move ${title} up`}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={action(() => onMoveDown?.())}
            disabled={!onMoveDown}
            aria-label={`Move ${title} down`}
          >
            <ArrowDown />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={action(onRemove)}
            aria-label={`Remove ${title}`}
            title={`Remove entry ${number}`}
          >
            <Trash2 className="text-danger" />
          </Button>
        </span>
      </summary>
      <div className="space-y-4 px-4 pt-2">{children}</div>
    </details>
  );
}
