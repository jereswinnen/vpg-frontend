import { TextBlock } from "./TextBlock";
import { ImageBlock } from "./ImageBlock";
import { MapBlock } from "./MapBlock";
import { FormBlock } from "./FormBlock";
import type { FlexibleBlock } from "../types";

// Map of block types to components
export const blockComponents = {
  flexTextBlock: TextBlock,
  flexImageBlock: ImageBlock,
  flexMapBlock: MapBlock,
  flexFormBlock: FormBlock,
} as const;

// Type guard to check if a block type is valid
export function isValidBlockType(
  type: string
): type is keyof typeof blockComponents {
  return type in blockComponents;
}

export type BlockType = keyof typeof blockComponents;
