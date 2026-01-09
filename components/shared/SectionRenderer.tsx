import type { Section } from "@/types/sections";
import { PageHeader } from "@/components/sections/PageHeader";
import { SlideshowSection } from "@/components/sections/SlideshowSection";
import { SplitSection } from "@/components/sections/SplitSection";
import { UspSection } from "@/components/sections/UspSection";
import { SolutionsScroller } from "@/components/sections/SolutionsScroller";
import { FlexibleSection } from "@/components/sections/FlexibleSection";

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "pageHeader":
            return <PageHeader key={section._key} section={section} />;
          case "slideshow":
            return <SlideshowSection key={section._key} section={section} />;
          case "splitSection":
            return <SplitSection key={section._key} section={section} />;
          case "uspSection":
            return <UspSection key={section._key} section={section} />;
          case "solutionsScroller":
            return <SolutionsScroller key={section._key} section={section} />;
          case "flexibleSection":
            return <FlexibleSection key={section._key} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
