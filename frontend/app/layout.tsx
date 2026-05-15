import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Applytics",
  description: "Visual recruitment tracking with river flow analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body
      suppressHydrationWarning
      className="min-h-full bg-[#07090d] text-white">
        {children}
      </body>
    </html>
  );
}
