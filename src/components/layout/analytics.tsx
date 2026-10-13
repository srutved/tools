"use client";

// The React build accepts explicit route/path props (the Next.js wrapper derives them itself).
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { BASE_PATH } from "@/config/site";

/**
 * Vercel Web Analytics for the tools.
 *
 * Visitors reach these pages at srutved.com/tools, so page views go to the main site's analytics
 * (the root /_vercel/insights endpoints), keeping all of srutved.com in one dashboard. Next.js
 * strips the base path from usePathname(), so it is added back to report "/tools/...", not
 * "/invoice-generator". Every route here is static, so the route and the path are the same.
 */
function TrackedAnalytics() {
  const pathname = usePathname();
  const path = pathname === "/" ? BASE_PATH : `${BASE_PATH}${pathname}`;
  return (
    <Analytics
      scriptSrc="/_vercel/insights/script.js"
      endpoint="/_vercel/insights"
      route={path}
      path={path}
      framework="next"
    />
  );
}

export function SiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <TrackedAnalytics />
    </Suspense>
  );
}
