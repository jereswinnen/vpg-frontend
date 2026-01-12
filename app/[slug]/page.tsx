import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <SectionRenderer
      sections={page.sections || []}
      headerImage={page.header_image}
    />
  );
}
