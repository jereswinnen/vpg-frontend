import { Instrument_Sans } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <div className="flex flex-col gap-y-10 md:gap-y-24">
          <Header />
          <main className="o-grid grid-cols-subgrid gap-y-18! md:gap-y-30!">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
