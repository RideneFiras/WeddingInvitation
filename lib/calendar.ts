import { siteConfig, weddingStart } from "@/site.config";
import type { Dict } from "@/content/types";
import { coupleFr, slug } from "@/lib/wedding";

/** e.g. 20281014T190000Z */
function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function eventTimes() {
  const start = weddingStart();
  const end = new Date(start.getTime() + siteConfig.date.durationHours * 3600_000);
  return { start, end };
}

export function googleCalendarUrl(dict: Dict): string {
  const { start, end } = eventTimes();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: dict.calendar.eventTitle,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    location: `${siteConfig.venue.name}, ${siteConfig.venue.address}`,
    details: siteConfig.venue.googleMaps,
    ctz: siteConfig.date.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 calendar file for the wedding. */
export function buildIcs(dict: Dict): string {
  const { start, end } = eventTimes();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${coupleFr}//Invitation//FR`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:mariage-${slug}-${siteConfig.date.iso}@invitation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${esc(dict.calendar.eventTitle)}`,
    `LOCATION:${esc(`${siteConfig.venue.name}, ${siteConfig.venue.address}`)}`,
    `DESCRIPTION:${esc(siteConfig.venue.googleMaps)}`,
    `URL:${siteConfig.venue.googleMaps}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(dict.calendar.eventTitle)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
