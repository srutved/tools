"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Offers to fill an empty document with an example, so the preview isn't a blank page. Show it
 * only while the document is empty: loading the example replaces what's in the form.
 */
export function ExampleBanner({ onLoad, noun }: { onLoad: () => void; noun: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4">
      <p className="text-sm">
        <span className="font-bold">Not sure where to start?</span> Load an example {noun} and edit it into
        your own.
      </p>
      <Button variant="outline" size="sm" onClick={onLoad}>
        <Sparkles /> Load example
      </Button>
    </div>
  );
}
