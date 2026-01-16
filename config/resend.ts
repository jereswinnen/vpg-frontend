/**
 * Resend Email Configuration
 *
 * Centralized configuration for email services via Resend.
 *
 * Email routing overview:
 * +---------------------------+---------------------------+---------------------------+
 * | Feature                   | Dev (localhost)           | Production                |
 * +---------------------------+---------------------------+---------------------------+
 * | Contact form              | vpg@jeremys.be            | info@vpg.be               |
 * +---------------------------+---------------------------+---------------------------+
 *
 * In development, emails are sent to the test email address to avoid
 * accidentally sending emails to real recipients.
 */

// Test mode: when true, server-side emails go to test email address
const TEST_MODE = process.env.NODE_ENV === "development";

// Test email address for development
export const DEFAULT_TEST_EMAIL = "vpg@jeremys.be";

export const RESEND_CONFIG = {
  // Default sender address for general emails
  fromAddress: "VPG <noreply@vpg.be>",

  // Sender address for contact form notifications
  fromAddressContact: "VPG Website <noreply@vpg.be>",

  // Recipient address for contact form submissions
  contactRecipient: TEST_MODE ? DEFAULT_TEST_EMAIL : "info@vpg.be",

  // Whether test mode is enabled (development environment)
  isTestMode: TEST_MODE,

  // Email subjects
  subjects: {
    contactAlgemeen: "Nieuw contactformulier: Algemeen",
    contactOfferte: "Nieuwe offerteaanvraag via website",
  },
} as const;
