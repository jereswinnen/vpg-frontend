import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact | VPG",
  description: "Neem contact met ons op",
};

export default async function ContactPage() {
  const page = await getPageBySlug("contact");

  return (
    <>
      {page?.sections && page.sections.length > 0 && (
        <SectionRenderer sections={page.sections} />
      )}
      <div className="o-grid py-16">
        <div className="col-span-full md:col-span-6">
          <h2 className="mb-6">Stuur ons een bericht</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
