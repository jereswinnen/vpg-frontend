"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const [sanitized, setSanitized] = useState<string>("");

  useEffect(() => {
    // DOMPurify only works in the browser
    import("dompurify").then((DOMPurify) => {
      setSanitized(DOMPurify.default.sanitize(html));
    });
  }, [html]);

  if (!sanitized) {
    // Return unsanitized on first render (will be replaced immediately)
    return (
      <div
        className={cn("prose", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
