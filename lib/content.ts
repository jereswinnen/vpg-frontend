import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";
import type {
  Page,
  Solution,
  SolutionListItem,
  FilterCategory,
  NavigationLink,
  SiteParameters,
} from "@/types/content";

const sql = neon(process.env.DATABASE_URL!);

// Cache tags for on-demand revalidation
export const CACHE_TAGS = {
  pages: "pages",
  solutions: "solutions",
  filters: "filters",
  navigation: "navigation",
  siteParameters: "site-parameters",
} as const;

// Site slug for VPG
const SITE_SLUG = "vpg";

/**
 * Get site ID from slug (cached)
 */
async function _getSiteIdBySlug(slug: string): Promise<string | null> {
  const rows = await sql`SELECT id FROM sites WHERE slug = ${slug}`;
  return rows[0]?.id || null;
}

const getSiteIdBySlug = (slug: string) =>
  unstable_cache(_getSiteIdBySlug, [`site-id-${slug}`], {
    revalidate: 86400, // 24 hours - sites rarely change
  })(slug);

// =============================================================================
// Pages
// =============================================================================

async function _getHomepage(): Promise<Page | null> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return null;

  const rows = await sql`
    SELECT p.*, im.alt_text as header_image_alt
    FROM pages p
    LEFT JOIN image_metadata im ON im.url = p.header_image->>'url'
    WHERE p.is_homepage = true AND p.site_id = ${siteId}
    LIMIT 1
  `;

  if (!rows[0]) return null;

  const page = rows[0] as Page & { header_image_alt?: string };
  if (page.header_image && page.header_image_alt) {
    page.header_image.alt = page.header_image_alt;
  }
  delete page.header_image_alt;

  if (page.sections && Array.isArray(page.sections)) {
    page.sections = await enrichSectionsWithAltText(page.sections);
  }

  return page as Page;
}

export const getHomepage = () =>
  unstable_cache(_getHomepage, [`homepage-${SITE_SLUG}`], {
    tags: [CACHE_TAGS.pages],
    revalidate: 60,
  })();

async function _getPageBySlug(slug: string): Promise<Page | null> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return null;

  const rows = await sql`
    SELECT p.*, im.alt_text as header_image_alt
    FROM pages p
    LEFT JOIN image_metadata im ON im.url = p.header_image->>'url'
    WHERE p.slug = ${slug} AND p.site_id = ${siteId}
  `;

  if (!rows[0]) return null;

  const page = rows[0] as Page & { header_image_alt?: string };
  if (page.header_image && page.header_image_alt) {
    page.header_image.alt = page.header_image_alt;
  }
  delete page.header_image_alt;

  if (page.sections && Array.isArray(page.sections)) {
    page.sections = await enrichSectionsWithAltText(page.sections);
  }

  return page as Page;
}

export const getPageBySlug = (slug: string) =>
  unstable_cache(_getPageBySlug, [`page-${SITE_SLUG}-${slug}`], {
    tags: [CACHE_TAGS.pages],
    revalidate: 60,
  })(slug);

// =============================================================================
// Solutions
// =============================================================================

async function _getAllSolutions(): Promise<SolutionListItem[]> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return [];

  const rows = await sql`
    SELECT
      s.id,
      s.name,
      s.subtitle,
      s.slug,
      s.header_image,
      s.order_rank,
      im.alt_text as header_image_alt,
      COALESCE(
        json_agg(
          json_build_object('id', f.id, 'name', f.name, 'slug', f.slug, 'category_id', f.category_id)
        ) FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) as filters
    FROM solutions s
    LEFT JOIN solution_filters sf ON s.id = sf.solution_id
    LEFT JOIN filters f ON sf.filter_id = f.id
    LEFT JOIN image_metadata im ON im.url = s.header_image->>'url'
    WHERE s.site_id = ${siteId}
    GROUP BY s.id, im.alt_text
    ORDER BY s.order_rank
  `;

  return rows.map((row) => {
    const solution = row as SolutionListItem & { header_image_alt?: string };
    if (solution.header_image && solution.header_image_alt) {
      solution.header_image.alt = solution.header_image_alt;
    }
    delete solution.header_image_alt;
    return solution as SolutionListItem;
  });
}

