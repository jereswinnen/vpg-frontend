import type { Section } from "./sections";

export interface ContentImage {
  url: string;
  alt?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  is_homepage?: boolean;
  header_image?: ContentImage;
  sections: Section[];
  meta_title?: string;
  meta_description?: string;
}

export interface Solution {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  header_image?: ContentImage;
  sections?: Section[];
  filters?: SolutionFilter[];
  order_rank?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface SolutionListItem {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  header_image?: ContentImage;
  order_rank?: number;
  filters?: SolutionFilter[];
}

export interface SolutionFilter {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
  order_rank: number;
  filters: Filter[];
}

export interface Filter {
  id: string;
  name: string;
  slug: string;
}

export interface NavigationLink {
  id: string;
  title: string;
  slug: string;
  submenu_heading: string | null;
  location: "header" | "footer";
  order_rank: number;
  sub_items: NavigationSubItem[];
}

export interface NavigationSubItem {
  id: string;
  solution?: {
    name: string;
    slug: string;
    header_image?: ContentImage;
  };
}

export interface SiteParameters {
  id: string;
  site_id: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  vat_number?: string;
}
