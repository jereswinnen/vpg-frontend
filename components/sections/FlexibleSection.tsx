import Image from "next/image";
import { Action } from "@/components/shared/Action";
import { RichText } from "@/components/shared/RichText";
import type {
  FlexibleSection as FlexibleSectionType,
  FlexBlock,
} from "@/types/sections";

interface FlexibleSectionProps {
  section: FlexibleSectionType;
}

function BlockRenderer({ block }: { block?: FlexBlock }) {
  if (!block) return null;

  switch (block.type) {
    case "text":
      return (
        <div className="flex flex-col gap-4">
          {block.title && <h2>{block.title}</h2>}
          {block.content && (
            <div className="text-stone-600">
              <RichText html={block.content} />
            </div>
          )}
          {block.button && <Action action={block.button} className="mt-2" />}
        </div>
      );

    case "image":
      if (!block.image?.url) return null;
      return (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={block.image.url}
            alt={block.image.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      );

    case "map":
      return (
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.0!2d3.7!3d51.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDAw!5e0!3m2!1snl!2sbe!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </div>
      );

    case "form":
      // Form will be handled separately in the contact page
      return (
        <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-500">
          Contact form placeholder
        </div>
      );

    default:
      return null;
  }
}

export function FlexibleSection({ section }: FlexibleSectionProps) {
  const { layout, blockMain, blockLeft, blockRight } = section;

  const isSingleColumn = layout === "1-col";

  return (
    <section className="col-span-full grid grid-cols-subgrid gap-y-8">
      {isSingleColumn ? (
        <div className="col-span-full">
          <BlockRenderer block={blockMain} />
        </div>
      ) : (
        <>
          <div
            className={
              layout === "2-col-equal"
                ? "col-span-full md:col-span-4"
                : layout === "2-col-left-wide"
                  ? "col-span-full md:col-span-5"
                  : "col-span-full md:col-span-3"
            }
          >
            <BlockRenderer block={blockLeft} />
          </div>
          <div
            className={
              layout === "2-col-equal"
                ? "col-span-full md:col-span-5"
                : layout === "2-col-left-wide"
                  ? "col-span-full md:col-span-4"
                  : "col-span-full md:col-span-6"
            }
          >
            <BlockRenderer block={blockRight} />
          </div>
        </>
      )}
    </section>
  );
}
