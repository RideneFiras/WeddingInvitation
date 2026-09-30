import type { Dict } from "./types";

const fr: Dict = {
  lang: "fr",
  dir: "ltr",
  meta: {
    title: "Omar & Saousen · 29 octobre 2026",
    ogTitle: "Invitation au mariage d'Omar & Saousen",
    ogDescriptionGeneric: "Le jeudi 29 octobre 2026 · Dar Bouraoui, Carthage",
    ogFor: "Pour",
  },
  doors: {
    attention: "À l'attention de",
    generic: "À nos invités",
    caption: "Touchez pour ouvrir",
    open: "Ouvrir l'invitation",
  },
  hero: {
    weekday: "Jeudi",
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
    dateLine: "Le jeudi 29 octobre 2026",
    timeLine: (t) => `à ${t.replace(":", "h")}`,
    atVenue: "à Dar Bouraoui, La Maâlga, Carthage",
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
      ceremony: { title: "La cérémonie", note: "L'union d'Omar & Saousen" },
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
    eventTitle: "Mariage d'Omar & Saousen",
  },
  closing: {
    line: "Nous avons hâte de célébrer avec vous",
    signature: "Omar & Saousen",
  },
  ui: {
    music: { play: "Lancer la musique", pause: "Couper la musique" },
    language: "العربية",
    languageLabel: "Lire en arabe",
  },
  weekdays: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  salutations: { m: "Cher", f: "Chère", pl: "Chers", fpl: "Chères" },
  joinNames: (names) => names.join(" & "),
  share: {
    message: (salutation, names, link) =>
      `${salutation} ${names},\n\nC'est avec une immense joie que nous vous adressons notre invitation au mariage d'Omar & Saousen, le jeudi 29 octobre 2026.\n\n${link}`,
  },
};

export default fr;
