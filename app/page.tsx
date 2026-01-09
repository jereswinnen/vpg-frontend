import { getHomepage } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <p className="col-span-full text-muted-foreground text-center py-12">
        No homepage content found.
      </p>
    );
  }

  const sections = (page.sections || []) as any[];
  const headerImage = page.header_image as any;

  return <SectionRenderer sections={sections} headerImage={headerImage} />;
}
