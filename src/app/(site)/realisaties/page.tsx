import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getPageBySlug,
  getAllSolutions,
  getFilterCategories,
} from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";
import { ProjectsGrid } from "@/components/shared/ProjectsGrid";
import { buildMetadata } from "@/lib/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("realisaties");
  return buildMetadata({
    title: page?.title || "Realisaties",
    description: page?.meta_description,
    path: "/realisaties",
    image: (page?.header_image as any)?.url,
  });
}

export default async function RealisatiesPage() {
  const [page, solutions, categories] = await Promise.all([
    getPageBySlug("realisaties"),
    getAllSolutions(),
    getFilterCategories(),
  ]);

  const sections = page?.sections || [];

  return (
    <section className="col-span-full grid grid-cols-subgrid gap-y-14">
      {sections.length > 0 && (
        <SectionRenderer sections={sections} headerImage={page?.header_image} />
      )}

      <Suspense
        fallback={
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
            {solutions.slice(0, 6).map((solution) => (
              <div key={solution.id} className="flex flex-col gap-4 p-4">
                <div className="aspect-5/3 bg-zinc-100 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-3/4 bg-zinc-100 animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-zinc-100 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <ProjectsGrid
          solutions={solutions}
          categories={categories}
        />
      </Suspense>
    </section>
  );
}
