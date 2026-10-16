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

// Site-wide defaults. Each page sets its own title, description and canonical URL via buildMetadata;
// favicons, the web manifest and social images come from file conventions in src/app.
export const metadata: Metadata = {
  // Includes the /tools base path: Next.js resolves generated image URLs (opengraph-image) against
  // metadataBase without adding basePath, so without it previews would point at srutved.com/<page>.
  metadataBase: new URL(`${SITE.toolsUrl}/`),
  title: { default: `Free Business Tools | ${SITE.titleSuffix}`, template: `%s | ${SITE.titleSuffix}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.company, url: SITE.url }],
  creator: SITE.company,
  publisher: SITE.company,
  category: "business",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: "website" },
  twitter: { card: "summary_large_image", site: SITE.social.xHandle },
  appleWebApp: { title: SITE.name, capable: true, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
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
