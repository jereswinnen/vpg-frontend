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
  HighlightBox,
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
  priceMin: string;
  priceMax: string;
}

export function QuoteEmail({
  customerName,
  productName,
  configuration,
  priceMin,
  priceMax,
}: QuoteEmailProps) {
  const contactUrl = "https://vpg.be/contact";
  const priceRange =
    priceMin === priceMax ? priceMin : `${priceMin} - ${priceMax}`;

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
          uw configuratie en een prijsindicatie.
        </Text>

        {/* Price Highlight */}
        <HighlightBox>
          <Text style={highlightLabel}>Prijsschatting</Text>
          <Text style={highlightValue}>{priceRange}</Text>
        </HighlightBox>

        <Text style={disclaimer}>
          Dit is een indicatieve prijsschatting. De uiteindelijke prijs is
          afhankelijk van een plaatsbezoek.
        </Text>

        <Hr style={layout.divider} />

        {/* Configuration Summary */}
        <Text style={sectionTitle}>Uw configuratie</Text>

        <InfoBox>
          <InfoRow label="Product" value={productName} />
          {configuration.map((item, index) => (
            <InfoRow key={index} label={item.label} value={item.value} />
          ))}
        </InfoBox>

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
  priceMin: string;
  priceMax: string;
}

export function QuoteAdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  productName,
  configuration,
  priceMin,
  priceMax,
}: QuoteAdminNotificationProps) {
  const priceRange =
    priceMin === priceMax ? priceMin : `${priceMin} - ${priceMax}`;

  return (
    <EmailLayout
      preview={`Nieuwe offerte aanvraag: ${customerName} - ${productName}`}
    >
      <Section style={layout.content}>
        <Text style={typography.heading}>Nieuwe offerte aanvraag</Text>
        <Text style={typography.subheading}>Via de online configurator</Text>

        <Hr style={layout.divider} />

        {/* Price Highlight */}
        <HighlightBox>
          <Text style={highlightLabel}>Prijsschatting</Text>
          <Text style={highlightValue}>{priceRange}</Text>
        </HighlightBox>

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

const highlightLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: colors.primary,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px 0",
  opacity: 0.7,
};

const highlightValue = {
  fontSize: "24px",
  color: colors.primary,
  margin: "0",
  fontWeight: "600" as const,
};

const disclaimer = {
  fontSize: "12px",
  color: colors.muted,
  margin: "12px 0 0 0",
  fontStyle: "italic" as const,
};

const signatureStyle = {
  fontSize: "16px",
  color: colors.text,
  margin: "24px 0 0 0",
  lineHeight: "1.5",
};
