import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSolutionBySlug } from "@/lib/content";
import SectionRenderer from "@/components/shared/SectionRenderer";

interface SolutionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    return { title: "Solution Not Found" };
  }

  return {
    title: solution.meta_title || `${solution.name} | VPG`,
    description: solution.meta_description || solution.subtitle,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const sections = solution.sections || [];

  if (sections.length > 0) {
    return (
      <SectionRenderer
        sections={sections}
        headerImage={solution.header_image}
      />
    );
  }

  return (
    <>
      <h1>{solution.name}</h1>
      {solution.subtitle && (
        <p className="col-span-full text-muted-foreground">{solution.subtitle}</p>
      )}
    </>
  );
}
