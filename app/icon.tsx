import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/site.config";

// Favicon: gold arch with the couple's monogram (from site.config.ts).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const italic = await readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Italic.ttf"));
  const { first, second } = siteConfig.couple.monogram;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F1E6", borderRadius: 14, position: "relative" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: "absolute", top: 0, left: 0 }}>
          <path d="M14 60 V28 A18 18 0 1 1 50 28 V60" fill="none" stroke="#B8924A" strokeWidth="2.4" />
        </svg>
        <div style={{ display: "flex", marginTop: 14, fontFamily: "Cormorant", fontStyle: "italic", fontSize: 22, color: "#8C6A2E" }}>
          {`${first}&${second}`}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: italic, style: "italic", weight: 400 }] },
  );
}
