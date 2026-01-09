"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { SolutionListItem, FilterCategory } from "@/types/content";

interface ProjectsGridProps {
  solutions: SolutionListItem[];
  categories: FilterCategory[];
}

export function ProjectsGrid({ solutions, categories }: ProjectsGridProps) {
  const searchParams = useSearchParams();

  // Build active filters map
  const activeFilters: Record<string, string[]> = {};
  categories.forEach((cat) => {
    const value = searchParams.get(cat.slug);
    if (value) {
      activeFilters[cat.id] = value.split(",");
    }
  });

  // Filter solutions
  const filtered =
    Object.keys(activeFilters).length === 0
      ? solutions
      : solutions.filter((solution) => {
          // Must match ALL categories (AND between categories)
          return Object.entries(activeFilters).every(
            ([categoryId, filterSlugs]) => {
              // Must match ANY filter in category (OR within category)
              const solutionFiltersInCategory = solution.filters?.filter(
                (f) => f.category_id === categoryId
              );
              return solutionFiltersInCategory?.some((f) =>
                filterSlugs.includes(f.slug)
              );
            }
          );
        });

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Geen realisaties gevonden met de huidige filters.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((solution) => (
        <Link
          key={solution.id}
          href={`/realisaties/${solution.slug}`}
          className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          {solution.header_image?.url ? (
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={solution.header_image.url}
                alt={solution.header_image.alt || solution.name}
                width={400}
                height={300}
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gray-100">
              <span className="text-muted-foreground">Geen afbeelding</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold">{solution.name}</h3>
            {solution.subtitle && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {solution.subtitle}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
