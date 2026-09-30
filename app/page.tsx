import type { Metadata } from "next";
import Invitation from "@/components/invitation/Invitation";
import { dictionaries } from "@/content";

const fr = dictionaries.fr;
export const metadata: Metadata = {
  title: fr.meta.title,
  description: fr.meta.ogDescriptionGeneric,
  openGraph: {
    title: fr.meta.ogTitle,
    description: fr.meta.ogDescriptionGeneric,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/api/og/_", width: 1200, height: 630, alt: fr.meta.ogTitle }],
  },
  twitter: { card: "summary_large_image", title: fr.meta.ogTitle, images: ["/api/og/_"] },
};

/**
 * `/#<code>` links: the hash never reaches the server, so redirect to `/i/<code>`
 * as early as possible (inline, before hydration) to avoid flashing the generic doors.
 */
const hashRedirect = `(function(){var h=location.hash.slice(1);if(/^[A-Za-z0-9_-]{4,600}$/.test(h)){location.replace('/i/'+h);}})();`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hashRedirect }} />
      <Invitation guest={null} />
    </>
  );
}
