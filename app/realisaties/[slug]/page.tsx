import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSolutionBySlug } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

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

  return (
    <>
      {solution.sections && solution.sections.length > 0 ? (
        <SectionRenderer sections={solution.sections} />
      ) : (
        <div className="py-16">
          <div className="o-grid">
            <div className="col-span-full">
              <h1>{solution.name}</h1>
              {solution.subtitle && (
                <p className="mt-4 text-muted-foreground">{solution.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
