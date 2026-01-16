// ============================================================================
// CONTACT FORM FIELD CONFIGURATION
// Used by both the ContactForm component (rendering) and API route (validation)
// ============================================================================

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "file"
  | "separator";

export type Subject = "Algemeen" | "Offerte aanvragen";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  autoComplete?: string;
  accept?: string; // for file inputs
  options?: FieldOption[]; // for select inputs
  subject?: Subject; // if set, only show for this subject
  placeholder?: string;
}

export const FORM_FIELDS: FieldConfig[] = [
  // Common fields (shown for all subjects)
  {
    name: "name",
    label: "Naam",
    type: "text",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Telefoonnummer",
    type: "tel",
    required: true,
    autoComplete: "tel",
  },

  // Separator before subject selection
  {
    name: "_separator1",
    label: "",
    type: "separator",
  },

  // Subject selector
  {
    name: "subject",
    label: "Waar gaat je vraag over?",
    type: "select",
    options: [
      { value: "Algemeen", label: "Algemeen" },
      { value: "Offerte aanvragen", label: "Offerte aanvragen" },
    ],
  },

  // Algemeen fields
  {
    name: "message",
    label: "Bericht",
    type: "textarea",
    required: true,
    subject: "Algemeen",
  },

  // Offerte aanvragen fields
  {
    name: "aantalTreden",
    label: "Aantal treden",
    type: "number",
    subject: "Offerte aanvragen",
    placeholder: "Bijv. 14",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "Open", label: "Open" },
      { value: "Gesloten", label: "Gesloten" },
    ],
    subject: "Offerte aanvragen",
  },
  {
    name: "behandeling",
    label: "Behandeling",
    type: "select",
    options: [
      { value: "Lak", label: "Lak" },
      { value: "Vernis", label: "Vernis" },
      { value: "Beits en vernis", label: "Beits en vernis" },
    ],
    subject: "Offerte aanvragen",
  },
  {
    name: "vorm",
    label: "Vorm",
    type: "select",
    options: [
      { value: "Recht", label: "Recht" },
      { value: "Kwart", label: "Kwart" },
      { value: "Dubbel kwart", label: "Dubbel kwart" },
      { value: "Drievoudig kwart", label: "Drievoudig kwart" },
    ],
    subject: "Offerte aanvragen",
  },
  {
    name: "bestand",
    label: "Bestand",
    type: "file",
    accept: "image/*,application/pdf,.doc,.docx",
    subject: "Offerte aanvragen",
  },
  {
    name: "opmerkingen",
    label: "Opmerkingen",
    type: "textarea",
    subject: "Offerte aanvragen",
    placeholder: "Eventuele extra informatie over je trap...",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get fields visible for a given subject
 */
export function getVisibleFields(subject: Subject): FieldConfig[] {
  return FORM_FIELDS.filter(
    (field) => !field.subject || field.subject === subject
  );
}

/**
 * Get required fields for a given subject
 */
export function getRequiredFields(subject: Subject): FieldConfig[] {
  return getVisibleFields(subject).filter((field) => field.required);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Form data type for the contact form
 */
export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: Subject;
  // Algemeen
  message: string;
  // Offerte aanvragen
  aantalTreden: string;
  type: string;
  behandeling: string;
  vorm: string;
  bestand: File | null;
  opmerkingen: string;
};

/**
 * Validate form data for a given subject
 * Returns null if valid, or an error message if invalid
 */
export function validateFormData(
  formData: FormData,
  subject: Subject
): string | null {
  const requiredFields = getRequiredFields(subject);

  for (const field of requiredFields) {
    const value = formData.get(field.name);

    if (field.type === "email") {
      const email = (value as string) || "";
      if (!isValidEmail(email)) {
        return "Ongeldig e-mailadres";
      }
    } else if (field.type === "file" || field.type === "separator") {
      // Files and separators are skipped
      continue;
    } else {
      const strValue = (value as string) || "";
      if (!strValue.trim()) {
        return `${field.label} is verplicht`;
      }
    }
  }

  return null;
}

/**
 * Generate initial form state from field config
 */
export function getInitialFormData(): ContactFormData {
  return {
    name: "",
    email: "",
    phone: "",
    subject: "Algemeen",
    message: "",
    aantalTreden: "",
    type: "Open",
    behandeling: "Lak",
    vorm: "Recht",
    bestand: null,
    opmerkingen: "",
  };
}