export const getAllSolutions = () =>
  unstable_cache(_getAllSolutions, [`all-solutions-${SITE_SLUG}`], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 60,
  })();

async function _getSolutionBySlug(slug: string): Promise<Solution | null> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return null;

  const rows = await sql`
    SELECT s.*,
      im.alt_text as header_image_alt,
      COALESCE(
        json_agg(
          json_build_object('id', f.id, 'name', f.name, 'slug', f.slug)
        ) FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) as filters
    FROM solutions s
    LEFT JOIN solution_filters sf ON s.id = sf.solution_id
    LEFT JOIN filters f ON sf.filter_id = f.id
    LEFT JOIN image_metadata im ON im.url = s.header_image->>'url'
    WHERE s.slug = ${slug} AND s.site_id = ${siteId}
    GROUP BY s.id, im.alt_text
  `;

  if (!rows[0]) return null;

  const solution = rows[0] as Solution & { header_image_alt?: string };
  if (solution.header_image && solution.header_image_alt) {
    solution.header_image.alt = solution.header_image_alt;
  }
  delete solution.header_image_alt;

  if (solution.sections && Array.isArray(solution.sections)) {
    solution.sections = await enrichSectionsWithAltText(solution.sections);
  }

  return solution as Solution;
}

export const getSolutionBySlug = (slug: string) =>
  unstable_cache(_getSolutionBySlug, [`solution-${SITE_SLUG}-${slug}`], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 60,
  })(slug);

// =============================================================================
// Navigation & Filters
// =============================================================================

async function _getNavigation(
  location: "header" | "footer"
): Promise<NavigationLink[]> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return [];

  const rows = await sql`
    SELECT nl.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ns.id,
            'solution', CASE
              WHEN s.id IS NOT NULL THEN json_build_object(
                'name', s.name,
                'slug', s.slug,
                'header_image', s.header_image
              )
              ELSE NULL
            END
          ) ORDER BY ns.order_rank
        ) FILTER (WHERE ns.id IS NOT NULL),
        '[]'
      ) as sub_items
    FROM navigation_links nl
    LEFT JOIN navigation_subitems ns ON nl.id = ns.link_id
    LEFT JOIN solutions s ON ns.solution_id = s.id
    WHERE nl.location = ${location} AND nl.site_id = ${siteId}
    GROUP BY nl.id
    ORDER BY nl.order_rank
  `;

  const navLinks = rows as NavigationLink[];

  // Collect all solution header image URLs for alt text lookup
  const imageUrls: string[] = [];
  for (const link of navLinks) {
    if (link.sub_items) {
      for (const subItem of link.sub_items) {
        if (subItem.solution?.header_image?.url) {
          imageUrls.push(subItem.solution.header_image.url);
        }
      }
    }
  }

  if (imageUrls.length === 0) return navLinks;

  // Batch fetch alt texts
  const altTextRows = (await sql`
    SELECT url, alt_text FROM image_metadata WHERE url = ANY(${imageUrls})
  `) as { url: string; alt_text: string | null }[];

  const altTextMap = new Map(
    altTextRows.filter((r) => r.alt_text).map((r) => [r.url, r.alt_text!])
  );

  // Merge alt texts into navigation
  for (const link of navLinks) {
    if (link.sub_items) {
      for (const subItem of link.sub_items) {
        if (subItem.solution?.header_image?.url) {
          const alt = altTextMap.get(subItem.solution.header_image.url);
          if (alt) {
            subItem.solution.header_image.alt = alt;
          }
        }
      }
    }
  }

  return navLinks;
}

export const getNavigation = (location: "header" | "footer") =>
  unstable_cache(_getNavigation, [`navigation-${SITE_SLUG}-${location}`], {
    tags: [CACHE_TAGS.navigation],
    revalidate: 60,
  })(location);

async function _getFilterCategories(): Promise<FilterCategory[]> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return [];

  const rows = await sql`
    SELECT fc.*,
      COALESCE(
        json_agg(
          json_build_object('id', f.id, 'name', f.name, 'slug', f.slug)
          ORDER BY f.order_rank
        ) FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) as filters
    FROM filter_categories fc
    LEFT JOIN filters f ON fc.id = f.category_id
    WHERE fc.site_id = ${siteId}
    GROUP BY fc.id
    ORDER BY fc.order_rank
  `;

  return rows as FilterCategory[];
}

