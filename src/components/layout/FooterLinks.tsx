"use client";

import Link from "next/link";
import { PhoneIcon, InstagramIcon, FacebookIcon, MailIcon } from "lucide-react";
import { useTracking } from "@/lib/tracking";

interface FooterLinksProps {
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
}

export function FooterContactLinks({ phone, email }: FooterLinksProps) {
  const { track } = useTracking();

  const handleOutboundClick = (type: "phone" | "email") => {
    track("outbound_clicked", { type });
  };

  return (
    <>
      {phone && (
        <li>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors duration-300"
            onClick={() => handleOutboundClick("phone")}
          >
            <PhoneIcon className="size-4" />
            <span>{phone}</span>
          </a>
        </li>
      )}
      {email && (
        <li>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors duration-300"
            onClick={() => handleOutboundClick("email")}
          >
            <MailIcon className="size-4" />
            <span>{email}</span>
          </a>
        </li>
      )}
    </>
  );
}

export function FooterSocialLinks({ instagram, facebook }: FooterLinksProps) {
  const { track } = useTracking();

  const handleOutboundClick = (type: "instagram" | "facebook") => {
    track("outbound_clicked", { type });
  };

  if (!instagram && !facebook) return null;

  return (
    <ul className="flex gap-3 *:text-zinc-500 *:transition-colors *:duration-300 *:hover:text-zinc-700">
      {instagram && (
        <li>
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOutboundClick("instagram")}
          >
            <InstagramIcon className="size-5" />
          </Link>
        </li>
      )}
      {facebook && (
        <li>
          <Link
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOutboundClick("facebook")}
          >
            <FacebookIcon className="size-5" />
          </Link>
        </li>
      )}
    </ul>
  );
}
