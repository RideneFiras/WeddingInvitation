import type { Metadata } from "next";
import { preload } from "react-dom";
import Invitation from "@/components/invitation/Invitation";
import { decodeGuest } from "@/lib/guest-code";
import { dictionaries } from "@/content";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const guest = decodeGuest(code);
  const dict = dictionaries[guest?.lang ?? "fr"];
  const description = guest
    ? `${dict.meta.ogFor} ${guest.envelopeLine || dict.joinNames(guest.names)}`
    : dict.meta.ogDescriptionGeneric;
  const image = guest ? `/api/og/${code}` : "/api/og/_";
  return {
    title: dict.meta.title,
    description,
    openGraph: {
      title: dict.meta.ogTitle,
      description,
      type: "website",
      locale: guest?.lang === "ar" ? "ar_TN" : "fr_FR",
      images: [{ url: image, width: 1200, height: 630, alt: dict.meta.ogTitle }],
    },
    twitter: { card: "summary_large_image", title: dict.meta.ogTitle, description, images: [image] },
  };
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const guest = decodeGuest(code);
  // Arabic invitations: the doors are in Amiri, so fetch it with the HTML.
  if (guest?.lang === "ar") preload("/fonts/amiri-ar.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <Invitation guest={guest} invalidCode={!guest} />;
}
