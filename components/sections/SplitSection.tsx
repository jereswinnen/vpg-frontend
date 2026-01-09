"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Action } from "@/components/shared/Action";
import { RichText } from "@/components/shared/RichText";
import type { SplitSection as SplitSectionType, SplitBlock } from "@/types/sections";

interface SplitSectionProps {
  section: SplitSectionType;
}

function Block({ block }: { block: SplitBlock }) {
  if (block.type === "empty") {
    return null;
  }

  if (block.type === "image" && block.images && block.images.length > 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={block.images[0].url}
          alt={block.images[0].alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  if (block.type === "text") {
    return (
      <div className="flex flex-col gap-4">
        {block.title && <h2 className="text-2xl font-semibold">{block.title}</h2>}
        {block.subtitle && (
          <div className="text-stone-600">
            <RichText html={block.subtitle} />
          </div>
        )}
        {block.actions && block.actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {block.actions.map((action, index) => (
              <Action key={index} action={action} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export function SplitSection({ section }: SplitSectionProps) {
  const { blockLeft, blockRight } = section;

  return (
    <section className="col-span-full grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="flex flex-col justify-center">
        <Block block={blockLeft} />
      </div>
      <div className="flex flex-col justify-center">
        <Block block={blockRight} />
      </div>
    </section>
  );
}
