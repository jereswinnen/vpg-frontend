"use client";

import { cn } from "@/lib/utils";
import {
  BlocksIcon,
  CircleUserRoundIcon,
  NotepadTextDashedIcon,
} from "lucide-react";

interface ProgressStep {
  number: number;
  label: string;
}

interface ProgressBarProps {
  currentStep: number;
  steps?: ProgressStep[];
  className?: string;
}

const DEFAULT_STEPS: (ProgressStep & { icon: typeof BlocksIcon })[] = [
  { number: 1, label: "Configuratie", icon: BlocksIcon },
  { number: 2, label: "Gegevens", icon: CircleUserRoundIcon },
  { number: 3, label: "Overzicht", icon: NotepadTextDashedIcon },
];

export function ProgressBar({
  currentStep,
  steps,
  className,
}: ProgressBarProps) {
  // Use default icon-based steps when no dynamic steps provided
  if (!steps) {
    return (
      <nav aria-label="Progress" className={cn("flex gap-6", className)}>
        {DEFAULT_STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex-1 flex flex-col gap-3">
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  isCompleted && "text-accent-dark",
                  isActive && "text-zinc-800 font-medium",
                  !isActive && !isCompleted && "text-zinc-600 font-normal"
                )}
              >
                <Icon className="size-4" />
                <span>{step.label}</span>
              </div>
              <div
                className={cn(
                  "h-0.5",
                  isCompleted && "bg-accent-light",
                  isActive && "bg-zinc-500",
                  !isActive && !isCompleted && "bg-zinc-200"
                )}
                aria-current={isActive ? "step" : undefined}
              />
            </div>
          );
        })}
      </nav>
    );
  }

  // Dynamic steps: use step numbers instead of icons
  return (
    <nav aria-label="Progress" className={cn("flex gap-6", className)}>
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex-1 flex flex-col gap-3">
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm",
                isCompleted && "text-accent-dark",
                isActive && "text-zinc-800 font-medium",
                !isActive && !isCompleted && "text-zinc-600 font-normal"
              )}
            >
              <span className="truncate">{step.label}</span>
            </div>
            <div
              className={cn(
                "h-0.5",
                isCompleted && "bg-accent-light",
                isActive && "bg-zinc-500",
                !isActive && !isCompleted && "bg-zinc-200"
              )}
              aria-current={isActive ? "step" : undefined}
            />
          </div>
        );
      })}
    </nav>
  );
}
