import { doorPairSvg } from "@/components/ornaments/DoorPair";

// Prerendered at build time into a static, long-cached SVG.
export const dynamic = "force-static";

export function GET() {
  return new Response(doorPairSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
