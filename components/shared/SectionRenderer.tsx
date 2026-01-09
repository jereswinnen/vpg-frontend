import type { Section } from "@/types/sections";

// Section components will be added in Phase 5
// import { PageHeader } from "@/components/sections/PageHeader";
// import { SlideshowSection } from "@/components/sections/SlideshowSection";
// import { SplitSection } from "@/components/sections/SplitSection";
// import { UspSection } from "@/components/sections/UspSection";
// import { SolutionsScroller } from "@/components/sections/SolutionsScroller";
// import { FlexibleSection } from "@/components/sections/FlexibleSection";

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        // Placeholder - section components will be added in Phase 5
        return (
          <div
            key={section._key}
            className="o-grid py-8 text-muted-foreground"
          >
            <div className="col-span-full rounded border border-dashed p-4">
              <p className="text-sm">
                Section: <strong>{section._type}</strong>
              </p>
              <p className="text-xs">
                (Component will be implemented in Phase 5)
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}
