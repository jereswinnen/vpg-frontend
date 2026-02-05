"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2Icon } from "lucide-react";
import type { WizardAnswers, ContactDetails } from "../Wizard";

// =============================================================================
// Types
// =============================================================================

interface ProductOption {
  slug: string;
  name: string;
}

interface PriceData {
  min: number;
  min_formatted: string;
  range_formatted: string;
}

interface SummaryStepProps {
  selectedProduct: string | null;
  products: ProductOption[];
  answers: WizardAnswers;
  contactDetails: ContactDetails;
  onSubmissionComplete?: (data: {
    submissionId: string;
    appointmentId?: number;
    appointmentDate?: string;
    appointmentTime?: string;
  }) => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function SummaryStep({
  selectedProduct,
  products,
  answers,
  contactDetails,
  onSubmissionComplete,
  className,
}: SummaryStepProps) {
  const productName =
    products.find((p) => p.slug === selectedProduct)?.name || selectedProduct;

  // Price calculation state
  const [price, setPrice] = useState<PriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Submission state
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Calculate price on mount
  useEffect(() => {
    async function fetchPrice() {
      if (!selectedProduct) {
        setPriceLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/configurator/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_slug: selectedProduct,
            answers,
          }),
        });

        if (!response.ok) {
          throw new Error("Kon prijs niet berekenen");
        }

        const data = await response.json();
        setPrice(data.price);
      } catch (err) {
        console.error("Error fetching price:", err);
        setPriceError("Er is iets misgegaan bij het berekenen van de prijs.");
      } finally {
        setPriceLoading(false);
      }
    }

    fetchPrice();
  }, [selectedProduct, answers]);

  // Submit quote when price is loaded and not yet submitted
  useEffect(() => {
    if (price && submissionStatus === "idle") {
      submitQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, submissionStatus]);

  // Submit quote function
  const submitQuote = async () => {
    if (submissionStatus === "submitting") return;

    setSubmissionStatus("submitting");
    setSubmissionError(null);

    try {
      const response = await fetch("/api/configurator/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: selectedProduct,
          answers,
          contact: {
            name: contactDetails.name,
            email: contactDetails.email,
            phone: contactDetails.phone,
            address: contactDetails.address,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kon offerte niet versturen");
      }

      const data = await response.json();
      setSubmissionStatus("success");

      // Notify parent
      onSubmissionComplete?.({
        submissionId: data.submission_id,
      });
    } catch (err) {
      console.error("Error submitting quote:", err);
      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Er is iets misgegaan bij het versturen.",
      );
      setSubmissionStatus("error");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Success Banner */}
      {submissionStatus === "success" && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle2Icon className="size-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-green-800">Mail verstuurd!</p>
            <p className="text-sm text-green-700 mt-1">
              U ontvangt binnen enkele minuten een bevestiging per e-mail op{" "}
              <strong>{contactDetails.email}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submissionStatus === "error" && submissionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="font-medium text-red-800">Er is iets misgegaan</p>
          <p className="text-sm text-red-700 mt-1">{submissionError}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSubmissionStatus("idle");
              submitQuote();
            }}
          >
            Opnieuw proberen
          </Button>
        </div>
      )}

      {/* Price Card */}
      <Card className="bg-accent-dark text-accent-light">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg opacity-80">Prijsschatting</CardTitle>
        </CardHeader>
        <CardContent>
          {priceLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-5" />
              <span>Prijs berekenen...</span>
            </div>
          ) : priceError ? (
            <p className="text-red-300">{priceError}</p>
          ) : price ? (
            <>
              <p className="text-3xl font-bold">{price.range_formatted}</p>
              <p className="text-sm opacity-70 mt-2">
                Dit is een indicatieve vanafprijs. De uiteindelijke prijs is
                afhankelijk van een plaatsbezoek.
              </p>
            </>
          ) : (
            <p className="opacity-70">Geen prijs beschikbaar</p>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Uw configuratie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-zinc-500">Product</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {productName || "Niet geselecteerd"}
            </dd>
          </div>

          {Object.entries(answers).length > 0 ? (
            <div className="border-t pt-4">
              <dt className="text-sm font-medium text-zinc-500 mb-2">
                Keuzes
              </dt>
              <dl className="space-y-2">
                {Object.entries(answers).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <dt className="text-zinc-600 capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-zinc-900 font-medium">
                      {formatAnswerValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">
              Geen aanvullende keuzes gemaakt
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Uw gegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <SummaryRow label="Naam" value={contactDetails.name} />
            <SummaryRow label="E-mail" value={contactDetails.email} />
            <SummaryRow label="Telefoon" value={contactDetails.phone} />
            <SummaryRow label="Adres" value={contactDetails.address} />
          </dl>
        </CardContent>
      </Card>

      {/* Submitting indicator */}
      {submissionStatus === "submitting" && (
        <div className="flex items-center justify-center py-4 text-zinc-500">
          <Spinner className="size-5 mr-2" />
          <span>Offerte versturen...</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-zinc-600">{label}</dt>
      <dd className="text-zinc-900 font-medium">{value || "-"}</dd>
    </div>
  );
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatAnswerValue(
  value:
    | string
    | string[]
    | number
    | { length: number; width: number; height?: number }
    | undefined,
): string {
  if (value === undefined || value === null) {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "-";
  }

  if (typeof value === "object" && "length" in value && "width" in value) {
    const dims = value as { length: number; width: number; height?: number };
    const parts = [`${dims.length}m x ${dims.width}m`];
    if (dims.height) {
      parts.push(`x ${dims.height}m`);
    }
    return parts.join(" ");
  }

  if (typeof value === "number") {
    return String(value);
  }

  return String(value);
}
