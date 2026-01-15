"use client";

import { Action } from "@/components/shared/Action";
import { RichText } from "@/components/shared/RichText";
import { iconMap } from "@/lib/icons";
import type { FlexTextBlock } from "../types";

interface TextBlockProps {
  block: FlexTextBlock;
}

export function TextBlock({ block }: TextBlockProps) {
  const { heading, headingLevel = "h2", text, button } = block;

  const HeadingTag = headingLevel;
  const IconComponent = button?.icon ? iconMap[button.icon] : null;

  return (
    <div className="flex flex-col gap-4">
      {heading && <HeadingTag className="mb-0!">{heading}</HeadingTag>}
      {text && <RichText html={text} className="text-zinc-600 [&_p]:mb-0!" />}
      {button && button.label && (
        <Action
          href={button.url || "#"}
          icon={IconComponent ? <IconComponent /> : undefined}
          label={button.label}
          variant={button.variant}
          className="mt-2"
        />
      )}
    </div>
  );
}
