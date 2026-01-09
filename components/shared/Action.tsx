import Link from "next/link";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import type { ActionButton } from "@/types/sections";

interface ActionProps {
  action: ActionButton;
  className?: string;
}

export function Action({ action, className }: ActionProps) {
  const Icon = getIcon(action.icon);
  const isPrimary = action.variant !== "secondary";

  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors",
    isPrimary
      ? "bg-[var(--c-accent-light)] text-[var(--c-accent-dark)] hover:bg-[var(--c-accent-light)]/90"
      : "bg-stone-200 text-stone-800 hover:bg-stone-300",
    className
  );

  // Skip chatbot actions for VPG (no chatbot)
  if (action.action === "openChatbot") {
    return null;
  }

  return (
    <Link href={action.url || "#"} className={classes}>
      {action.label}
      {Icon && <Icon className="size-5" />}
    </Link>
  );
}
