import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";

import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";

import "./globals.css";

// UI and body copy.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Editorial display headings only; see `font-serif` in globals.css.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Atelier",
  description: "Atelier storefront",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
