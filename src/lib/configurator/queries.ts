import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";
import type {
  ConfiguratorQuestion,
  ConfiguratorPricing,
  QuoteSubmission,
  CreateQuoteSubmissionInput,
} from "./types";

const sql = neon(process.env.DATABASE_URL!);

// Cache tags for on-demand revalidation
export const CONFIGURATOR_CACHE_TAGS = {
  questions: "configurator-questions",
  pricing: "configurator-pricing",
  steps: "configurator-steps",
} as const;

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
// Questions - Public Queries
// =============================================================================

/**
 * Get questions for a specific product (or all products if null)
 * Returns questions that apply to all products (product_slug IS NULL) + product-specific ones
 */
async function _getQuestionsForProduct(
  productSlug: string | null,
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorQuestion[]> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return [];

  let rows;
  if (productSlug) {
    // Get questions that apply to all products OR this specific product
    rows = await sql`
      SELECT *
      FROM configurator_questions
      WHERE site_id = ${siteId}
        AND (product_slug IS NULL OR product_slug = ${productSlug})
      ORDER BY order_rank, created_at
    `;
  } else {
    // Get only questions that apply to all products
    rows = await sql`
      SELECT *
      FROM configurator_questions
      WHERE site_id = ${siteId}
        AND product_slug IS NULL
      ORDER BY order_rank, created_at
    `;
  }

  return rows as ConfiguratorQuestion[];
}

export const getQuestionsForProduct = (
  productSlug: string | null,
  siteSlug: string = DEFAULT_SITE_SLUG
) =>
  unstable_cache(
    _getQuestionsForProduct,
    [`configurator-questions-${siteSlug}-${productSlug || "all"}`],
    {
      tags: [CONFIGURATOR_CACHE_TAGS.questions],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(productSlug, siteSlug);

/**
 * Get questions for a category by slug (public, cached)
 */
async function _getQuestionsForCategory(
  categorySlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorQuestion[]> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return [];

  const rows = await sql`
    SELECT q.*
    FROM configurator_questions q
    JOIN configurator_categories c ON q.category_id = c.id
    WHERE q.site_id = ${siteId}
      AND c.slug = ${categorySlug}
    ORDER BY q.order_rank, q.created_at
  `;

  return rows as ConfiguratorQuestion[];
}

export const getQuestionsForCategory = (
  categorySlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
) =>
  unstable_cache(
    _getQuestionsForCategory,
    [`configurator-questions-category-${siteSlug}-${categorySlug}`],
    {
      tags: [CONFIGURATOR_CACHE_TAGS.questions],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(categorySlug, siteSlug);

// =============================================================================
// Pricing - Public Queries
// =============================================================================

/**
 * Get pricing configuration for a specific product
 */
async function _getPricingForProduct(
  productSlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorPricing | null> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return null;

  const rows = await sql`
    SELECT *
    FROM configurator_pricing
    WHERE site_id = ${siteId}
      AND product_slug = ${productSlug}
  `;

  return (rows[0] as ConfiguratorPricing) || null;
}

export const getPricingForProduct = (
  productSlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
) =>
  unstable_cache(
    _getPricingForProduct,
    [`configurator-pricing-${siteSlug}-${productSlug}`],
    {
      tags: [CONFIGURATOR_CACHE_TAGS.pricing],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(productSlug, siteSlug);

/**
 * Get pricing for a category by slug (public, cached)
 */
async function _getPricingForCategory(
  categorySlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
): Promise<ConfiguratorPricing | null> {
  const siteId = await getSiteIdBySlug(siteSlug);
  if (!siteId) return null;

  const rows = await sql`
    SELECT p.*
    FROM configurator_pricing p
    JOIN configurator_categories c ON p.category_id = c.id
    WHERE p.site_id = ${siteId}
      AND c.slug = ${categorySlug}
  `;

  return (rows[0] as ConfiguratorPricing) || null;
}

export const getPricingForCategory = (
  categorySlug: string,
  siteSlug: string = DEFAULT_SITE_SLUG
) =>
  unstable_cache(
    _getPricingForCategory,
    [`configurator-pricing-category-${siteSlug}-${categorySlug}`],
    {
      tags: [CONFIGURATOR_CACHE_TAGS.pricing],
      revalidate: false, // Only revalidate via revalidateTag() when admin publishes
    }
  )(categorySlug, siteSlug);

// =============================================================================
// Quote Submissions
// =============================================================================

/**
 * Create a quote submission
 */
export async function createQuoteSubmission(
  siteId: string,
  input: CreateQuoteSubmissionInput
): Promise<QuoteSubmission> {
  const rows = await sql`
    INSERT INTO quote_submissions (
      configuration,
      price_estimate_min,
      price_estimate_max,
      contact_name,
      contact_email,
      contact_phone,
      contact_address,
      appointment_id,
      site_id
    ) VALUES (
      ${JSON.stringify(input.configuration)},
      ${input.price_estimate_min ?? null},
      ${input.price_estimate_max ?? null},
      ${input.contact_name},
      ${input.contact_email},
      ${input.contact_phone ?? null},
      ${input.contact_address ?? null},
      ${input.appointment_id ?? null},
      ${siteId}
    )
    RETURNING *
  `;
  return rows[0] as QuoteSubmission;
}
