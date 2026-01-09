import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Naam, e-mail en bericht zijn verplicht" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "E-mail service is niet geconfigureerd" },
        { status: 500 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL || "info@vpg.be";
    const fromEmail = process.env.FROM_EMAIL || "noreply@vpg.be";

    await resend.emails.send({
      from: `VPG Website <${fromEmail}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Nieuw contactformulier bericht van ${name}`,
      text: [
        `Naam: ${name}`,
        `E-mail: ${email}`,
        phone ? `Telefoon: ${phone}` : null,
        "",
        "Bericht:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verzenden" },
      { status: 500 }
    );
  }
}
