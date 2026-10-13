"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GalleryTemplate {
  id: string;
  name: string;
  description: string;
  /** Colour dot shown next to the name. */
  accent: string;
  /** Short labels such as "ATS-friendly". */
  tags?: string[];
}

interface TemplateGalleryProps<T extends GalleryTemplate> {
  templates: T[];
  /** A live, scaled-down render of the document in the given template. */
  renderThumbnail: (template: T) => ReactNode;
  selectedId?: string;
  onSelect?: (template: T) => void;
  /** Rendered under each thumbnail instead of selection behaviour, e.g. a "Use template" link. */
  renderAction?: (template: T) => ReactNode;
}

/** Grid of template thumbnails, used in the editor's template picker and on /templates pages. */
export function TemplateGallery<T extends GalleryTemplate>({
  templates,
  renderThumbnail,
  selectedId,
  onSelect,
  renderAction,
}: TemplateGalleryProps<T>) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {templates.map((template) => {
        const selected = template.id === selectedId;
        const content = (
          <>
            <div
              className={cn(
                "rounded-lg p-1 transition-colors",
                selected ? "bg-brand" : "group-hover:bg-brand/40",
              )}
            >
              {renderThumbnail(template)}
            </div>
            <div className="mt-2 flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: template.accent }}
                    aria-hidden
                  />
                  {template.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">{template.description}</p>
                {template.tags && template.tags.length > 0 && (
                  <p className="mt-1 flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-subtle px-1.5 py-0.5 text-[11px] font-semibold text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              {selected && <Check className="size-4 shrink-0 text-brand" aria-label="Selected" />}
            </div>
          </>
        );
        return (
          <li key={template.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(template)}
                aria-pressed={selected}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-brand"
              >
                {content}
              </button>
            ) : (
              <div className="group">
                {content}
                {renderAction?.(template)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
