import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";

export const metadata: Metadata = {
  title: "Contact | VPG",
  description: "Neem contact met ons op",
};

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
