import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="VPG Logo"
      width={114}
      height={48}
      className={className}
      style={{ width: "auto", height: "auto" }}
    />
  );
}
