"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import type Lenis from "lenis";
import { gsap, loadMotionPlugins, plugins } from "@/lib/gsap";
import { lenisOptions, prefersReducedMotion } from "@/lib/motion";
import { MotionReadyContext } from "@/lib/scroll-motion";
import { dictionaries, type Lang } from "@/content";
import type { Guest } from "@/lib/guest-code";
import { siteConfig } from "@/site.config";
import Doors from "./Doors";
import Hero from "./Hero";
import InvitationCard from "./InvitationCard";
import Countdown from "./Countdown";
import Programme from "./Programme";
import Venue from "./Venue";
import Gallery from "./Gallery";
import Calendar from "./Calendar";
import Closing from "./Closing";
import MusicToggle from "./MusicToggle";
import LangToggle from "./LangToggle";

const GoldDust = dynamic(() => import("./GoldDust"), { ssr: false });

const SEEN_KEY = "os-doors-opened";

type Props = { guest: Guest | null; invalidCode?: boolean };

export default function Invitation({ guest, invalidCode = false }: Props) {
  const [lang, setLang] = useState<Lang>(guest?.lang ?? "fr");
  const dict = dictionaries[lang];
  const [doorsGone, setDoorsGone] = useState(false);
  const [pluginsReady, setPluginsReady] = useState(false);
  const doorsGoneRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [returning, setReturning] = useState(false);
  const [music, setMusic] = useState<"unknown" | "playing" | "paused" | "missing">("unknown");
  const [footerInView, setFooterInView] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // First paint: lock scroll behind the doors, start at the top.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.classList.add("doors-closed");
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists on the client
      setReturning(localStorage.getItem(SEEN_KEY) === "1");
    } catch {
      /* private mode */
    }

    // Scroll plugins + Lenis load on the guest's first touch/key (the doors take ~2.5s to open,
    // plenty of time), with a fallback timer. They never compete with the first paint.
    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;
    let cancelled = false;
    const load = () =>
      Promise.all([loadMotionPlugins(), prefersReducedMotion() ? null : import("lenis")]).then(([, mod]) => {
        if (cancelled) return;
        if (mod) {
          lenis = new mod.default(lenisOptions);
          lenis.on("scroll", plugins.ScrollTrigger.update);
          raf = (time: number) => lenis!.raf(time * 1000);
          gsap.ticker.add(raf);
          gsap.ticker.lagSmoothing(0);
          if (!doorsGoneRef.current) lenis.stop();
          lenisRef.current = lenis;
        }
        setPluginsReady(true);
      });
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      triggers.forEach((t) => window.removeEventListener(t, start));
      void load();
    };
    const triggers = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    triggers.forEach((t) => window.addEventListener(t, start, { once: true, passive: true }));
    const fallback = window.setTimeout(start, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      triggers.forEach((t) => window.removeEventListener(t, start));
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      document.documentElement.classList.remove("doors-closed");
    };
  }, []);

  // The footer has its own music toggle: hide the floating one while it is on screen.
  useEffect(() => {
    if (!doorsGone) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(footer);
    return () => io.disconnect();
  }, [doorsGone, lang]);

  // Keep <html> in sync with the chosen language (fonts + direction).
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dictionaries[lang].dir;
    document.title = dictionaries[lang].meta.title;
  }, [lang]);

  const onOpenStart = useCallback(() => {
    // Inside the tap: browsers allow audio to start here.
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setMusic("playing");
          gsap.to(audio, {
            volume: siteConfig.music.volume,
            duration: siteConfig.music.fadeInMs / 1000,
            ease: "none",
            delay: 0.4,
          });
        })
        .catch(() => setMusic(audio.error ? "missing" : "paused"));
    }
    window.setTimeout(() => setRevealed(true), returning ? 250 : 1500);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [returning]);

  const onOpened = useCallback(() => {
    doorsGoneRef.current = true;
    setDoorsGone(true);
    document.documentElement.classList.remove("doors-closed");
    lenisRef.current?.start();
    // In case the tap came before the idle load finished.
    void loadMotionPlugins().then(() => plugins.ScrollTrigger.refresh());
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setMusic("playing");
          gsap.to(audio, { volume: siteConfig.music.volume, duration: 1.2, ease: "none" });
        })
        .catch(() => setMusic("missing"));
    } else {
      gsap.to(audio, {
        volume: 0,
        duration: 0.6,
        ease: "none",
        onComplete: () => {
          audio.pause();
          setMusic("paused");
        },
      });
    }
  }, []);

  const toggleLang = useCallback(() => setLang((l) => (l === "fr" ? "ar" : "fr")), []);

  const addressee = guest ? guest.envelopeLine || dict.joinNames(guest.names) : null;

  return (
    <div lang={lang} dir={dict.dir} className="relative" data-invitation style={{ "--nightfall": 0 } as CSSProperties}>
      <div className="sky" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* first in the DOM so keyboard users reach the language switch before anything else */}
      <div className="fixed end-4 top-4 z-[55]">
        <LangToggle dict={dict} compact onToggle={toggleLang} />
      </div>
      {!doorsGone && (
        <Doors
          dict={dict}
          addressee={addressee}
          returning={returning}
          onOpenStart={onOpenStart}
          onOpened={onOpened}
        />
      )}

      {/* keyed by language: SplitText wrappers are reverted before React swaps the text */}
      <MotionReadyContext.Provider value={doorsGone && pluginsReady}>
      {/* hidden (not just covered) until the doors open: nothing behind them costs paint or LCP */}
      <main
        key={lang}
        className="relative z-[1]"
        aria-hidden={!doorsGone ? true : undefined}
        style={{ visibility: revealed || doorsGone ? undefined : "hidden" }}
      >
        <Hero dict={dict} revealed={revealed} />
        <InvitationCard dict={dict} guest={guest} invalidCode={invalidCode} />
        <Countdown dict={dict} />
        <Programme dict={dict} />
        <Venue dict={dict} />
        <Gallery dict={dict} />
        <Calendar dict={dict} />
        <Closing
          dict={dict}
          lang={lang}
          controls={
            <>
              <LangToggle dict={dict} onToggle={toggleLang} />
              {(music === "playing" || music === "paused") && (
                <MusicToggle dict={dict} playing={music === "playing"} onToggle={toggleMusic} inline />
              )}
            </>
          }
        />
      </main>
      </MotionReadyContext.Provider>

      {doorsGone && pluginsReady && <GoldDust />}

      <audio ref={audioRef} src={siteConfig.music.src} preload="none" loop onError={() => setMusic("missing")} />
      {doorsGone && !footerInView && music !== "missing" && music !== "unknown" && (
        <MusicToggle dict={dict} playing={music === "playing"} onToggle={toggleMusic} />
      )}
    </div>
  );
}
