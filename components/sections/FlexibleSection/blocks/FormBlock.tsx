import type { FlexFormBlock } from "../types";

interface FormBlockProps {
  block: FlexFormBlock;
}

export function FormBlock({ block }: FormBlockProps) {
  const { title, subtitle } = block;

  return (
    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {subtitle && <p className="text-sm">{subtitle}</p>}
      <p className="mt-4">Contact form placeholder</p>
    </div>
  );
}
