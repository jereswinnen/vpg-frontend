import { Section, Text, Hr, Link } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
  typography,
  layout,
  colors,
  components,
} from "./EmailLayout";
import {
  InfoBox,
  InfoRow,
  EmailButton,
} from "@/components/email";

interface ConfigurationItem {
  label: string;
  value: string;
}

interface QuoteEmailProps {
  customerName: string;
  productName: string;
  configuration: ConfigurationItem[];
  opmerkingen?: string;
}

export function QuoteEmail({
  customerName,
  productName,
  configuration,
  opmerkingen,
}: QuoteEmailProps) {
  const contactUrl = "https://vpg.be/contact";

  return (
    <EmailLayout preview={`Uw offerte aanvraag voor ${productName}`}>
      <Section style={layout.content}>
        <Text style={typography.heading}>Uw offerte aanvraag</Text>
        <Text style={typography.subheading}>
          Bedankt voor uw interesse in VPG
        </Text>

        <Hr style={layout.divider} />

        <Text style={greeting}>Beste {customerName},</Text>

        <Text style={typography.paragraph}>
          Bedankt voor uw offerte aanvraag. Hieronder vindt u een overzicht van
          uw configuratie.
        </Text>

        {/* Configuration Summary */}
        <Text style={sectionTitle}>Uw configuratie</Text>

        <InfoBox>
          <InfoRow label="Product" value={productName} />
          {configuration.map((item, index) => (
            <InfoRow key={index} label={item.label} value={item.value} />
          ))}
        </InfoBox>

        {opmerkingen && (
          <>
            <Text style={sectionTitle}>Uw opmerkingen</Text>
            <Text style={messageBox}>{opmerkingen}</Text>
          </>
        )}

        <Hr style={layout.divider} />

        {/* Next Steps */}
        <Text style={sectionTitle}>Volgende stappen</Text>
        <Text style={typography.paragraph}>
          Wij nemen zo spoedig mogelijk contact met u op om uw project te
          bespreken en een nauwkeurige offerte op te maken.
        </Text>
        <EmailButton href={contactUrl}>Contact opnemen</EmailButton>

        <Hr style={layout.divider} />

        <Text style={typography.paragraph}>
          Heeft u vragen? Stuur gerust een mailtje naar:{" "}
          <Link href="mailto:info@vpg.be" style={components.link}>
            info@vpg.be
          </Link>
          .
        </Text>

        <Text style={signatureStyle}>
          Met vriendelijke groeten,
          <br />
          Het VPG team
        </Text>
      </Section>
    </EmailLayout>
  );
}

export default QuoteEmail;

// =============================================================================
// Admin Notification Email
// =============================================================================

interface QuoteAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  configuration: ConfigurationItem[];
  opmerkingen?: string;
  hasBestand?: boolean;
  bestandNaam?: string;
}

export function QuoteAdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  productName,
  configuration,
  opmerkingen,
  hasBestand,
  bestandNaam,
}: QuoteAdminNotificationProps) {
  return (
    <EmailLayout
      preview={`Nieuwe offerte aanvraag: ${customerName} - ${productName}`}
    >
      <Section style={layout.content}>
        <Text style={typography.heading}>Nieuwe offerte aanvraag</Text>
        <Text style={typography.subheading}>Via de online configurator</Text>

        <Hr style={layout.divider} />

        {/* Customer Details */}
        <Text style={sectionTitle}>Klantgegevens</Text>

        <Text style={typography.label}>Naam</Text>
        <Text style={typography.value}>{customerName}</Text>

        <Text style={typography.label}>E-mail</Text>
        <Text style={typography.value}>
          <Link href={`mailto:${customerEmail}`} style={components.link}>
            {customerEmail}
          </Link>
        </Text>

        <Text style={typography.label}>Telefoon</Text>
        <Text style={typography.value}>
          <Link href={`tel:${customerPhone}`} style={components.link}>
            {customerPhone}
          </Link>
        </Text>

        <Text style={typography.label}>Adres</Text>
        <Text style={typography.value}>
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`}
            style={components.link}
          >
            {customerAddress}
          </Link>
        </Text>

        <Hr style={layout.divider} />

        {/* Configuration */}
        <Text style={sectionTitle}>Configuratie</Text>

        <Text style={typography.label}>Product</Text>
        <Text style={typography.value}>{productName}</Text>

        {configuration.map((item, index) => (
          <React.Fragment key={index}>
            <Text style={typography.label}>{item.label}</Text>
            <Text style={typography.value}>{item.value}</Text>
          </React.Fragment>
        ))}

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
            <Text style={adminMessageBox}>{opmerkingen}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}

// =============================================================================
// Styles
// =============================================================================

const greeting = {
  fontSize: "16px",
  color: colors.primary,
  margin: "0 0 16px 0",
  fontWeight: "600" as const,
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: colors.primary,
  margin: "0 0 16px 0",
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

const adminMessageBox = {
  fontSize: "16px",
  color: colors.text,
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: colors.background,
  padding: "16px",
  borderRadius: "4px",
};

const signatureStyle = {
  fontSize: "16px",
  color: colors.text,
  margin: "24px 0 0 0",
  lineHeight: "1.5",
};
