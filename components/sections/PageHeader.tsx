import Image from "next/image";
import { Action } from "@/components/shared/Action";
import { RichText } from "@/components/shared/RichText";
import type { PageHeaderSection } from "@/types/sections";

interface PageHeaderProps {
  section: PageHeaderSection;
}

export function PageHeader({ section }: PageHeaderProps) {
  const { title, subtitle, buttons, image } = section;
  const hasImage = !!image?.url;

  return (
    <header className="o-grid o-grid--bleed bg-[var(--c-accent-dark)] py-12 text-white md:py-20">
      <div className="col-span-full grid grid-cols-subgrid items-center gap-y-8">
        <div
          className={`col-span-full flex flex-col gap-4 md:gap-6 ${hasImage ? "md:col-span-4" : ""}`}
        >
          {title && <h1>{title}</h1>}
          {subtitle && (
            <div className="text-base text-white/80 md:text-lg">
              <RichText html={subtitle} />
            </div>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {buttons.map((button, index) => (
                <Action key={index} action={button} />
              ))}
            </div>
          )}
        </div>
        {hasImage && image?.url && (
          <div className="relative col-span-full aspect-[5/3] md:col-span-5">
            <Image
              src={image.url}
              alt={image.alt || ""}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </header>
  );
}
