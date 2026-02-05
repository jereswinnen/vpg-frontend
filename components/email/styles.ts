/**
 * Shared email styles for consistent appearance across all email templates.
 * These are inline styles required for email client compatibility.
 */

// Brand colors (VPG uses zinc instead of stone)
export const colors = {
  primary: "#3d2359", // accent-dark
  accent: "#c177b8", // accent-light
  muted: "#71717a", // zinc-500
  text: "#27272a", // zinc-800
  background: "#f4f4f5", // zinc-100
  border: "#e4e4e7", // zinc-200
  white: "#ffffff",
} as const;

// Typography
export const typography = {
  heading: {
    fontSize: "24px",
    fontWeight: "600" as const,
    color: colors.text,
    margin: "0 0 4px 0",
  },
  subheading: {
    fontSize: "14px",
    color: colors.muted,
    margin: "0 0 24px 0",
  },
  paragraph: {
    fontSize: "16px",
    color: colors.text,
    margin: "0 0 16px 0",
    lineHeight: "1.5",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600" as const,
    color: colors.muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 4px 0",
  },
  value: {
    fontSize: "16px",
    color: colors.text,
    margin: "0 0 16px 0",
  },
  small: {
    fontSize: "12px",
    color: colors.muted,
    margin: "0",
  },
  signature: {
    fontSize: "16px",
    color: colors.text,
    margin: "24px 0 0 0",
    lineHeight: "1.5",
  },
} as const;

// Layout
export const layout = {
  content: {
    padding: "32px 48px",
  },
  divider: {
    borderColor: colors.border,
    margin: "24px 0",
  },
  buttonContainer: {
    margin: "24px 0",
  },
} as const;

// Components
export const components = {
  // Matches the primary Action button style
  button: {
    backgroundColor: colors.primary,
    borderRadius: "9999px", // rounded-full (pill shape)
    color: colors.accent, // text-accent-light
    fontSize: "14px",
    fontWeight: "400" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "10px 16px",
  },
  infoBox: {
    backgroundColor: colors.background,
    padding: "20px",
    borderRadius: "12px",
    margin: "16px 0",
  },
  highlightBox: {
    backgroundColor: colors.background,
    padding: "20px",
    borderRadius: "12px",
    margin: "0",
  },
  messageBox: {
    fontSize: "16px",
    color: colors.text,
    margin: "0",
    whiteSpace: "pre-wrap" as const,
    backgroundColor: colors.background,
    padding: "16px",
    borderRadius: "4px",
  },
  link: {
    color: colors.primary,
    fontWeight: "500" as const,
    textDecoration: "underline",
  },
} as const;
