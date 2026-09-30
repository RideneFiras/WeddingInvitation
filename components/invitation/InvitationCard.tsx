"use client";

import { useRef } from "react";
import type { Dict } from "@/content/types";
import { translateSalutation } from "@/content";
import type { Guest } from "@/lib/guest-code";
import { useReveal } from "@/lib/reveal";
import { siteConfig } from "@/site.config";
import { Divider, QallalineVase } from "../ornaments/Ornaments";

type Props = { dict: Dict; guest: Guest | null; invalidCode: boolean };

export default function InvitationCard({ dict, guest, invalidCode }: Props) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const t = dict.invitation;
  const families = siteConfig.families[dict.lang];
  const salutation = guest
    ? guest.lang === dict.lang
      ? guest.salutation
      : translateSalutation(guest.salutation, dict.lang)
    : null;
  const names = guest ? dict.joinNames(guest.names) : null;
  const { latin, arabic } = siteConfig.couple;

  return (
    <section ref={root} className="relative px-5 py-24 sm:py-32" aria-labelledby="invitation-label">
      <div className="mx-auto flex max-w-[24rem] flex-col items-center">
        <p id="invitation-label" data-reveal="fade" className="caps mb-8 text-gold-deep">
          {t.label}
        </p>

        <div data-reveal="fade" className="invitation-card relative w-full">
          {/* the paper: arched top, deckled bottom edge */}
          <div className="paper-card absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-[10px] bottom-[18px] border border-gold/60"
            style={{ borderRadius: "999px 999px 0 0 / 11rem 11rem 0 0", borderBottom: "none" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[15px] bottom-[18px] border border-gold/30"
            style={{ borderRadius: "999px 999px 0 0 / 10.4rem 10.4rem 0 0", borderBottom: "none" }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center px-8 pb-14 pt-12 text-center">
            <QallalineVase className="mb-6 h-24 w-auto text-gold" />

            {guest ? (
              <p className="font-display text-[1.45rem] leading-snug italic text-ink" data-reveal="fade">
                {salutation}{" "}
                <span className="gold-text gold-sheen whitespace-nowrap text-[1.9rem] not-italic font-medium">
                  {names}
                </span>
                {dict.lang === "ar" ? "،" : ","}
              </p>
            ) : (
              <p className="font-display text-[1.45rem] leading-snug italic text-ink" data-reveal="fade">
                {t.genericSalutation}
              </p>
            )}

            <p
              data-reveal="lines"
              className="font-serif-body mt-6 text-[1.25rem] leading-[1.55] text-ink"
            >
              {families ? t.families(families.first, families.second) : t.familiesFallback}
            </p>

            <p className="mt-6" data-reveal="fade">
              {dict.lang === "ar" ? (
                <span className="gold-text font-ar-names text-[2.6rem] leading-[1.4]">
                  {arabic.first} و {arabic.second}
                </span>
              ) : (
                <span className="font-names text-[2.9rem] leading-[1.2] text-ink">
                  {latin.first} <span className="gold-text font-display text-[0.7em] italic">&amp;</span>{" "}
                  {latin.second}
                </span>
              )}
            </p>

            <Divider className="my-7 w-40" jasmine />

            <p data-reveal="lines" className="font-display text-[1.3rem] leading-[1.5] text-ink">
              <strong className="font-medium">{t.dateLine}</strong>
              <br />
              <span className="lining">{t.timeLine(siteConfig.date.time)}</span>
              <br />
              {t.atVenue}
            </p>
          </div>
        </div>

        {invalidCode && (
          <p className="mt-8 max-w-[20rem] text-center text-[0.95rem] text-ink/75" role="note">
            {t.unknownCode}
          </p>
        )}
      </div>
    </section>
  );
}
