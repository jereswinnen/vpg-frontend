export type SectionType =
  | "pageHeader"
  | "slideshow"
  | "splitSection"
  | "uspSection"
  | "solutionsScroller"
  | "flexibleSection"
  | "solutionHighlight";

export interface BaseSection {
  _key: string;
  _type: SectionType;
}

export interface PageHeaderSection extends BaseSection {
  _type: "pageHeader";
  title?: string;
  subtitle?: string;
  buttons?: ActionButton[];
  image?: { url: string; alt?: string };
}

export interface SlideshowSection extends BaseSection {
  _type: "slideshow";
  slides: Array<{
    image: { url: string; alt?: string };
    caption?: string;
  }>;
}

export interface SplitSection extends BaseSection {
  _type: "splitSection";
  blockLeft: SplitBlock;
  blockRight: SplitBlock;
}

export interface SplitBlock {
  type: "text" | "image" | "empty";
  title?: string;
  subtitle?: string;
  actions?: ActionButton[];
  images?: Array<{ url: string; alt?: string }>;
}

export interface UspSection extends BaseSection {
  _type: "uspSection";
  items: UspItem[];
}

export interface UspItem {
  icon?: string;
  title: string;
  description?: string;
}

export interface SolutionsScrollerSection extends BaseSection {
  _type: "solutionsScroller";
  heading?: string;
  subtitle?: string;
  filterCategoryId?: string;
  filterSlug?: string;
}

export interface SolutionHighlightSection extends BaseSection {
  _type: "solutionHighlight";
  solutionId?: string;
  subtitle?: string; // HTML from Tiptap
}

export interface FlexibleSection extends BaseSection {
  _type: "flexibleSection";
  layout: "1-col" | "2-col-equal" | "2-col-left-wide" | "2-col-right-wide";
  blockMain: FlexBlock;
  blockLeft?: FlexBlock;
  blockRight?: FlexBlock;
}

export interface FlexBlock {
  type: "text" | "image" | "map" | "form";
  title?: string;
  content?: string;
  button?: ActionButton;
  image?: { url: string; alt?: string };
}

export interface ActionButton {
  label: string;
  url?: string;
  icon?: string;
  variant?: "primary" | "secondary";
  action?: "openChatbot" | "link";
}

export type Section =
  | PageHeaderSection
  | SlideshowSection
  | SplitSection
  | UspSection
  | SolutionsScrollerSection
  | FlexibleSection
  | SolutionHighlightSection;

export function getSectionLabel(type: SectionType): string {
  const labels: Record<SectionType, string> = {
    pageHeader: "Page Header",
    slideshow: "Slideshow",
    splitSection: "Split Section",
    uspSection: "USP Section",
    solutionsScroller: "Solutions Scroller",
    flexibleSection: "Flexible Section",
    solutionHighlight: "Realisatie",
  };
  return labels[type];
}
