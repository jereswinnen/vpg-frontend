interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d282.1898425145369!2d4.553737325774531!3d51.297028548584564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c4071dd803d855%3A0x1333e79c669ff11c!2sVPG%20Trappen!5e0!3m2!1sen!2sbe!4v1768481282620!5m2!1sen!2sbe"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="VPG Trappen location"
      className={className}
    />
  );
}
