import { buttonVariants } from "@/components/ui/button";
import { contactUrlFrom, SITE } from "@/config/site";

/** The closing call to action on tool pages: who made this, and how to hire them. */
export function SrutvedCta({ toolSlug }: { toolSlug?: string }) {
  return (
    <div className="mt-16 rounded-2xl bg-gray-900 p-8 text-center text-white">
      <h2 className="text-2xl font-bold">Need software built for your business?</h2>
      <p className="mx-auto mt-2 max-w-xl text-gray-300">
        These tools are made by Srutved, an app development company. We build MVPs, mobile apps and SaaS
        products, often in as little as 15 days.
      </p>
      <a
        href={toolSlug ? contactUrlFrom(toolSlug) : SITE.contactUrl}
        className={buttonVariants({ size: "lg", className: "mt-6" })}
      >
        Talk to us
      </a>
    </div>
  );
}
