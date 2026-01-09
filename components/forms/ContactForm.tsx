"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Bericht verzonden!");
        e.currentTarget.reset();
      } else {
        toast.error("Er ging iets mis. Probeer opnieuw.");
      }
    } catch {
      toast.error("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Naam *
        </label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail *
        </label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Telefoon
        </label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Bericht *
        </label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[var(--c-accent-light)] text-[var(--c-accent-dark)] hover:bg-[var(--c-accent-light)]/90"
      >
        {loading ? "Verzenden..." : "Versturen"}
      </Button>
    </form>
  );
}
