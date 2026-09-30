import type { Dict } from "./types";

/**
 * TODO: have a native speaker review this file before launch.
 * Written as formal Arabic suited to a Tunisian wedding invitation, not a literal translation.
 */
const ar: Dict = {
  lang: "ar",
  dir: "rtl",
  meta: {
    title: "عمر و سوسن · 29 أكتوبر 2026",
    ogTitle: "دعوة لحضور حفل زفاف عمر و سوسن",
    ogDescriptionGeneric: "الخميس 29 أكتوبر 2026 · دار بوراوي، قرطاج",
    ogFor: "إلى",
  },
  doors: {
    attention: "إلى حضرة",
    generic: "إلى ضيوفنا الكرام",
    caption: "المس للفتح",
    open: "افتح الدعوة",
  },
  hero: {
    weekday: "الخميس",
    and: "و",
    scroll: "مرّر",
  },
  invitation: {
    label: "الدعوة",
    genericSalutation: "ضيوفنا الأعزّاء،",
    families: (a, b) =>
      `بكل فرح وسرور، تتشرّف عائلتا ${a} و${b} بدعوتكم لحضور حفل زفاف أبنائهما`,
    familiesFallback: "بكل فرح وسرور، تتشرّف عائلتانا بدعوتكم لحضور حفل زفاف أبنائهما",
    dateLine: "يوم الخميس 29 أكتوبر 2026",
    timeLine: (t) => `على الساعة ${t}`,
    atVenue: "بدار بوراوي، المعلقة، قرطاج",
    unknownCode: "يبدو أن هذا الرابط غير مكتمل. لأي استفسار، يسعدنا تواصلكم مع العائلة.",
  },
  countdown: {
    label: "العدّ التنازلي",
    lead: "لم يبقَ سوى",
    units: { days: "يومًا", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" },
    unitsOne: { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" },
    unitsFew: { days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ" },
    after: "شكرًا لمشاركتكم فرحتنا",
  },
  programme: {
    label: "البرنامج",
    title: "مجريات السهرة",
    items: {
      arrival: { title: "استقبال الضيوف", note: "مع مشروبات منعشة تحت الأقواس" },
      ceremony: { title: "مراسم الزفاف", note: "قِران عمر و سوسن" },
      dinner: { title: "العشاء", note: "مائدة تجمع الأهل والأحبّة" },
      celebration: { title: "السهرة", note: "موسيقى ورقص وأضواء حتى آخر الليل" },
    },
    timeTbd: "الموعد لاحقًا",
  },
  venue: {
    label: "المكان",
    intro: "موعدنا تحت أقواس",
    maps: "خرائط Google",
    waze: "Waze",
    mapTitle: "خريطة الوصول",
  },
  gallery: { label: "ذكريات" },
  calendar: {
    label: "احفظوا الموعد",
    ics: "أضف إلى التقويم",
    google: "تقويم Google",
    eventTitle: "حفل زفاف عمر و سوسن",
  },
  closing: {
    line: "ننتظركم بشوق لنحتفل معًا",
    signature: "عمر و سوسن",
  },
  ui: {
    music: { play: "تشغيل الموسيقى", pause: "إيقاف الموسيقى" },
    language: "Français",
    languageLabel: "Lire en français",
  },
  weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  salutations: { m: "عزيزي", f: "عزيزتي", pl: "أعزّائي", fpl: "عزيزاتي" },
  // Arabic "و" attaches to an Arabic name ("كريم وأميرة"); with Latin names it stands alone.
  joinNames: (names) => names.join(names.every((n) => /[\u0600-\u06FF]/.test(n)) ? " و" : " و "),
  share: {
    message: (salutation, names, link) =>
      `${salutation} ${names}،\n\nبكل فرح وسرور، يسعدنا أن نوجّه إليكم دعوتنا لحضور حفل زفاف عمر و سوسن، يوم الخميس 29 أكتوبر 2026.\n\n${link}`,
  },
};

export default ar;
