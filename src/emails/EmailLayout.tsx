import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLogo } from "@/components/email/Logo";

// VPG Brand colors (from globals.css)
export const colors = {
  primary: "#3d2359", // accent-dark (oklch 0.2555 0.0727 320.52)
  accent: "#c177b8", // accent-light (oklch 0.8061 0.081 320.8)
  muted: "#78716c", // stone-500
  text: "#292524", // stone-800
  background: "#f5f5f4", // stone-100
  border: "#e7e5e4", // stone-200
  white: "#ffffff",
} as const;

// Typography styles
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
} as const;

// Layout styles
export const layout = {
  content: {
    padding: "32px 48px",
  },
  divider: {
    borderColor: colors.border,
    margin: "24px 0",
  },
} as const;

// Component styles
export const components = {
  link: {
    color: colors.primary,
    fontWeight: "500" as const,
    textDecoration: "underline",
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
} as const;

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Link href="https://vpg.be" style={logoLink}>
              <EmailLogo />
            </Link>
          </Section>
          {children}
          <Section style={footer}>
            <Text style={footerText}>VPG Trapmakerij</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: colors.white,
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 48px",
  borderBottom: `1px solid ${colors.border}`,
};

const logoLink = {
  textDecoration: "none",
};

const footer = {
  padding: "32px 48px",
  borderTop: `1px solid ${colors.border}`,
};

const footerText = {
  fontSize: "12px",
  color: colors.muted,
  margin: "0",
};
