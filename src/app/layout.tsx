import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { isReagentHost } from "@/lib/hosts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AsquareS — Building Bold Ideas",
  description:
    "AsquareS crafts innovative digital products — AR 3D Menu for restaurants, AI Real Estate Call Agent, and Spill the Tea social app.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host");
  const productHost = isReagentHost(host);

  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">
        <AppProviders>
          {productHost ? children : <SmoothScroll>{children}</SmoothScroll>}
        </AppProviders>
      </body>
    </html>
  );
}
