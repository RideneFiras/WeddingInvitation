import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { siteConfig } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Omar & Saousen · 29 octobre 2026",
  description: "Le jeudi 29 octobre 2026 · Dar Bouraoui, Carthage",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F1E6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
