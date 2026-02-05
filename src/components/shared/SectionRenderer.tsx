import SlideshowSection from "../sections/SlideshowSection";
import PageHeader from "../sections/PageHeader";
import { SplitSection } from "../sections/SplitSection";
import UspSection from "../sections/UspSection";
import SolutionsScroller from "../sections/SolutionsScroller";
import FlexibleSection from "../sections/FlexibleSection";
import SolutionHighlight from "../sections/SolutionHighlight";
import type { FlexibleSectionData } from "../sections/FlexibleSection/types";

// Image type with direct URL
interface ImageWithUrl {
  url: string;
  alt?: string;
}

// Section type definitions using discriminated unions
// Each section has a _type field that narrows the type in the switch
interface BaseSection {
  _key?: string;
}

interface SlideshowImage {
  _key: string;
  image: { url: string; alt?: string };
  caption?: string;
}

interface SlideshowSectionType extends BaseSection {
  _type: "slideshow";
  background?: boolean;
  images?: SlideshowImage[];
}

interface PageHeaderSection extends BaseSection {
  _type: "pageHeader";
  title?: string;
  subtitle?: string;
  background?: boolean;
  showImage?: boolean;
  showButtons?: boolean;
  buttons?: {
    label: string;
    url?: string;
    icon?: string;
    variant?: "primary" | "secondary";
  }[];
}

interface SplitItem {
  image?: ImageWithUrl;
  title: string;
  subtitle?: string;
  href: string;
  action?: {
    label: string;
    icon?: string;
    variant?: "primary" | "secondary";
  };
}

interface SplitSectionType extends BaseSection {
  _type: "splitSection";
  items: [SplitItem, SplitItem];
}

interface UspSectionType extends BaseSection {
  _type: "uspSection";
  heading?: string;
  usps?: {
    icon?: string;
    title: string;
    text?: string;
    link?: {
      label?: string;
      url?: string;
    };
  }[];
}

interface SolutionsScrollerSection extends BaseSection {
  _type: "solutionsScroller";
  heading?: string;
  subtitle?: string;
}

interface SolutionHighlightSection extends BaseSection {
  _type: "solutionHighlight";
  solutionId?: string;
  subtitle?: string;
}

type FlexibleSectionType = FlexibleSectionData;

interface SectionRendererProps {
  // Accept generic section array - type narrowing happens in the switch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: Array<{ _type: string; _key?: string; [key: string]: any }>;
  headerImage?: ImageWithUrl;
}

export default function SectionRenderer({
  sections,
  headerImage,
}: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = section._key || `section-${index}`;

        switch (section._type) {
          case "slideshow":
            return (
              <SlideshowSection
                key={key}
                section={section as SlideshowSectionType}
              />
            );

          case "pageHeader":
            return (
              <PageHeader
                key={key}
                section={section as PageHeaderSection}
                headerImage={headerImage}
              />
            );

          case "splitSection":
            return (
              <SplitSection key={key} section={section as SplitSectionType} />
            );

          case "uspSection":
            return <UspSection key={key} section={section as UspSectionType} />;

          case "solutionsScroller":
            return (
              <SolutionsScroller
                key={key}
                section={section as SolutionsScrollerSection}
              />
            );

          case "flexibleSection":
            return (
              <FlexibleSection
                key={key}
                section={section as FlexibleSectionType}
              />
            );

          case "solutionHighlight":
            return (
              <SolutionHighlight
                key={key}
                section={section as SolutionHighlightSection}
              />
            );

          default:
            console.warn(`Unknown section type: ${section._type}`);
            return null;
        }
      })}
    </>
  );
}

export { SectionRenderer };
