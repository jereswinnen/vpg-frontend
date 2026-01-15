import { getHomepage } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage();
  return buildMetadata({
    title: page?.meta_title || page?.title,
    description: page?.meta_description,
    path: "/",
    image: (page?.header_image as any)?.url,
  });
}

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <p className="col-span-full text-muted-foreground text-center py-12">
        No homepage content found.
      </p>
    );
  }

  return (
    <SectionRenderer
      sections={page.sections || []}
      headerImage={page.header_image}
    />
  );
}
