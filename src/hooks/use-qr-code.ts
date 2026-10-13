"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/qr";

/** QR code data URL for `text`, or null while generating / when there is nothing to encode. */
export function useQrCode(text: string | null): string | null {
  const [result, setResult] = useState<{ text: string; dataUrl: string } | null>(null);

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    generateQrDataUrl(text)
      .then((dataUrl) => !cancelled && setResult({ text, dataUrl }))
      .catch(() => !cancelled && setResult(null));
    return () => {
      cancelled = true;
    };
  }, [text]);

  // Only return a code that matches the current text, never a stale one.
  return text && result?.text === text ? result.dataUrl : null;
}
