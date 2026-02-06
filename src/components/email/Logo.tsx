import { Img } from "@react-email/components";
import * as React from "react";

/**
 * Email logo using a hosted PNG image for maximum email client compatibility.
 * SVG is NOT reliably supported - Outlook desktop strips it entirely.
 *
 * The logo is hosted on vpg.be for reliability.
 */
export function EmailLogo() {
  return (
    <Img
      src="https://vpg.be/images/logo.png"
      alt="VPG"
      width={120}
      height={41}
      style={{
        display: "block",
        outline: "none",
        border: "none",
        textDecoration: "none",
      }}
    />
  );
}
