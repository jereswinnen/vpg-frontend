import Map from "@/components/shared/Map";
import type { FlexMapBlock } from "../types";

interface MapBlockProps {
  block: FlexMapBlock;
}

export function MapBlock({ block: _ }: MapBlockProps) {
  return <Map className="w-full" />;
}
