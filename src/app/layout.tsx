import type { Metadata, Viewport } from "next";
import { Mulish, Noto_Sans, Noto_Serif } from "next/font/google";
import { SiteAnalytics } from "@/components/layout/analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE } from "@/config/site";
import "./globals.css";

const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish", display: "swap" });

// Document fonts: the same families the PDF embeds, so the preview matches the download.
const docSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-doc-sans",
  display: "swap",
});
const docSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-doc-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `Free Business Tools | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${docSans.variable} ${docSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
        <SiteAnalytics />
      </body>
    </html>
  );
}
