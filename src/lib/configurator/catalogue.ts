import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";
import type { PriceCatalogueItem } from "./types";

const sql = neon(process.env.DATABASE_URL!);

// Cache tags for on-demand revalidation
export const CATALOGUE_CACHE_TAG = "configurator-catalogue";

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
 * Get all catalogue items for a site (public, cached)
 */
async function _getCatalogueItemsForSite(
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<PriceCatalogueItem[]> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return [];

  const rows = await sql`
    SELECT *
    FROM configurator_price_catalogue
    WHERE site_id = ${siteId}
    ORDER BY category, name
  `;

  return rows as PriceCatalogueItem[];
}

export const getCatalogueItemsForSite = (siteSlug: string = DEFAULT_SITE_SLUG) =>
  unstable_cache(
    _getCatalogueItemsForSite,
    [`configurator-catalogue-${siteSlug}`],
    {
      tags: [CATALOGUE_CACHE_TAG],
      revalidate: 300,
    }
  )(siteSlug);
