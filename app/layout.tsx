import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "VPG",
  description: "VPG - Maatwerk voor binnen en buiten",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={instrumentSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main className="o-grid py-8 md:py-14">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
