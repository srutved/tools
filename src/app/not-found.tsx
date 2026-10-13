import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-bold text-brand-strong">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-muted">That tool doesn&apos;t exist, or it moved.</p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        See all tools
      </Link>
    </main>
  );
}
