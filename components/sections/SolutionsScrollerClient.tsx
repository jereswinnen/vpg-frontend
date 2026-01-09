"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VISIBLE_CARDS = 3;

interface SolutionCard {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface SolutionsScrollerClientProps {
  title?: string;
  solutions: SolutionCard[];
}

export function SolutionsScrollerClient({
  title,
  solutions,
}: SolutionsScrollerClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, solutions.length - VISIBLE_CARDS);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll("[data-card]");
    if (cards.length === 0) return;

    const targetCard = cards[Math.min(index, cards.length - 1)] as HTMLElement;
    if (!targetCard) return;

    const containerStyle = getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft);
    const targetScrollLeft = targetCard.offsetLeft - paddingLeft;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, []);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  }, [canGoPrevious, currentIndex, scrollToCard]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  }, [canGoNext, currentIndex, scrollToCard]);

  if (solutions.length === 0) {
    return null;
  }

  return (
    <section className="col-span-full flex flex-col gap-8">
      {/* Header with title and navigation */}
      <div className="flex items-center justify-between">
        {title && <h2>{title}</h2>}

        {solutions.length > VISIBLE_CARDS && (
          <div className="flex gap-2 rounded-full bg-stone-200 p-1">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="flex items-center justify-center rounded-full bg-white p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous solutions"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className="flex items-center justify-center rounded-full bg-white p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next solutions"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollContainerRef}
        className="o-grid--bleed flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            href={`/realisaties/${solution.slug}`}
            data-card
            className="group relative flex w-[80vw] shrink-0 flex-col gap-4 border-l border-stone-200 p-4 pt-0 transition-colors hover:border-stone-300 sm:w-[calc((var(--u-site-w)-var(--u-grid-gap))/3)] sm:min-w-[280px]"
          >
            {/* Image */}
            <div className="relative aspect-[5/3] overflow-hidden bg-stone-100">
              {solution.imageUrl && (
                <Image
                  src={solution.imageUrl}
                  alt={solution.imageAlt || solution.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-medium">{solution.name}</h3>
              {solution.subtitle && (
                <p className="text-sm text-stone-600">{solution.subtitle}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
