import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Standard social preview size (Facebook, LinkedIn, X, WhatsApp, Slack). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

interface OgImageOptions {
  /** Main headline, e.g. "Free Invoice Generator". */
  title: string;
  /** One line under the headline. */
  subtitle: string;
  /** Short selling points shown as chips. */
  highlights?: string[];
}

/**
 * Branded social preview card, generated at build time for each page's opengraph-image.tsx.
 * One design for every tool, so shared links look consistent.
 */
const fontFile = (name: string) => readFile(path.join(process.cwd(), "public", "fonts", name));

/** Noto Sans - the same family the PDFs embed - so previews match the brand and headlines can be bold. */
async function loadFonts() {
  const [regular, bold] = await Promise.all([
    fontFile("NotoSans-Regular.ttf"),
    fontFile("NotoSans-Bold.ttf"),
  ]);
  return [
    { name: "Noto Sans", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Noto Sans", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export async function renderOgImage({ title, subtitle, highlights = [] }: OgImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%, #ecfdf5 100%)",
        fontFamily: "Noto Sans",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "baseline", fontSize: 40, fontWeight: 700, color: "#111827" }}
      >
        <span>Srut</span>
        <span style={{ color: "#22c55e" }}>ved</span>
        <span style={{ marginLeft: 16, fontSize: 30, fontWeight: 700, color: "#6b7280" }}>Tools</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 700, color: "#111827", lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#4b5563", lineHeight: 1.3, maxWidth: 1000 }}>
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 14 }}>
          {highlights.map((highlight) => (
            <div
              key={highlight}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "#22c55e",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {highlight}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#16a34a" }}>srutved.com/tools</div>
      </div>
    </div>,
    { ...OG_IMAGE_SIZE, fonts: await loadFonts() },
  );
}
