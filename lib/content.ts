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

// Cache configuration for Next.js
const CACHE_OPTIONS: RequestInit = {
  next: { revalidate: 3600 }, // 1 hour
};

async function fetchAPI<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  const searchParams = new URLSearchParams({ site: SITE, ...params });
  const url = `${API_BASE}${endpoint}?${searchParams}`;

  try {
    const res = await fetch(url, CACHE_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

// Pages
export async function getHomepage(): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/homepage");
  return data?.page || null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/page", { slug });
  return data?.page || null;
}

// Solutions
export async function getAllSolutions(): Promise<SolutionListItem[]> {
  const data = await fetchAPI<{ solutions: SolutionListItem[] }>("/solutions");
  return data?.solutions || [];
}

export async function getSolutionBySlug(
  slug: string,
): Promise<Solution | null> {
  const data = await fetchAPI<{ solution: Solution }>("/solutions", { slug });
  return data?.solution || null;
}

// Navigation & Filters
export async function getNavigation(
  location: "header" | "footer",
): Promise<NavigationLink[]> {
  const data = await fetchAPI<{ navigation: NavigationLink[] }>("/navigation", {
    location,
  });
  return data?.navigation || [];
}

export async function getFilterCategories(): Promise<FilterCategory[]> {
  const data = await fetchAPI<{ categories: FilterCategory[] }>("/filters");
  return data?.categories || [];
}

// Site Parameters
export async function getSiteParameters(): Promise<SiteParameters | null> {
  const data = await fetchAPI<{ parameters: SiteParameters }>("/parameters");
  return data?.parameters || null;
}
