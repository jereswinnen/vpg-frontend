import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

// =============================================================================
// Types
// =============================================================================

export interface ConfiguratorCategory {
  id: string;
  name: string;
  slug: string;
  order_rank: number;
  site_id: string;
  created_at: Date;
  updated_at: Date;
}

// Cache tags for on-demand revalidation
export const CATEGORIES_CACHE_TAG = "configurator-categories";

// Default site slug
const DEFAULT_SITE_SLUG = "vpg";

// =============================================================================
// Site ID Helper
// =============================================================================

async function _getSiteIdBySlug(slug: string): Promise<string | null> {
  const rows = await sql`SELECT id FROM sites WHERE slug = ${slug}`;
  return rows[0]?.id || null;
}

const getSiteIdBySlug = (slug: string) =>
  unstable_cache(_getSiteIdBySlug, [`site-id-${slug}`], {
    revalidate: 86400,
  })(slug);

// =============================================================================
// Public Queries (cached)
// =============================================================================

/**
 * Get all categories for a site (public, cached)
 */
async function _getCategoriesForSite(
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorCategory[]> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return [];

  const rows = await sql`
    SELECT *
    FROM configurator_categories
    WHERE site_id = ${siteId}
    ORDER BY order_rank, name
  `;

  return rows as ConfiguratorCategory[];
}

export const getCategoriesForSite = (siteSlug: string = DEFAULT_SITE_SLUG) =>
  unstable_cache(
    _getCategoriesForSite,
    [`configurator-categories-${siteSlug}`],
    {
      tags: [CATEGORIES_CACHE_TAG],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(siteSlug);

/**
 * Get a category by slug (public, cached)
 */
async function _getCategoryBySlug(
  slug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorCategory | null> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return null;

  const rows = await sql`
    SELECT *
    FROM configurator_categories
    WHERE site_id = ${siteId}
      AND slug = ${slug}
  `;

  return (rows[0] as ConfiguratorCategory) || null;
}

export const getCategoryBySlug = (
  slug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
) =>
  unstable_cache(
    _getCategoryBySlug,
    [`configurator-category-slug-${siteSlug}-${slug}`],
    {
      tags: [CATEGORIES_CACHE_TAG],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(slug, siteSlug);
