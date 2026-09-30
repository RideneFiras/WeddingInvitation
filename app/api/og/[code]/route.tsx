import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { decodeGuest } from "@/lib/guest-code";
import { dictionaries } from "@/content";
import { siteConfig } from "@/site.config";
import { shapeArabic } from "@/lib/arabic-shape";

// Personalized link preview (WhatsApp, iMessage…). Stateless: the guest is decoded from the code.

const fontDir = join(process.cwd(), "assets/fonts");
let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 500; style: "normal" | "italic" }[]> | null = null;
function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(fontDir, "PinyonScript-Regular.ttf")).then((data) => ({ name: "Pinyon", data, weight: 400 as const, style: "normal" as const })),
    readFile(join(fontDir, "CormorantGaramond-Regular.ttf")).then((data) => ({ name: "Cormorant", data, weight: 400 as const, style: "normal" as const })),
    readFile(join(fontDir, "CormorantGaramond-Italic.ttf")).then((data) => ({ name: "Cormorant", data, weight: 400 as const, style: "italic" as const })),
    readFile(join(fontDir, "CormorantSC-Medium.ttf")).then((data) => ({ name: "CormorantSC", data, weight: 500 as const, style: "normal" as const })),
    // Amiri with its OpenType layout tables stripped: text is pre-shaped by lib/arabic-shape.
    readFile(join(fontDir, "Amiri-OG.ttf")).then((data) => ({ name: "Amiri", data, weight: 400 as const, style: "normal" as const })),
  ]);
  return fontsPromise;
}

const C = {
  ivory: "#F7F1E6",
  paper: "#EFE6D4",
  ink: "#2B2118",
  goldDeep: "#8C6A2E",
  gold: "#B8924A",
  goldLight: "#E6CF95",
};

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const guest = decodeGuest(code);
  const lang = guest?.lang ?? "fr";
  const dict = dictionaries[lang];
  const fonts = await loadFonts();
  const who = guest ? guest.envelopeLine || dict.joinNames(guest.names) : null;
  const hasArabic = (s: string) => /[؀-ۿ]/.test(s);
  const [y, m, d] = siteConfig.date.iso.split("-");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `radial-gradient(ellipse at 30% 40%, #FFFDF7 0%, ${C.ivory} 55%, ${C.paper} 100%)`,
          fontFamily: "Cormorant",
          color: C.ink,
        }}
      >
        {/* left: the arch with the monogram */}
        <div style={{ width: 470, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <svg width="300" height="470" viewBox="0 0 200 300" style={{ position: "absolute", top: 96 }}>
            <path d="M10 300 V118 A92 92 0 1 1 190 118 V300" fill="none" stroke={C.gold} strokeWidth="1.3" />
            <path d="M20 300 V118 A82 82 0 1 1 180 118 V300" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.55" />
            <path d="M100 6 l5 8 l-5 8 l-5 -8 Z" fill={C.paper} stroke={C.gold} strokeWidth="1" />
          </svg>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 90, fontStyle: "italic", fontSize: 108, color: C.goldDeep }}>
            <span>{siteConfig.couple.monogram.first}</span>
            <span style={{ fontSize: 60, margin: "0 10px", color: C.gold }}>&amp;</span>
            <span>{siteConfig.couple.monogram.second}</span>
          </div>
        </div>

        {/* right: the words */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 80 }}>
          <div style={{ display: "flex", alignItems: "baseline", fontFamily: "CormorantSC", fontSize: 26, letterSpacing: 6, color: C.goldDeep, textTransform: "lowercase" }}>
            {lang === "ar" ? (
              <span style={{ fontFamily: "Amiri", fontSize: 32, letterSpacing: 0 }}>{shapeArabic("دعوة لحضور حفل زفاف")}</span>
            ) : (
              "invitation au mariage"
            )}
          </div>
          <div style={{ fontFamily: "Pinyon", fontSize: 104, lineHeight: 1.25, marginTop: 6, display: "flex", alignItems: "baseline" }}>
            <span>{siteConfig.couple.latin.first}</span>
            <span style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 64, color: C.gold, margin: "0 18px" }}>&amp;</span>
            <span>{siteConfig.couple.latin.second}</span>
          </div>
          <div style={{ height: 1, width: 420, background: `linear-gradient(90deg, ${C.gold}, rgba(184,146,74,0))`, margin: "18px 0 26px" }} />
          {who ? (
            <div style={{ display: "flex", flexDirection: lang === "ar" ? "row-reverse" : "row", alignItems: "baseline", fontSize: 46 }}>
              <span style={{ color: C.goldDeep, fontFamily: lang === "ar" ? "Amiri" : "Cormorant", fontStyle: lang === "ar" ? "normal" : "italic", marginLeft: lang === "ar" ? 14 : 0, marginRight: lang === "ar" ? 0 : 14 }}>
                {lang === "ar" ? shapeArabic(dict.meta.ogFor) : dict.meta.ogFor}
              </span>
              <span style={{ fontFamily: hasArabic(who) ? "Amiri" : "Cormorant", fontStyle: hasArabic(who) ? "normal" : "italic" }}>
                {shapeArabic(who)}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 46, fontStyle: "italic" }}>{dictionaries.fr.doors.generic}</div>
          )}
          <div style={{ display: "flex", marginTop: 26, fontSize: 40, letterSpacing: 3, color: C.ink }}>
            {`${d} · ${m} · ${y}`}
          </div>
          <div style={{ fontFamily: "CormorantSC", fontSize: 24, letterSpacing: 5, marginTop: 8, color: C.goldDeep, textTransform: "lowercase" }}>
            {`${siteConfig.venue.name} · ${siteConfig.venue.city.toLowerCase()}`}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
