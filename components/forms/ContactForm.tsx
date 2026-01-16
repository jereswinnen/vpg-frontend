"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, MailCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  getVisibleFields,
  getInitialFormData,
  isValidEmail,
  type FieldConfig,
  type Subject,
  type ContactFormData,
} from "@/config/contactForm";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(getInitialFormData);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";
  const currentSubject = formData.subject as Subject;

  const visibleFields = getVisibleFields(currentSubject);

  const isFormValid = visibleFields
    .filter((field) => field.required)
    .every((field) => {
      const value = formData[field.name as keyof ContactFormData];
      if (field.name === "email") return isValidEmail(String(value || ""));
      if (typeof value === "string") return value.trim() !== "";
      return Boolean(value);
    });

  function updateField(name: string, value: string | File | null) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting || isSuccess || !isFormValid) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const data = new FormData();

      visibleFields.forEach((field) => {
        const value = formData[field.name as keyof ContactFormData];
        if (field.type === "file" && value instanceof File) {
          data.set(field.name, value);
        } else if (typeof value === "string") {
          data.set(field.name, value);
        }
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(
          json.error || "Er is iets misgegaan. Probeer later opnieuw."
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Er is iets misgegaan. Probeer later opnieuw."
      );
    }
  }

  function renderField(field: FieldConfig) {
    const isDisabled = isSubmitting || isSuccess;
    const value = formData[field.name as keyof ContactFormData];

    switch (field.type) {
      case "separator":
        return <FieldSeparator key={field.name} />;

      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>
              {field.label}{field.required && " *"}
            </FieldLabel>
            <Input
              id={field.name}
              type={field.type}
              required={field.required}
              value={String(value || "")}
              onChange={(e) => updateField(field.name, e.target.value)}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              disabled={isDisabled}
            />
          </Field>
        );

      case "textarea":
        return (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>
              {field.label}{field.required && " *"}
            </FieldLabel>
            <Textarea
              id={field.name}
              required={field.required}
              value={String(value || "")}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="min-h-32"
              disabled={isDisabled}
            />
          </Field>
        );

      case "select":
        return (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>
              {field.label}{field.required && " *"}
            </FieldLabel>
            <Select
              value={String(value || "")}
              onValueChange={(v) => updateField(field.name, v)}
              disabled={isDisabled}
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        );

      case "file":
        return (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>
              {field.label}{field.required && " *"}
            </FieldLabel>
            <Input
              id={field.name}
              type="file"
              accept={field.accept}
              onChange={(e) =>
                updateField(field.name, e.target.files?.[0] || null)
              }
              disabled={isDisabled}
            />
          </Field>
        );

      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {visibleFields.map(renderField)}

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
