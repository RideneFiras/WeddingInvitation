"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { ease, revealTrigger } from "@/lib/motion";
import { useScrollMotion } from "@/lib/scroll-motion";
import type { Dict } from "@/content/types";
import { siteConfig } from "@/site.config";

/** Photos inside arch masks. Not rendered at all while `siteConfig.photos` is empty. */
export default function Gallery({ dict }: { dict: Dict }) {
  const photos = siteConfig.photos;
  const root = useRef<HTMLElement>(null);

  useScrollMotion(
    root,
    () => {
      if (!photos.length) return;
      gsap.utils.toArray<HTMLElement>(".arch-photo").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: ease.big, scrollTrigger: { trigger: el, ...revealTrigger } },
        );
        gsap.fromTo(
          el.querySelector("img"),
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
  );

  if (!photos.length) return null;

  return (
    <section ref={root} className="relative px-5 py-24" aria-label={dict.gallery.label}>
      <p className="caps dusk-muted mb-10 text-center">{dict.gallery.label}</p>
      <div className="mx-auto grid max-w-[56rem] grid-cols-2 gap-4 sm:gap-8">
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            className={`arch-photo relative overflow-hidden ${i % 3 === 0 ? "col-span-2 mx-auto w-[78%]" : ""}`}
            style={{ borderRadius: "999px 999px 0 0", aspectRatio: i % 3 === 0 ? "4 / 5" : "2 / 3" }}
          >
            <Image
              src={photo.src}
              alt={photo.alt[dict.lang]}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 80vw, 600px"
              className="absolute inset-0 h-[116%] w-full -translate-y-[8%] object-cover"
            />
            <span className="pointer-events-none absolute inset-2 border border-gold-light/50" style={{ borderRadius: "999px 999px 0 0" }} />
          </figure>
        ))}
      </div>
    </section>
  );
}
