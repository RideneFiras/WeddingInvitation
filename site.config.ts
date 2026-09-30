/**
 * Every wedding fact lives here. Components never hardcode names, dates or places.
 * This is the template's placeholder data: replace it with your own (see README).
 */

export type ProgrammeKey = "arrival" | "ceremony" | "dinner" | "celebration";

export type Photo = {
  /** Path under /public, e.g. "/photos/01.jpg" */
  src: string;
  width: number;
  height: number;
  alt: { fr: string; ar: string };
};

export const siteConfig = {
  couple: {
    // Replace with the couple's first names (Latin script: hero, cards, previews).
    latin: { first: "Name", second: "Name" },
    // Arabic spelling of the same names. After changing them, run scripts/subset-arabic.sh "<first> و <second>".
    arabic: { first: "الاسم", second: "الاسم" },
    // Letters on the wax seal, favicon and closing monogram.
    monogram: { first: "N", second: "N" },
  },

  // Family names for the invitation text ("Les familles X et Y…").
  // While null, the card reads "Nos familles ont l'immense joie…".
  families: {
    fr: null as null | { first: string; second: string },
    ar: null as null | { first: string; second: string },
  },

  date: {
    /** Local wall-clock date and time at the venue (YYYY-MM-DD, HH:MM). */
    iso: "2028-10-14",
    time: "20:00",
    timezone: "Africa/Tunis",
    /** UTC offset of `timezone` on the wedding day, e.g. "+01:00" (Africa/Tunis has no DST). */
    utcOffset: "+01:00",
    /** Used for the calendar event end. */
    durationHours: 6,
  },

  venue: {
    name: "Venue Name",
    nameAr: "اسم القاعة",
    area: "Neighbourhood, City",
    areaAr: "الحي، المدينة",
    /** Short place name shown with the venue (hero, previews). */
    city: "City",
    cityAr: "المدينة",
    address: "Street address, Neighbourhood, City, Country",
    addressAr: "العنوان، الحي، المدينة، البلد",
    googleMaps: "https://maps.google.com/?q=Venue%20Name",
    waze: "https://waze.com/ul?q=Venue%20Name",
  },

  /**
   * Programme times (HH:MM). `time: null` renders as "horaire à venir" / "الموعد لاحقًا".
   * Titles and descriptions live in content/fr.ts and content/ar.ts.
   */
  programme: [
    { key: "arrival", time: "19:30" },
    { key: "ceremony", time: "20:00" },
    { key: "dinner", time: "21:00" },
    { key: "celebration", time: "22:30" },
  ] as { key: ProgrammeKey; time: string | null }[],

  /** Photos in /public/photos. While empty, the gallery is not rendered. */
  photos: [] as Photo[],

  /** Soft instrumental track at /public/audio/theme.mp3. The toggle hides itself if the file is missing. */
  music: { src: "/audio/theme.mp3", volume: 0.4, fadeInMs: 2000 },

  /**
   * Public production URL (used for OG tags). Set NEXT_PUBLIC_SITE_URL;
   * on Vercel it falls back to the project's production domain.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
} as const;

export type SiteConfig = typeof siteConfig;

/** The ceremony start as an absolute Date. */
export function weddingStart(): Date {
  const { iso, time, utcOffset } = siteConfig.date;
  return new Date(`${iso}T${time}:00${utcOffset}`);
}
