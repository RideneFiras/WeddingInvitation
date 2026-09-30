import type { ProgrammeKey } from "@/site.config";

export type Lang = "fr" | "ar";

type Units = { days: string; hours: string; minutes: string; seconds: string };

export type Dict = {
  lang: Lang;
  dir: "ltr" | "rtl";
  meta: { title: string; ogTitle: string; ogDescriptionGeneric: string; ogFor: string };
  doors: { attention: string; generic: string; caption: string; open: string };
  hero: { weekday: string; and: string; scroll: string };
  invitation: {
    label: string;
    genericSalutation: string;
    families: (a: string, b: string) => string;
    familiesFallback: string;
    dateLine: string;
    timeLine: (hhmm: string) => string;
    atVenue: string;
    unknownCode: string;
  };
  countdown: {
    label: string;
    lead: string;
    units: Units;
    unitsOne: Units;
    /** Arabic has a distinct plural for 3–10. Optional. */
    unitsFew?: Units;
    after: string;
  };
  programme: {
    label: string;
    title: string;
    items: Record<ProgrammeKey, { title: string; note: string }>;
    timeTbd: string;
  };
  venue: { label: string; intro: string; maps: string; waze: string; mapTitle: string };
  gallery: { label: string };
  calendar: { label: string; ics: string; google: string; eventTitle: string };
  closing: { line: string; signature: string };
  ui: {
    music: { play: string; pause: string };
    language: string;
    languageLabel: string;
  };
  weekdays: string[];
  months: string[];
  /** Suggested salutations: masculine, feminine, plural, feminine plural. */
  salutations: { m: string; f: string; pl: string; fpl: string };
  joinNames: (names: string[]) => string;
  share: { message: (salutation: string, names: string, link: string) => string };
};
