import type { FlexMapBlock } from "../types";

interface MapBlockProps {
  block: FlexMapBlock;
}

export function MapBlock({ block }: MapBlockProps) {
  return (
    <div className="aspect-4/3 overflow-hidden bg-zinc-200">
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
}
