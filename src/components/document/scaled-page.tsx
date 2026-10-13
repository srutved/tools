"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { A4 } from "@/lib/document/primitives";
import { WebDocument } from "@/lib/document/web";
import { cn } from "@/lib/utils";

/**
 * Shows a document page (drawn at A4 size, 595pt wide) scaled to fit its container's width.
 * Used for live previews and gallery thumbnails alike.
 */
export function ScaledPage({ children, className }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [pageHeight, setPageHeight] = useState<number>(A4.height);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const page = pageRef.current;
    if (!container || !page) return;

    const update = () => {
      setScale(container.clientWidth / A4.width);
      setPageHeight(page.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: pageHeight * scale }}
    >
      <div
        ref={pageRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: A4.width, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        <WebDocument>{children}</WebDocument>
      </div>
    </div>
  );
}
