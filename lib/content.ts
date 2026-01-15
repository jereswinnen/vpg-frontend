import { unstable_cache } from "next/cache";
import type {
  Page,
  Solution,
  SolutionListItem,
  FilterCategory,
  NavigationLink,
  SiteParameters,
} from "@/types/content";

function getApiBase() {
  // Explicit override takes priority
  if (process.env.CONTENT_API_URL) {
    return process.env.CONTENT_API_URL;
  }
  // Local development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/content";
  }
  // Production default (use Vercel app URL as assymo.be doesn't route API)
  return "https://assymo-frontend.vercel.app/api/content";
}

const API_BASE = getApiBase();
const SITE = process.env.SITE_SLUG || "vpg";

// Cache tags for on-demand revalidation
export const CACHE_TAGS = {
  pages: "pages",
  solutions: "solutions",
  filters: "filters",
  navigation: "navigation",
  siteParameters: "site-parameters",
} as const;

async function fetchAPI<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  const searchParams = new URLSearchParams({ site: SITE, ...params });
  const url = `${API_BASE}${endpoint}?${searchParams}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

// =============================================================================
// Pages
// =============================================================================

async function _getHomepage(): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/homepage");
  return data?.page || null;
}

export const getHomepage = () =>
  unstable_cache(_getHomepage, ["homepage"], {
    tags: [CACHE_TAGS.pages],
    revalidate: 3600,
  })();

async function _getPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/page", { slug });
  return data?.page || null;
}

export const getPageBySlug = (slug: string) =>
  unstable_cache(_getPageBySlug, [`page-${slug}`], {
    tags: [CACHE_TAGS.pages],
    revalidate: 3600,
  })(slug);

// =============================================================================
// Solutions
// =============================================================================

async function _getAllSolutions(): Promise<SolutionListItem[]> {
  const data = await fetchAPI<{ solutions: SolutionListItem[] }>("/solutions");
  return data?.solutions || [];
}

export const getAllSolutions = () =>
  unstable_cache(_getAllSolutions, ["all-solutions"], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 3600,
  })();

async function _getSolutionBySlug(slug: string): Promise<Solution | null> {
  const data = await fetchAPI<{ solution: Solution }>("/solutions", { slug });
  return data?.solution || null;
}

export const getSolutionBySlug = (slug: string) =>
  unstable_cache(_getSolutionBySlug, [`solution-${slug}`], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 3600,
  })(slug);

// =============================================================================
// Navigation & Filters
// =============================================================================

async function _getNavigation(
  location: "header" | "footer",
): Promise<NavigationLink[]> {
  const data = await fetchAPI<{ navigation: NavigationLink[] }>("/navigation", {
    location,
  });
  return data?.navigation || [];
}

export const getNavigation = (location: "header" | "footer") =>
  unstable_cache(_getNavigation, [`navigation-${location}`], {
    tags: [CACHE_TAGS.navigation],
    revalidate: 3600,
  })(location);

async function _getFilterCategories(): Promise<FilterCategory[]> {
  const data = await fetchAPI<{ categories: FilterCategory[] }>("/filters");
  return data?.categories || [];
}

export const getFilterCategories = () =>
  unstable_cache(_getFilterCategories, ["filter-categories"], {
    tags: [CACHE_TAGS.filters],
    revalidate: 3600,
  })();

// =============================================================================
// Site Parameters
// =============================================================================

async function _getSiteParameters(): Promise<SiteParameters | null> {
  const data = await fetchAPI<{ parameters: SiteParameters }>("/parameters");
  return data?.parameters || null;
}

export const getSiteParameters = () =>
  unstable_cache(_getSiteParameters, ["site-parameters"], {
    tags: [CACHE_TAGS.siteParameters],
    revalidate: 3600,
  })();