export const getFilterCategories = () =>
  unstable_cache(_getFilterCategories, [`filter-categories-${SITE_SLUG}`], {
    tags: [CACHE_TAGS.filters],
    revalidate: 60,
  })();

// =============================================================================
// Site Parameters
// =============================================================================

async function _getSiteParameters(): Promise<SiteParameters | null> {
  const siteId = await getSiteIdBySlug(SITE_SLUG);
  if (!siteId) return null;

  const rows = await sql`
    SELECT * FROM site_parameters WHERE site_id = ${siteId}
  `;

  return (rows[0] as SiteParameters) || null;
}

export const getSiteParameters = () =>
  unstable_cache(_getSiteParameters, [`site-parameters-${SITE_SLUG}`], {
    tags: [CACHE_TAGS.siteParameters],
    revalidate: 60,
  })();

// =============================================================================
// Image Alt Text Helpers
// =============================================================================

interface ImageMetadataRow {
  url: string;
  alt_text: string | null;
}

async function getImageAltTexts(urls: string[]): Promise<Map<string, string>> {
  if (urls.length === 0) return new Map();

  try {
    const rows = (await sql`
      SELECT url, alt_text FROM image_metadata WHERE url = ANY(${urls})
    `) as ImageMetadataRow[];

    const map = new Map<string, string>();
    for (const row of rows) {
      if (row.alt_text) {
        map.set(row.url, row.alt_text);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

function extractImageUrlsFromSections(sections: unknown[]): string[] {
  const urls: string[] = [];

  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const s = section as Record<string, unknown>;

    // Slideshow images
    if (s._type === "slideshow" && Array.isArray(s.images)) {
      for (const item of s.images) {
        if (item?.image?.url) urls.push(item.image.url);
      }
    }

    // Split section items
    if (s._type === "splitSection" && Array.isArray(s.items)) {
      for (const item of s.items) {
        if (item?.image?.url) urls.push(item.image.url);
      }
    }

    // Flexible section blocks
    if (s._type === "flexibleSection") {
      const blocks = [
        ...(Array.isArray(s.blockMain) ? s.blockMain : []),
        ...(Array.isArray(s.blockLeft) ? s.blockLeft : []),
        ...(Array.isArray(s.blockRight) ? s.blockRight : []),
      ];
      for (const block of blocks) {
        if (block?._type === "flexImageBlock" && block?.image?.url) {
          urls.push(block.image.url);
        }
      }
    }
  }

  return urls;
}

async function enrichSectionsWithAltText<T>(sections: T[]): Promise<T[]> {
  if (!sections || sections.length === 0) return sections;

  const urls = extractImageUrlsFromSections(sections as unknown[]);
  if (urls.length === 0) return sections;

  const altTexts = await getImageAltTexts(urls);
  if (altTexts.size === 0) return sections;

  const enriched = JSON.parse(JSON.stringify(sections)) as Record<
    string,
    unknown
  >[];

  for (const section of enriched) {
    if (!section || typeof section !== "object") continue;

    // Slideshow images
    if (section._type === "slideshow" && Array.isArray(section.images)) {
      for (const item of section.images) {
        if (item?.image?.url && altTexts.has(item.image.url)) {
          item.image.alt = altTexts.get(item.image.url);
        }
      }
    }

    // Split section items
    if (section._type === "splitSection" && Array.isArray(section.items)) {
      for (const item of section.items) {
        if (item?.image?.url && altTexts.has(item.image.url)) {
          item.image.alt = altTexts.get(item.image.url);
        }
      }
    }

    // Flexible section blocks
    if (section._type === "flexibleSection") {
      const blockArrays = ["blockMain", "blockLeft", "blockRight"];
      for (const blockArrayName of blockArrays) {
        const blocks = section[blockArrayName];
        if (Array.isArray(blocks)) {
          for (const block of blocks) {
            if (
              block?._type === "flexImageBlock" &&
              block?.image?.url &&
              altTexts.has(block.image.url)
            ) {
              block.image.alt = altTexts.get(block.image.url);
            }
          }
        }
      }
    }
  }

  return enriched as T[];
}
