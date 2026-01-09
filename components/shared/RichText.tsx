"use client";

import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
