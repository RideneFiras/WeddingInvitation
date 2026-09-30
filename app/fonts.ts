import {
  Pinyon_Script,
  Cormorant_Garamond,
  Cormorant_SC,
  Jost,
} from "next/font/google";
import localFont from "next/font/local";

// Not preloaded: the names only appear after the doors open, so they must not compete with the doors.
export const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-pinyon",
});

// Variable font: one file per style covers 300–500.
export const cormorant = Cormorant_Garamond({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

export const cormorantSC = Cormorant_SC({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant-sc",
});

export const jost = Jost({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

// Full Arabic faces (Amiri, Aref Ruqaa) are self-hosted, trimmed subsets declared in
// app/globals.css (public/fonts/*-ar.woff2) and preloaded only on Arabic invitations.

/**
 * Tiny self-hosted subsets for the only Arabic shown in French mode (the "العربية" toggle and
 * the couple's Arabic names under the hero), so French visitors don't download full Arabic fonts.
 * Regenerate with scripts/subset-arabic.sh if the Arabic names change.
 */
export const amiriLabel = localFont({
  src: "./fonts-local/amiri-label.woff2",
  display: "swap",
  variable: "--font-amiri-label",
});
export const arefNames = localFont({
  src: "./fonts-local/aref-names.woff2",
  display: "swap",
  variable: "--font-aref-names",
});

export const fontVariables = [pinyon, cormorant, cormorantSC, jost, amiriLabel, arefNames]
  .map((f) => f.variable)
  .join(" ");
