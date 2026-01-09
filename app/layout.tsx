import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VPG",
  description: "VPG - Your trusted partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={instrumentSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <main>{children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
