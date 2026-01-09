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

// Simple header without data fetching
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="o-grid py-4">
        <div className="col-span-full flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-[var(--c-accent-dark)]">
            VPG
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/" className="font-medium text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="/realisaties" className="font-medium text-gray-700 hover:text-gray-900">
              Realisaties
            </a>
            <a href="/contact" className="font-medium text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Simple footer without data fetching
function Footer() {
  return (
    <footer className="bg-[var(--c-accent-dark)] py-16 text-white">
      <div className="o-grid">
        <div className="col-span-full text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} VPG. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={instrumentSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
