import { getHomepage } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No homepage content found.</p>
      </div>
    );
  }

  return (
    <div className="o-grid py-8 md:py-12">
      <SectionRenderer sections={page.sections} />
    </div>
  );
}
