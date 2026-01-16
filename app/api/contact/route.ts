import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { RESEND_CONFIG } from "@/config/resend";
import { validateFormData, type Subject } from "@/config/contactForm";
import { ContactFormEmail } from "@/emails/ContactFormEmail";
import { ContactFormOfferteEmail } from "@/emails/ContactFormOfferteEmail";

export async function POST(req: NextRequest) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "E-mail service is niet geconfigureerd" },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const subject = (form.get("subject") as Subject) || "Algemeen";

    // Validate using config
    const validationError = validateFormData(form, subject);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Extract common fields
    const name = (form.get("name") as string) || "";
    const email = (form.get("email") as string) || "";
    const phone = (form.get("phone") as string) || "";

    // Send email based on subject
    if (subject === "Offerte aanvragen") {
      const aantalTreden = (form.get("aantalTreden") as string) || "";
      const type = (form.get("type") as string) || "";
      const behandeling = (form.get("behandeling") as string) || "";
      const vorm = (form.get("vorm") as string) || "";
      const opmerkingen = (form.get("opmerkingen") as string) || "";
      const bestand = form.get("bestand") as File | null;

      // Prepare attachments if file is provided
      const attachments: { filename: string; content: Buffer }[] = [];
      if (bestand && bestand.size > 0) {
        const buffer = Buffer.from(await bestand.arrayBuffer());
        attachments.push({
          filename: bestand.name,
          content: buffer,
        });
      }

      const { error: emailError } = await resend.emails.send({
        from: RESEND_CONFIG.fromAddressContact,
        to: [RESEND_CONFIG.contactRecipient],
        replyTo: email,
        subject: RESEND_CONFIG.subjects.contactOfferte,
        react: ContactFormOfferteEmail({
          name,
          email,
          phone,
          aantalTreden,
          type,
          behandeling,
          vorm,
          opmerkingen,
          hasBestand: attachments.length > 0,
          bestandNaam: bestand?.name,
        }),
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (emailError) {
        console.error("Failed to send Offerte email:", emailError);
        return NextResponse.json(
          { error: "Kon e-mail niet verzenden. Probeer later opnieuw." },
          { status: 500 }
        );
      }
    } else {
      // Algemeen
      const message = (form.get("message") as string) || "";

      const { error: emailError } = await resend.emails.send({
        from: RESEND_CONFIG.fromAddressContact,
        to: [RESEND_CONFIG.contactRecipient],
        replyTo: email,
        subject: RESEND_CONFIG.subjects.contactAlgemeen,
        react: ContactFormEmail({
          name,
          email,
          phone,
          message,
        }),
      });

      if (emailError) {
        console.error("Failed to send Algemeen email:", emailError);
        return NextResponse.json(
          { error: "Kon e-mail niet verzenden. Probeer later opnieuw." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Er is iets misgegaan. Probeer later opnieuw." },
      { status: 500 }
    );
  }
}
