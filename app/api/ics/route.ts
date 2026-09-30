import { buildIcs } from "@/lib/calendar";
import { dictionaries } from "@/content";
import { slug } from "@/lib/wedding";

export function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") === "ar" ? "ar" : "fr";
  return new Response(buildIcs(dictionaries[lang]), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
