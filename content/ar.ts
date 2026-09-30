import type { Dict } from "./types";
import { siteConfig } from "@/site.config";
import { coupleAr, dateParts } from "@/lib/wedding";

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
// Tunisian month names
const months = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const { day, monthIndex, year, weekdayIndex } = dateParts;
const weekday = weekdays[weekdayIndex];
/** e.g. "السبت 14 أكتوبر 2028" */
const fullDate = `${weekday} ${day} ${months[monthIndex]} ${year}`;
const { venue } = siteConfig;

/**
 * TODO: have a native speaker review this file before launch.
 * Written as formal Arabic suited to a Tunisian wedding invitation, not a literal translation.
 */
const ar: Dict = {
  lang: "ar",
  dir: "rtl",
  meta: {
    title: `${coupleAr} · ${day} ${months[monthIndex]} ${year}`,
    ogTitle: `دعوة لحضور حفل زفاف ${coupleAr}`,
    ogDescriptionGeneric: `${fullDate} · ${venue.nameAr}، ${venue.cityAr}`,
    ogFor: "إلى",
  },
  doors: {
    attention: "إلى حضرة",
    generic: "إلى ضيوفنا الكرام",
    caption: "المس للفتح",
    open: "افتح الدعوة",
  },
  hero: {
    weekday,
    and: "و",
    scroll: "مرّر",
  },
  invitation: {
    label: "الدعوة",
    genericSalutation: "ضيوفنا الأعزّاء،",
    families: (a, b) =>
      `بكل فرح وسرور، تتشرّف عائلتا ${a} و${b} بدعوتكم لحضور حفل زفاف أبنائهما`,
    familiesFallback: "بكل فرح وسرور، تتشرّف عائلتانا بدعوتكم لحضور حفل زفاف أبنائهما",
    dateLine: `يوم ${fullDate}`,
    timeLine: (t) => `على الساعة ${t}`,
    atVenue: `ب${venue.nameAr}، ${venue.areaAr}`,
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
      ceremony: { title: "مراسم الزفاف", note: `قِران ${coupleAr}` },
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
    eventTitle: `حفل زفاف ${coupleAr}`,
  },
  closing: {
    line: "ننتظركم بشوق لنحتفل معًا",
    signature: coupleAr,
  },
  ui: {
    music: { play: "تشغيل الموسيقى", pause: "إيقاف الموسيقى" },
    language: "Français",
    languageLabel: "Lire en français",
  },
  weekdays,
  months,
  salutations: { m: "عزيزي", f: "عزيزتي", pl: "أعزّائي", fpl: "عزيزاتي" },
  // Arabic "و" attaches to an Arabic name ("كريم وأميرة"); with Latin names it stands alone.
  joinNames: (names) => names.join(names.every((n) => /[\u0600-\u06FF]/.test(n)) ? " و" : " و "),
  share: {
    message: (salutation, names, link) =>
      `${salutation} ${names}،\n\nبكل فرح وسرور، يسعدنا أن نوجّه إليكم دعوتنا لحضور حفل زفاف ${coupleAr}، يوم ${fullDate}.\n\n${link}`,
  },
};

export default ar;
