"use client";

import { useState } from "react";
import { CheckIcon, MailCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  const isFormValid =
    formData.name.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.message.trim() !== "";

  function updateField(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting || isSuccess || !isFormValid) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Er ging iets mis. Probeer opnieuw.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Er ging iets mis. Probeer opnieuw."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Naam *</FieldLabel>
          <Input
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail *</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Telefoon</FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Bericht *</FieldLabel>
          <Textarea
            id="message"
            name="message"
            className="min-h-40"
            required
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </Field>

        {status === "error" && <FieldError>{errorMessage}</FieldError>}

        <Button
          type="submit"
          disabled={isSubmitting || (!isSuccess && !isFormValid)}
          className={cn(
            "w-fit px-3.5 py-2 flex items-center gap-1.5 text-accent-light bg-accent-dark transition-colors duration-250 hover:text-accent-dark hover:bg-accent-light rounded-none",
            isSubmitting &&
              "text-zinc-600 bg-zinc-200 hover:text-zinc-600 hover:bg-zinc-200",
            isSuccess &&
              "text-zinc-600 bg-zinc-200 hover:text-zinc-600 hover:bg-zinc-200"
          )}
        >
          {isSubmitting && (
            <>
              <Spinner className="size-4" />
              <span>Laden...</span>
            </>
          )}
          {isSuccess && (
            <>
              <CheckIcon className="size-4" />
              <span>Gelukt!</span>
            </>
          )}
          {!isSubmitting && !isSuccess && (
            <>
              <MailCheckIcon className="size-4" />
              <span>Versturen</span>
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
