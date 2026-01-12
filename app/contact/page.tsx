import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { ContactForm } from "@/components/forms/ContactForm";

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
      <div className="col-span-full md:col-span-6">
        <h2 className="mb-6">Stuur ons een bericht</h2>
        <ContactForm />
      </div>
    </section>
  );
}
