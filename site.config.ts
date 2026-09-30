/**
 * Every wedding fact lives here. Components never hardcode names, dates or places.
 * Anything marked TODO must be supplied / confirmed by the couple (see README).
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
    latin: { first: "Omar", second: "Saousen" },
    // TODO: Arabic spelling must be confirmed by the couple before launch.
    arabic: { first: "عمر", second: "سوسن" },
    monogram: { first: "O", second: "S" },
  },

  // TODO: family names for the invitation text ("Les familles X et Y…").
  // While null, the card reads "Nos familles ont l'immense joie…".
  families: {
    fr: null as null | { first: string; second: string },
    ar: null as null | { first: string; second: string },
  },

  date: {
    /** Local wall-clock date and time at the venue. */
    iso: "2026-10-29",
    // TODO: confirm the start time (placeholder given in the brief).
    time: "20:00",
    timezone: "Africa/Tunis",
    /** Africa/Tunis is UTC+1 all year (no DST). Keep in sync with `timezone`. */
    utcOffset: "+01:00",
    /** Used for the calendar event end. TODO: confirm. */
    durationHours: 6,
  },

  venue: {
    name: "Dar Bouraoui",
    // TODO: confirm the Arabic spelling of the venue name.
    nameAr: "دار بوراوي",
    areaAr: "المعلقة، قرطاج",
    area: "La Maâlga, Carthage",
    address: "Rue Qualité de la Vie, La Maâlga, Carthage, Tunisie",
    addressAr: "نهج جودة الحياة، المعلقة، قرطاج، تونس",
    googleMaps: "https://maps.app.goo.gl/vfMoacpSpkjp6fYT7",
    waze: "https://waze.com/ul?q=Dar%20Bouraoui%20Carthage",
  },

  /**
   * TODO: the couple must supply every programme time.
   * `time: null` renders as "horaire à venir" / "الموعد لاحقًا".
   */
  programme: [
    { key: "arrival", time: null },
    { key: "ceremony", time: null },
    { key: "dinner", time: null },
    { key: "celebration", time: null },
  ] as { key: ProgrammeKey; time: string | null }[],

  /** TODO: photos supplied by the couple. While empty, the gallery is not rendered. */
  photos: [] as Photo[],

  /** TODO: soft instrumental track at /public/audio/theme.mp3. Toggle hides itself if the file is missing. */
  music: { src: "/audio/theme.mp3", volume: 0.4, fadeInMs: 2000 },

  /**
   * TODO: public production URL (used for OG tags). Set NEXT_PUBLIC_SITE_URL;
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
