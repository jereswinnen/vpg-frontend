// Default configurator configuration
// Used as fallback when no questions/pricing are configured in the database

import type { QuestionOption, PriceModifier } from "@/lib/configurator/types";

// =============================================================================
// Quote Reminder Configuration
// =============================================================================

export const QUOTE_REMINDER_CONFIG = {
  /** Number of days after quote submission to send the reminder */
  daysAfterSubmission: 3,
} as const;

// =============================================================================
// Default Questions (used when database is empty)
// =============================================================================

export interface DefaultQuestion {
  question_key: string;
  label: string;
  type: "single-select" | "multi-select" | "number" | "text";
  options?: QuestionOption[];
  required: boolean;
  order_rank: number;
  /** If null, applies to all products. Otherwise, only for this product slug. */
  product_slug: string | null;
}

/**
 * Default questions that apply to all products
 */
export const DEFAULT_COMMON_QUESTIONS: DefaultQuestion[] = [];

/**
 * Product-specific default questions
 */
export const DEFAULT_PRODUCT_QUESTIONS: Record<string, DefaultQuestion[]> = {};

/**
 * Get all default questions for a product
 */
export function getDefaultQuestions(productSlug: string | null): DefaultQuestion[] {
  const common = [...DEFAULT_COMMON_QUESTIONS];

  if (productSlug && DEFAULT_PRODUCT_QUESTIONS[productSlug]) {
    const productSpecific = DEFAULT_PRODUCT_QUESTIONS[productSlug];
    return [...productSpecific, ...common].sort((a, b) => a.order_rank - b.order_rank);
  }

  return common;
}

// =============================================================================
// Default Pricing (used when database is empty)
// =============================================================================

export interface DefaultPricing {
  product_slug: string;
  base_price_min: number; // in cents
  base_price_max: number; // in cents
  price_modifiers: PriceModifier[];
}

export const DEFAULT_PRICING: Record<string, DefaultPricing> = {};

/**
 * Get default pricing for a product
 */
export function getDefaultPricing(productSlug: string): DefaultPricing | null {
  return DEFAULT_PRICING[productSlug] || null;
}

// =============================================================================
// Product slugs that support the configurator
// @deprecated - Use configurator_categories table instead
// =============================================================================

export const CONFIGURATOR_PRODUCTS = [] as const;

export type ConfiguratorProduct = (typeof CONFIGURATOR_PRODUCTS)[number];

/**
 * Check if a product slug supports the configurator
 * @deprecated Use configurator_categories from database instead
 */
export function isConfiguratorProduct(slug: string): slug is ConfiguratorProduct {
  return CONFIGURATOR_PRODUCTS.includes(slug as ConfiguratorProduct);
}
