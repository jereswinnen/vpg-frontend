"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FilterCategory } from "@/types/content";

interface FilterBarProps {
  categories: FilterCategory[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function getActiveFilters(categorySlug: string): string[] {
    const value = searchParams.get(categorySlug);
    return value ? value.split(",") : [];
  }

  function toggleFilter(categorySlug: string, filterSlug: string) {
    const params = new URLSearchParams(searchParams);
    const active = getActiveFilters(categorySlug);

    if (active.includes(filterSlug)) {
      const updated = active.filter((f) => f !== filterSlug);
      if (updated.length === 0) {
        params.delete(categorySlug);
      } else {
        params.set(categorySlug, updated.join(","));
      }
    } else {
      params.set(categorySlug, [...active, filterSlug].join(","));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }

  function clearAllFilters() {
    router.push("/realisaties", { scroll: false });
  }

  const hasActiveFilters = categories.some(
    (cat) => getActiveFilters(cat.slug).length > 0
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const active = getActiveFilters(category.slug);
        return (
          <Popover key={category.id}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                {category.name}
                {active.length > 0 && (
                  <span className="rounded-full bg-[var(--c-accent-dark)] px-2 py-0.5 text-xs text-white">
                    {active.length}
                  </span>
                )}
                <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              {category.filters.map((filter) => {
                const isActive = active.includes(filter.slug);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(category.slug, filter.slug)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent",
                      isActive && "font-medium"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        isActive &&
                          "border-[var(--c-accent-dark)] bg-[var(--c-accent-dark)] text-white"
                      )}
                    >
                      {isActive && <Check className="size-3" />}
                    </span>
                    {filter.name}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        );
      })}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearAllFilters}
          className="text-muted-foreground"
        >
          Filters wissen
        </Button>
      )}
    </div>
  );
}
