import { Section, Text, Hr, Link } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
  typography,
  layout,
  components,
  colors,
} from "./EmailLayout";

interface ContactFormEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  phone,
  message,
}: ContactFormEmailProps) {
  return (
    <EmailLayout preview={`Nieuw bericht van ${name}`}>
      <Section style={layout.content}>
        <Text style={typography.heading}>Nieuw contactformulier</Text>
        <Text style={typography.subheading}>Via de website</Text>

        <Hr style={layout.divider} />

        <Text style={typography.label}>Naam</Text>
        <Text style={typography.value}>{name}</Text>

        <Text style={typography.label}>E-mail</Text>
        <Text style={typography.value}>
          <Link href={`mailto:${email}`} style={components.link}>
            {email}
          </Link>
        </Text>

        {phone && (
          <>
            <Text style={typography.label}>Telefoon</Text>
            <Text style={typography.value}>
              <Link href={`tel:${phone}`} style={components.link}>
                {phone}
              </Link>
            </Text>
          </>
        )}

        <Hr style={layout.divider} />

        <Text style={typography.label}>Bericht</Text>
        <Text style={messageBox}>{message}</Text>
      </Section>
    </EmailLayout>
  );
}

const messageBox = {
  fontSize: "16px",
  color: colors.text,
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: colors.background,
  padding: "16px",
  borderRadius: "4px",
};

export default ContactFormEmail;
