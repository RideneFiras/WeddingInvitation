import type { Metadata } from "next";
import AdminGenerator from "@/components/admin/AdminGenerator";
import { siteConfig } from "@/site.config";
import { coupleFr } from "@/lib/wedding";

export const metadata: Metadata = { title: `Invitations · ${coupleFr}`, robots: { index: false } };

/** Things the couple still has to supply (shown as a reminder at the top of the generator). */
function missingContent(): string[] {
  const missing: string[] = [];
  if (!siteConfig.families.fr || !siteConfig.families.ar) missing.push("Noms des familles (site.config.ts → families)");
  if (siteConfig.programme.some((p) => !p.time)) missing.push("Horaires du programme (site.config.ts → programme)");
  if (siteConfig.photos.length === 0) missing.push("Photos (site.config.ts → photos) — la galerie reste masquée");
  missing.push(`Heure de début à confirmer (${siteConfig.date.time} actuellement) et orthographe arabe des prénoms`);
  return missing;
}

export default function AdminPage() {
  return <AdminGenerator missing={missingContent()} />;
}
