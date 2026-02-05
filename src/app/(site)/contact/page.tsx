import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { buildMetadata } from "@/lib/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  return buildMetadata({
    title: page?.title || "Contact",
    description: page?.meta_description,
    path: "/contact",
    image: (page?.header_image as any)?.url,
  });
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact");

  const sections = page?.sections || [];

  return (
    <section className="col-span-full grid grid-cols-subgrid gap-y-14">
      {sections.length > 0 && (
        <SectionRenderer sections={sections} headerImage={page?.header_image} />
      )}
    </section>
  );
}
