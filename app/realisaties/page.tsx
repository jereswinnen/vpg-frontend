import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllSolutions, getFilterCategories } from "@/lib/content";
import { ProjectsGrid } from "@/components/shared/ProjectsGrid";
import { FilterBar } from "@/components/forms/FilterBar";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Realisaties | VPG",
  description: "Bekijk onze realisaties en projecten",
};

export default async function RealisatiesPage() {
  const [solutions, filterCategories] = await Promise.all([
    getAllSolutions(),
    getFilterCategories(),
  ]);

  return (
    <div className="py-16">
      <div className="o-grid">
        <div className="col-span-full">
          <h1 className="mb-8">Realisaties</h1>
          <Suspense fallback={<Spinner className="mx-auto" />}>
            <FilterBar categories={filterCategories} />
            <ProjectsGrid solutions={solutions} categories={filterCategories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
