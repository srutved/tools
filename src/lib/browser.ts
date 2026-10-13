/** Browser-only helpers for files and images. */

/** Saves a Blob as a file download. */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Turns arbitrary text into a safe file name, e.g. "INV/2026 #4" → "INV-2026-4". */
export function toFileName(text: string, fallback = "document") {
  const cleaned = text
    .trim()
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

export interface ImageOptions {
  /** Longest side of the result in pixels. */
  maxSize?: number;
  /** Crop to a centred square (profile photos). */
  square?: boolean;
  /** PNG keeps transparency (logos); JPEG is far smaller for photos. */
  type?: "image/png" | "image/jpeg";
}

/**
 * Reads an image file and returns it as a data URL no larger than maxSize × maxSize.
 * Downscaling keeps localStorage small, and re-encoding also converts formats like SVG or WebP
 * into one that PDFs can embed.
 */
export function imageFileToDataUrl(
  file: File,
  { maxSize = 400, square = false, type = "image/png" }: ImageOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      // Source rectangle: the whole image, or its centred square.
      const side = Math.min(image.width, image.height);
      const sw = square ? side : image.width;
      const sh = square ? side : image.height;
      const sx = (image.width - sw) / 2;
      const sy = (image.height - sh) / 2;
      const scale = Math.min(1, maxSize / Math.max(sw, sh));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sw * scale));
      canvas.height = Math.max(1, Math.round(sh * scale));
      const context = canvas.getContext("2d");
      if (context && type === "image/jpeg") {
        // JPEG has no transparency: paint transparent areas white rather than black.
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context?.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, 0.88));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image could not be read."));
    };
    image.src = url;
  });
}
