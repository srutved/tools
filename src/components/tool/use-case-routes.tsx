import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { toolUrl } from "@/config/site";
import { renderOgImage } from "@/lib/og-image";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import type { UseCase, UseCaseCollection } from "./use-case";
import { UseCaseIndexPage, UseCasePage } from "./use-case-page";

type SlugParams = { params: Promise<{ slug: string }> };

/**
 * Everything the routes of a use-case collection export, so each route file is a few lines:
 * the index page, one static page per example, their metadata and social images.
 */
export function createUseCaseRoutes<T>({
  collection,
  items,
  renderPreview,
}: {
  collection: UseCaseCollection;
  items: UseCase<T>[];
  /** A client component rendering the example document. */
  renderPreview: (document: T) => ReactNode;
}) {
  const tool = getTool(collection.toolSlug);
  const collectionPath = `${tool.slug}/${collection.segment}`;
  const find = async ({ params }: SlugParams) => {
    const { slug } = await params;
    return items.find((item) => item.slug === slug);
  };

  return {
    indexMetadata: buildMetadata({
      title: collection.metaTitle,
      description: collection.metaDescription,
      url: toolUrl(collectionPath),
    }),

    IndexPage: function UseCaseIndexRoute() {
      return (
        <UseCaseIndexPage
          tool={tool}
          collection={collection}
          items={items.map((item) => ({
            slug: item.slug,
            name: item.name,
            summary: item.summary,
            preview: renderPreview(item.document),
          }))}
        />
      );
    },

    indexOgImage: () =>
      renderOgImage({
        title: collection.title,
        subtitle: `${items.length} free examples · Edit online · Download as PDF`,
        highlights: ["100% free", "No sign-up", "No watermark"],
      }),

    generateStaticParams: () => items.map((item) => ({ slug: item.slug })),

    generateMetadata: async (props: SlugParams) => {
      const item = await find(props);
      if (!item) return {};
      return buildMetadata({
        title: item.metaTitle,
        description: item.metaDescription,
        url: toolUrl(`${collectionPath}/${item.slug}`),
      });
    },

    Page: async function UseCaseRoute(props: SlugParams) {
      const item = await find(props);
      if (!item) notFound();
      return (
        <UseCasePage
          tool={tool}
          collection={collection}
          useCase={item}
          preview={renderPreview(item.document)}
          siblings={items.filter((other) => other.slug !== item.slug)}
        />
      );
    },

    ogImage: async (props: SlugParams) => {
      const item = await find(props);
      return renderOgImage({
        title: item?.heading ?? collection.title,
        subtitle: `Free example · Edit online in the ${tool.name.toLowerCase()} · Download as PDF`,
        highlights: ["100% free", "No sign-up", "No watermark"],
      });
    },
  };
}
