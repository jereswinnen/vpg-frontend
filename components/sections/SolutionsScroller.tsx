import { getAllSolutions } from "@/lib/content";
import { SolutionsScrollerClient } from "./SolutionsScrollerClient";
import type { SolutionsScrollerSection } from "@/types/sections";

interface SolutionsScrollerProps {
  section: SolutionsScrollerSection;
}

export async function SolutionsScroller({ section }: SolutionsScrollerProps) {
  const solutions = await getAllSolutions();

  const solutionsWithUrls = solutions.map((solution) => ({
    id: solution.id,
    name: solution.name,
    subtitle: solution.subtitle,
    slug: solution.slug,
    imageUrl: solution.header_image?.url,
    imageAlt: solution.header_image?.alt,
  }));

  return (
    <SolutionsScrollerClient
      title={section.title}
      solutions={solutionsWithUrls}
    />
  );
}
