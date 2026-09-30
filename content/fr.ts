import type { Dict } from "./types";
import { siteConfig } from "@/site.config";
import { coupleFr, dateParts, ofCoupleFr } from "@/lib/wedding";

const weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const { day, monthIndex, year, weekdayIndex } = dateParts;
const weekday = weekdays[weekdayIndex];
/** "jeudi 29 octobre 2026" */
const fullDate = `${weekday} ${day} ${months[monthIndex]} ${year}`;
const { venue } = siteConfig;

const fr: Dict = {
  lang: "fr",
  dir: "ltr",
  meta: {
    title: `${coupleFr} · ${day} ${months[monthIndex]} ${year}`,
    ogTitle: `Invitation au mariage ${ofCoupleFr}`,
    ogDescriptionGeneric: `Le ${fullDate} · ${venue.name}, ${venue.city}`,
    ogFor: "Pour",
  },
  doors: {
    attention: "À l'attention de",
    generic: "À nos invités",
    caption: "Touchez pour ouvrir",
    open: "Ouvrir l'invitation",
  },
  hero: {
    weekday: weekday[0].toUpperCase() + weekday.slice(1),
    and: "&",
    scroll: "Défiler",
  },
  invitation: {
    label: "L'invitation",
    genericSalutation: "Chers invités,",
    families: (a, b) =>
      `Les familles ${a} et ${b} ont l'immense joie de vous convier à la célébration du mariage de leurs enfants`,
    familiesFallback:
      "Nos familles ont l'immense joie de vous convier à la célébration du mariage de leurs enfants",
    dateLine: `Le ${fullDate}`,
    timeLine: (t) => `à ${t.replace(":", "h")}`,
    atVenue: `à ${venue.name}, ${venue.area}`,
    unknownCode:
      "Ce lien semble incomplet. Pour toute question, n'hésitez pas à contacter la famille.",
  },
  countdown: {
    label: "Le compte à rebours",
    lead: "Plus que",
    units: { days: "jours", hours: "heures", minutes: "minutes", seconds: "secondes" },
    unitsOne: { days: "jour", hours: "heure", minutes: "minute", seconds: "seconde" },
    after: "Merci d'avoir célébré avec nous",
  },
  programme: {
    label: "Le programme",
    title: "Le déroulé de la soirée",
    items: {
      arrival: { title: "Accueil des invités", note: "Autour d'un rafraîchissement, sous les arcades" },
      ceremony: { title: "La cérémonie", note: `L'union ${ofCoupleFr}` },
      dinner: { title: "Le dîner", note: "Un repas partagé en famille et entre amis" },
      celebration: { title: "La soirée", note: "Musique, danse et lumières jusqu'au bout de la nuit" },
    },
    timeTbd: "horaire à venir",
  },
  venue: {
    label: "Le lieu",
    intro: "Rendez-vous sous les arches de",
    maps: "Google Maps",
    waze: "Waze",
    mapTitle: "Plan d'accès",
  },
  gallery: { label: "Souvenirs" },
  calendar: {
    label: "Réservez la date",
    ics: "Ajouter au calendrier",
    google: "Google Agenda",
    eventTitle: `Mariage ${ofCoupleFr}`,
  },
  closing: {
    line: "Nous avons hâte de célébrer avec vous",
    signature: coupleFr,
  },
  ui: {
    music: { play: "Lancer la musique", pause: "Couper la musique" },
    language: "العربية",
    languageLabel: "Lire en arabe",
  },
  weekdays,
  months,
  salutations: { m: "Cher", f: "Chère", pl: "Chers", fpl: "Chères" },
  joinNames: (names) => names.join(" & "),
  share: {
    message: (salutation, names, link) =>
      `${salutation} ${names},\n\nC'est avec une immense joie que nous vous adressons notre invitation au mariage ${ofCoupleFr}, le ${fullDate}.\n\n${link}`,
  },
};

export default fr;
