import { Section, Text, Hr, Link } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
  typography,
  layout,
  components,
  colors,
} from "./EmailLayout";

interface ContactFormOfferteEmailProps {
  name: string;
  email: string;
  phone: string;
  address?: string;
  aantalTreden?: string;
  type?: string;
  behandeling?: string;
  vorm?: string;
  opmerkingen?: string;
  hasBestand?: boolean;
  bestandNaam?: string;
}

export function ContactFormOfferteEmail({
  name,
  email,
  phone,
  address,
  aantalTreden,
  type,
  behandeling,
  vorm,
  opmerkingen,
  hasBestand,
  bestandNaam,
}: ContactFormOfferteEmailProps) {
  return (
    <EmailLayout preview={`Nieuwe offerteaanvraag van ${name}`}>
      <Section style={layout.content}>
        <Text style={typography.heading}>Nieuwe offerteaanvraag</Text>
        <Text style={typography.subheading}>Via de website</Text>

        <Hr style={layout.divider} />

        {/* Contact Details */}
        <Text style={sectionTitle}>Contactgegevens</Text>

        <Text style={typography.label}>Naam</Text>
        <Text style={typography.value}>{name}</Text>

        <Text style={typography.label}>E-mail</Text>
        <Text style={typography.value}>
          <Link href={`mailto:${email}`} style={components.link}>
            {email}
          </Link>
        </Text>

        <Text style={typography.label}>Telefoon</Text>
        <Text style={typography.value}>
          <Link href={`tel:${phone}`} style={components.link}>
            {phone}
          </Link>
        </Text>

        {address && (
          <>
            <Text style={typography.label}>Adres</Text>
            <Text style={typography.value}>{address}</Text>
          </>
        )}

        <Hr style={layout.divider} />

        {/* Trap Specifications */}
        <Text style={sectionTitle}>Trapgegevens</Text>

        {aantalTreden && (
          <>
            <Text style={typography.label}>Aantal treden</Text>
            <Text style={typography.value}>{aantalTreden}</Text>
          </>
        )}

        {type && (
          <>
            <Text style={typography.label}>Type</Text>
            <Text style={typography.value}>{type}</Text>
          </>
        )}

        {behandeling && (
          <>
            <Text style={typography.label}>Behandeling</Text>
            <Text style={typography.value}>{behandeling}</Text>
          </>
        )}

        {vorm && (
          <>
            <Text style={typography.label}>Vorm</Text>
            <Text style={typography.value}>{vorm}</Text>
          </>
        )}

        {hasBestand && (
          <>
            <Text style={typography.label}>Bijlage</Text>
            <Text style={typography.value}>
              {bestandNaam || "Bestand bijgevoegd"}
            </Text>
          </>
        )}

        {opmerkingen && (
          <>
            <Hr style={layout.divider} />
            <Text style={typography.label}>Opmerkingen</Text>
            <Text style={messageBox}>{opmerkingen}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: colors.primary,
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const messageBox = {
  fontSize: "16px",
  color: colors.text,
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: colors.background,
  padding: "16px",
  borderRadius: "4px",
};

export default ContactFormOfferteEmail;
