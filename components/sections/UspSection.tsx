import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { RichText } from "@/components/shared/RichText";
import type { UspSection as UspSectionType, UspItem } from "@/types/sections";

interface UspSectionProps {
  section: UspSectionType;
}

function UspCard({ usp, variant }: { usp: UspItem; variant: "primary" | "secondary" }) {
  const IconComponent = getIcon(usp.icon);

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-3 p-5",
        variant === "primary" ? "bg-white" : "bg-white/50"
      )}
    >
      {IconComponent && (
        <IconComponent className="size-6 text-[var(--c-accent-dark)]" />
      )}
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-stone-800">{usp.title}</p>
        {usp.description && (
          <div className="text-sm text-stone-600">
            <RichText html={usp.description} />
          </div>
        )}
      </div>
    </div>
  );
}

export function UspSection({ section }: UspSectionProps) {
  const { items } = section;

  if (!items || items.length === 0) return null;

  const [firstUsp, ...remainingUsps] = items;

  return (
    <section className="o-grid--bleed col-span-full bg-stone-100 py-10 md:py-14">
      <div className="o-grid">
        <div className="col-span-full flex flex-col gap-8 lg:flex-row lg:gap-4">
          {/* Left column: 40% - Primary USP */}
          <div className="lg:basis-2/5 lg:shrink-0">
            <UspCard usp={firstUsp} variant="primary" />
          </div>

          {/* Right column: 60% - Secondary USPs */}
          <div className="flex flex-wrap gap-4 lg:basis-3/5">
            {remainingUsps.map((usp, index) => (
              <div key={index} className="basis-full sm:basis-[calc(50%-0.5rem)]">
                <UspCard usp={usp} variant="secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
