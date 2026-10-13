"use client";

import { ImagePlus, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext, useWatch, type FieldValues, type Path, type PathValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { imageFileToDataUrl, type ImageOptions } from "@/lib/browser";
import { cn } from "@/lib/utils";
import { Field } from "./form";

interface ImageFieldProps<T extends FieldValues> {
  /** A string field holding the image as a data URL ("" when empty). */
  name: Path<T>;
  label: string;
  hint?: string;
  /** "logo": wide box, image kept whole. "photo": round, cropped to a square. */
  variant?: "logo" | "photo";
}

const OPTIONS: Record<NonNullable<ImageFieldProps<FieldValues>["variant"]>, ImageOptions> = {
  logo: { maxSize: 400, type: "image/png" },
  photo: { maxSize: 360, square: true, type: "image/jpeg" },
};

/** Upload, preview and remove an image. It is resized on the device and never uploaded. */
export function ImageField<T extends FieldValues>({
  name,
  label,
  hint,
  variant = "logo",
}: ImageFieldProps<T>) {
  const { setValue } = useFormContext<T>();
  const image = useWatch<T>({ name }) as string | undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const id = `field-${name.replace(/\./g, "-")}`;
  const isPhoto = variant === "photo";

  const set = (value: string) => setValue(name, value as PathValue<T, Path<T>>, { shouldDirty: true });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      set(await imageFileToDataUrl(file, OPTIONS[variant]));
      setError(undefined);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "That image could not be used.");
    }
  }

  const Placeholder = isPhoto ? UserRound : ImagePlus;

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-border bg-subtle",
            isPhoto ? "size-14 rounded-full" : "h-14 w-28 rounded-md",
          )}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URL
            <img
              src={image}
              alt=""
              className={isPhoto ? "size-full object-cover" : "max-h-full max-w-full object-contain"}
            />
          ) : (
            <Placeholder className="size-5 text-muted" aria-hidden />
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          {image ? "Change" : "Upload"}
        </Button>
        {image && (
          <Button variant="danger" size="sm" onClick={() => set("")}>
            Remove
          </Button>
        )}
      </div>
    </Field>
  );
}
