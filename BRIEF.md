# Omar & Saousen: Wedding Invitation Website, Project Brief

> You are starting in an empty folder with no other context. This file is the single source of truth. Read all of it before writing code. When something here conflicts with your defaults, this file wins.

---

## 1. What we are building

A personalized digital wedding invitation for **Omar & Saousen**, a Tunisian couple.

- **Date:** Thursday 29 October 2026 (jeudi 29 octobre 2026 / الخميس 29 أكتوبر 2026)
- **Venue:** Dar Bouraoui, Rue Qualité de la Vie, La Maâlga, Carthage, Tunisia
- **Map link:** https://maps.app.goo.gl/vfMoacpSpkjp6fYT7
- **Time:** TBD (use placeholder `20:00`, timezone `Africa/Tunis`, keep it in config)
- **Arabic names:** عمر و سوسن (placeholder, must be confirmed by the couple before launch)

The core idea: an admin types one or two guest names, the system generates a short code, and that guest gets a link that opens an invitation addressed **to them by name**. It must feel like a hand-delivered, one-of-one invitation, not a template.

**The design is the whole project.** Functionality is simple. What matters is that a guest opening the link on their phone from WhatsApp feels like they received something luxurious and personal. If a choice is between "more features" and "more polish", pick polish.

---

## 2. Who opens it, and on what

- 95% of guests open the link **on a phone, from WhatsApp**, many on mid-range Android devices on mobile data in Tunisia.
- Ages range from young cousins to grandparents. Text must be readable (min 16px body, strong contrast on key info: date, time, place).
- Languages: **French primary, Arabic secondary** (full RTL support). Each invite has a language field that decides the default; a small toggle lets the guest switch.
- Design mobile-first at 375 to 430px wide. Desktop is a nice-to-have enhancement, not the primary canvas.

---

## 3. Art direction (read this twice)

### 3.1 The mood, taken from the real venue

The venue's own imagery shows: ivory and white rooms, tall crystal chandeliers, rows of white arches, hanging greenery, champagne and gold accents, and a night party with sparklers held up around the couple. Couples there wear traditional Tunisian dress (jebba, embroidered gowns) and the venue uses gold Arabic calligraphy over photos.

So the site is **"Carthage, dusk to night"**:

- **Act I (day):** ivory paper, white arches, hairline gold, jasmine, soft greenery. Calm, bright, editorial.
- **Act II (night):** as the guest scrolls toward the venue and closing sections, the page slowly transitions to a deep night blue with warm gold light, ending with a sparkler / gold-dust moment that echoes the real party.

This day-to-night scroll is the signature narrative. It gives the page a beginning, middle, and end instead of a stack of identical sections.

### 3.2 Tunisian identity (make it specific, not generic "Arabic")

- **The arch:** Tunisian doorways and arcades. Use arch-shaped frames (pointed / horseshoe arch silhouette) as masks for images and as section frames.
- **The door:** Carthage and Sidi Bou Said are famous for arched studded doors. The opening moment is a pair of arched doors (see 4.1), not the envelope every other invitation site uses.
- **Qallaline tiles:** traditional Tunis tilework from the 17th to 18th centuries, painted with vases, plants, and arches in green, blue, and ochre. Use it as **line-art inspiration only** (thin gold outlines of a vase with vines inside an arch) for dividers and corner ornaments. Never as a loud colorful pattern fill.
- **Jasmine (machmoum):** small line-drawn jasmine sprigs as a recurring accent.
- **Chandelier:** one delicate line-drawn chandelier can appear in Act II, lighting up (gold glow) as it enters view.

### 3.3 Color tokens (define as CSS variables, use only these)

| Token | Hex | Use |
|---|---|---|
| `--ivory` | `#F7F1E6` | Main background, Act I |
| `--paper` | `#EFE6D4` | Cards, door panels, secondary surfaces |
| `--ink` | `#2B2118` | Body text on light |
| `--gold-deep` | `#8C6A2E` | Gold shadows, small text on ivory |
| `--gold` | `#B8924A` | Hairlines, ornaments |
| `--gold-light` | `#E6CF95` | Gold highlights, text on night |
| `--sage` | `#7E8B6A` | Greenery accents only |
| `--night` | `#0E1526` | Act II background |
| `--night-soft` | `#1A2338` | Act II surfaces |
| `--jasmine` | `#FFFDF7` | Highlights, light glow |

**Gold is never a flat yellow fill.** Gold text and ornaments use a linear gradient (`--gold-deep` to `--gold-light` to `--gold`) with `background-clip: text`, plus an optional slow sheen (animated `background-position`, 6 to 8 second loop, very subtle).

### 3.4 Typography (Google Fonts, all OFL)

| Role | Font | Notes |
|---|---|---|
| Couple's names (Latin) | **Pinyon Script** | Names only. Never for sentences. |
| Display / headings | **Cormorant Garamond** (300, 400, 500, italic) | Large, light weight, generous letter spacing on caps |
| Small-caps labels | **Cormorant SC** | Section labels like "LE PROGRAMME", tracking 0.2em |
| Body / UI | **Jost** (300, 400) | Clean contrast to the serif |
| Arabic names | **Aref Ruqaa** | Calligraphic, for عمر و سوسن |
| Arabic text | **Amiri** | All Arabic body copy |

Rules:
- **Banned fonts:** Inter, Playfair Display, Poppins, Montserrat, Great Vibes, Dancing Script, Cinzel. They are the default "AI wedding" look we are avoiding.
- Use `font-variant-numeric: oldstyle-nums` in body serif. Date numerals in hero use lining figures, large.
- If the couple later provides a custom calligraphy SVG of their names (recommended, a calligrapher can draw it), it replaces the font-rendered names and is animated with a stroke/mask draw.

### 3.5 Texture and materials

- A subtle paper grain over the whole page: SVG `feTurbulence` noise as a fixed overlay, opacity 0.04 to 0.07, `pointer-events: none`.
- Hairline rules (1px gold, sometimes with a small diamond or jasmine at the center) separate content.
- Soft vignette on Act II.
- Deckled / torn-paper edge is allowed once (e.g. the invitation card inside the doors), never everywhere.

### 3.6 Layout principles

- Editorial, not "landing page". Think luxury stationery and printed menus: centered compositions are fine but vary rhythm between sections (a full-bleed moment, then an intimate narrow column, then an asymmetric split).
- Generous whitespace. Sections breathe; each one has one focal element.
- Frames and arches instead of rounded card boxes.

### 3.7 Anti-slop list (do NOT do any of these)

- No purple/pink/blue "AI" gradients, no glassmorphism, no neon glows.
- No emoji anywhere. No ✨. No icon-library icons used as decoration (lucide/heroicons are OK only inside the admin panel).
- No grid of identical rounded cards with drop shadows.
- No bouncy / elastic / back easing. No spinning, no wobbling.
- No stock-photo couples, no clip-art rings or doves.
- No section that is just "Heading + paragraph + button" three times in a row.
- No "Lorem ipsum" left in the final build; use the real copy in section 6 with clearly marked `TODO` placeholders.

---

## 4. The experience, section by section

Each section has one signature motion moment. Not more.

### 4.1 The Doors (entry gate)
- Full-screen. Two tall arched doors in `--paper` with fine gold studs and a gold arch outline, closed.
- Above or on the doors: the guest's name, handwritten feel: *"À l'attention de Mme & M. Ben Salah"* (from the invite record). Generic version on `/`: *"À nos invités"*.
- Center: a **wax seal** with the monogram **O & S**. Pulses very gently. Caption: *"Touchez pour ouvrir"* / *"المس للفتح"*.
- On tap: seal cracks (two halves separate, small particles), doors swing open with 3D perspective (`rotateY`, transform-origin at hinges, ~1.4s, `expo.inOut`), warm light floods through the gap, page scroll unlocks.
- This tap is also the user gesture that unlocks audio (browsers block autoplay otherwise).
- Scroll is locked until the doors open. Returning visitors (localStorage flag, wrapped in try/catch) see a shortened 0.6s version.

### 4.2 Hero, the names
- *Omar* and *Saousen* in Pinyon Script, very large, drawn in: use a mask/clip reveal left to right (or SVG stroke draw if using a calligraphy SVG). The "&" appears last, in Cormorant italic, gold.
- Arabic names in Aref Ruqaa below, smaller, fading up.
- Date as a typographic composition: `29 · 10 · 2026` in Cormorant, with "Jeudi" above in small caps.
- Background: ivory with a faint arch silhouette, subtle parallax on scroll.

### 4.3 The personal invitation
- The heart of personalization. An invitation card inside an arch frame:
  - *"Chère Leïla,"* / *"Chers Karim & Amira,"* (salutation + names from DB)
  - *"Les familles [TODO: family names] ont l'immense joie de vous convier au mariage de leurs enfants Omar & Saousen."*
- Text reveals line by line (GSAP SplitText, `type: "lines"`, `mask: "lines"`, lines slide up from 100%, stagger 0.08s).
- The guest's name should feel special: gold gradient, slightly larger.

### 4.4 Countdown
- Days / hours / minutes / seconds to 29 Oct 2026 20:00 Africa/Tunis.
- Numbers in Cormorant, lining figures. Each digit change is a quick vertical roll (old flip-clock feel, but refined; no 3D flip cards).
- After the date passes: replace with *"Merci d'avoir célébré avec nous"*.

### 4.5 Le Programme (timeline)
- Items (all TODO placeholders in config): arrival, ceremony, dinner, celebration.
- A thin vertical gold line **draws itself** as you scroll (ScrollTrigger scrub), each item appears as the line reaches it, with a small jasmine or arch icon drawn in line-art.

### 4.6 Le Lieu, the venue (start of day-to-night transition)
- Background color begins interpolating from `--ivory` to `--night` across this section (ScrollTrigger scrub on CSS variables).
- "Dar Bouraoui, Carthage" in large display type. Address below.
- A stylized map card: do NOT embed a raw Google Maps iframe as the main visual. Instead a minimal illustrated card (arch frame, "La Maâlga, Carthage", a small gold pin) with two buttons: **Google Maps** (the link above) and **Waze** (`https://waze.com/ul?q=Dar%20Bouraoui%20Carthage`).
- Optional line-drawn chandelier that lights up (gold glow filter) when centered.

### 4.7 Gallery (hidden until photos exist)
- The couple will provide photos later. Build the component, driven by a `photos` array in config; if empty, the section is not rendered.
- Photos shown inside arch-shaped masks, revealing with an SVG mask or clip-path wipe on scroll, slight parallax inside the mask.

### 4.8 RSVP
- On night background. Form: attending yes/no, number of guests (1 to `seats_max` from the invite), optional message to the couple.
- Submit updates the invite's RSVP; the guest can change it until a deadline (config, TODO date).
- Confirmation state is its own small moment: a gold line draws a check-free ornament, text *"Merci, votre réponse a bien été enregistrée"*.
- Buttons: "Ajouter au calendrier" (downloads `.ics` generated at `/api/ics`, and a Google Calendar link).

### 4.9 Closing
- Full night. Gold dust / sparkler particles drift upward (see 5.4), echoing the real sparkler moment at the venue.
- *"Nous avons hâte de célébrer avec vous"* + monogram O & S.
- Tiny footer: language toggle, music toggle.

### 4.10 Global elements
- Floating music toggle (bottom corner, small gold circle, animated equalizer bars when playing). Music file is a TODO asset (`/public/audio/theme.mp3`), soft instrumental; fade in over 2s after doors open; volume 0.4.
- Language toggle FR / AR. Switching to AR flips `dir="rtl"`, swaps fonts to Amiri / Aref Ruqaa, mirrors asymmetric layouts.

---

## 5. Motion system

### 5.1 Libraries (use exactly these)

| Library | Purpose |
|---|---|
| **GSAP 3** (free, including all plugins) + `@gsap/react` (`useGSAP`) | The one animation engine for the whole public site |
| GSAP **ScrollTrigger** | Scroll-driven reveals, scrub, the day-to-night color transition |
| GSAP **SplitText** | Line/char text reveals (use `mask: "lines"`, `autoSplit: true`) |
| GSAP **DrawSVG** | Gold line ornaments, timeline line, calligraphy strokes |
| **Lenis** | Smooth scroll, synced to GSAP ticker |
| **OGL** (or three.js if needed) | Only for the gold-dust particle layer, lazy-loaded |

Do not mix in Framer Motion / Motion for the public site (two engines fighting over transforms). Motion is allowed in the admin panel only if useful.

### 5.2 Lenis + GSAP setup (standard pattern)

```js
const lenis = new Lenis({ lerp: 0.08 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
Stop Lenis (`lenis.stop()`) while the doors are closed; `lenis.start()` after they open.

### 5.3 Timing rules
- Default ease: `power3.out` for reveals, `expo.inOut` for big transitions (doors).
- Durations: 0.8 to 1.6s for reveals. Nothing under 0.3s except micro-interactions.
- Char staggers 0.02 to 0.04s, line staggers 0.06 to 0.1s.
- Scroll reveals trigger at `start: "top 80%"`, `once: true` unless it is a scrub effect.
- Define these as shared tokens in one `motion.ts` file and reuse them.

### 5.4 Gold dust particles
- A fixed full-screen WebGL canvas (OGL, a few hundred points, additive blending, warm gold, slow upward drift with noise, varying size and twinkle). Visible mostly in Act II and strongest in Closing; opacity tied to scroll.
- Lazy-load it after the doors open. Skip it entirely if `prefers-reduced-motion`, if `navigator.deviceMemory < 4`, or if WebGL is unavailable. Fallback: a few CSS-animated gold dots.

### 5.5 Accessibility and performance
- Respect `prefers-reduced-motion`: doors fade instead of swing, no parallax, no particles, text appears without splitting.
- Animate only `transform`, `opacity`, `clip-path`, and CSS variables. No layout-thrashing animations.
- Targets on a mid-range Android over 4G: LCP under 2.5s, smooth 60fps scroll, initial JS as small as practical. Fonts preloaded with `display: swap`, subset where possible.
- All images via `next/image`, AVIF/WebP.

---

## 6. Copy (French default; write Arabic equivalents in the i18n file)

Everything below lives in `content/fr.ts` and `content/ar.ts`. `TODO` marks what the couple must supply.

- Door caption: *Touchez pour ouvrir*
- Invitation: *[Salutation] [Noms],* / *Les familles TODO et TODO ont l'immense joie de vous convier à la célébration du mariage de leurs enfants* / *Omar & Saousen*
- Date line: *Le jeudi 29 octobre 2026*
- Venue: *Dar Bouraoui, La Maâlga, Carthage*
- RSVP intro: *Merci de nous confirmer votre présence avant le TODO*
- Closing: *Nous avons hâte de célébrer avec vous*

Arabic copy should be natural formal Arabic appropriate for a Tunisian wedding invitation (e.g. opening with *بكل فرح وسرور*), not a literal translation. Mark it for review by a native speaker.

---

## 7. Personalization: codes and links

### 7.1 URL format
- **Primary:** `https://<domain>/i/<code>`, e.g. `/i/k7Qm2x`.
- **Also supported:** `https://<domain>/#<code>`. On load, client-side JS reads `location.hash` and redirects to `/i/<code>`.
- Why the path is primary: the part after `#` is never sent to the server, so with hash-only links WhatsApp's link preview cannot show the guest's name, and the name cannot be server-rendered. With `/i/<code>` the server renders the name immediately and generates a personalized preview image.

### 7.2 Codes
- Random, 6 characters, URL-safe, unambiguous alphabet (no `0/O/1/l/I`), generated with `nanoid` `customAlphabet`. Unique constraint in DB, retry on collision.
- **Do not derive the code from a hash of the name**: it is guessable and collides for people with the same name.

### 7.3 Link preview (Open Graph)
- `/i/<code>` sets `og:title` like *"Invitation au mariage d'Omar & Saousen"* and `og:description` like *"Pour Karim & Amira"*.
- `og:image` generated at `/api/og/<code>` with `next/og`: ivory background, arch outline, O & S monogram, *"Pour Karim & Amira"*, date. 1200x630. Uses the same fonts (load font files in the route).
- Root `/` has a generic OG image.

### 7.4 Unknown or missing code
- Invalid code: show the generic invitation (addressed *"À nos invités"*) without the RSVP form, plus a discreet note to contact the family.

---

## 8. Admin panel

Route `/admin`, protected. Simple and functional; it does not need the art direction, but keep it clean (ivory/ink, Jost).

- **Auth:** Supabase Auth email/password for 1 to 3 admin accounts (created manually), or if simpler, a single `ADMIN_PASSWORD` env var checked server-side with an httpOnly signed cookie. Pick one and document it in README.
- **Create invite form:**
  - Guest names (1 or 2 names, e.g. "Karim" + "Amira", or a single "Famille Ben Salah")
  - Salutation (auto-suggested: *Cher / Chère / Chers*, editable)
  - Envelope line (the formal line on the doors, e.g. *"Mme & M. Ben Salah"*)
  - Language (fr / ar)
  - Seats max (default 1 or 2 depending on names)
  - Side (Omar / Saousen), optional notes
  - On save: generates code, shows the link with **Copy** and **Send on WhatsApp** (`https://wa.me/?text=<encoded message + link>`) buttons. Pre-written message in the invite's language.
- **Guest list table:** names, code, link, opened (yes/no, first opened at, open count), RSVP status, seats confirmed, message. Search, filter by side / status. Edit and delete.
- **Totals:** invites sent, opened, attending, declined, pending, total confirmed seats.
- **Export CSV.**
- Bulk add (paste a list, one invite per line) is a nice-to-have.

---

## 9. Technical stack

| Layer | Choice |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** |
| Styling | **Tailwind CSS** with the tokens from 3.3 as CSS variables; custom CSS allowed where Tailwind is awkward |
| Animation | GSAP + plugins, Lenis, OGL (see section 5) |
| Database | **Supabase** (Postgres) |
| Hosting | **Vercel** |
| Codes | `nanoid` |
| OG images | `next/og` |
| Testing / self-review | **Playwright** (screenshots at 390x844 and 1440x900) |

### 9.1 Data model

```sql
create table invites (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  guest_names text[] not null,        -- ['Karim','Amira']
  salutation text not null,           -- 'Chers'
  envelope_line text,                 -- 'Mme & M. Ben Salah'
  language text not null default 'fr',-- 'fr' | 'ar'
  seats_max int not null default 1,
  side text,                          -- 'omar' | 'saousen'
  notes text,
  first_opened_at timestamptz,
  open_count int not null default 0,
  created_at timestamptz default now()
);

create table rsvps (
  invite_id uuid primary key references invites(id) on delete cascade,
  attending boolean not null,
  seats int not null default 0,
  message text,
  updated_at timestamptz default now()
);
```

### 9.2 Security
- Enable RLS on both tables. No direct public table access.
- Public reads and writes go through Next.js server code (route handlers / server actions) using the service role key on the server only, and only ever by `code` (fetch one invite, submit its RSVP, increment open count).
- Validate RSVP input (zod): `seats <= seats_max`, message length limit. Basic rate limiting per code.
- Never expose the guest list publicly. Never put the service role key in client code.

### 9.3 Config
All wedding facts live in one typed file `site.config.ts`: names (latin + arabic), date/time/timezone, venue name, address, map links, programme items, RSVP deadline, photos array, music path. Nothing hardcoded in components.

### 9.4 Suggested structure
```
app/
  page.tsx                 generic invitation + hash redirect
  i/[code]/page.tsx        personalized invitation (server fetch by code)
  admin/...                admin panel
  api/og/[code]/route.tsx  OG image
  api/ics/route.ts         calendar file
components/invitation/     Doors, Hero, InvitationCard, Countdown, Programme, Venue, Gallery, Rsvp, Closing, GoldDust, MusicToggle
lib/                       supabase server client, codes, motion.ts, i18n
content/                   fr.ts, ar.ts
public/                    fonts (if self-hosted), svg ornaments, audio
```

---

## 10. Ornament assets

Draw these as clean, hand-authored inline SVGs (thin strokes, `stroke="currentColor"` so they take gold via CSS), consistent 1 to 1.5px stroke weight:

1. Arch frame (pointed/horseshoe Tunisian arch), used as frame and as clip-path mask
2. Door pair with studs and arch top
3. Wax seal with "O & S" monogram (seal shape is irregular, not a perfect circle; deep red `#7A1F1F` to `#9E2B2B` gradient is the one allowed non-palette color, since real wax seals are red; or gold wax if it looks better with the palette, try both)
4. Qallaline-inspired vase with vines inside an arch (line art only)
5. Jasmine sprig
6. Chandelier (line art)
7. Divider: hairline with a small diamond / jasmine at center

Quality bar for SVGs: smooth curves, symmetric where they should be, no clip-art feel. If an ornament looks crude after rendering, simplify it rather than ship it.

---

## 11. Reference material to consult while building

- GSAP docs (ScrollTrigger, SplitText, DrawSVG): https://gsap.com/docs/v3/
- Lenis: https://github.com/darkroomengineering/lenis
- Codrops tutorials (technique references, not visual copies): https://tympanus.net/codrops/tag/scroll/ , especially SVG mask transitions on scroll, SplitText line reveals, and Lenis + GSAP setup
- OGL: https://github.com/oframe/ogl
- React Bits (optional inspiration for text effects, reimplement with GSAP rather than adding the dependency): https://reactbits.dev

---

## 12. Build order

1. **Foundation:** Next.js + Tailwind + tokens + fonts + paper grain + Lenis/GSAP setup + `site.config.ts` + i18n skeleton.
2. **Doors + Hero** end to end, polished, on mobile. This sets the quality bar for everything else. Screenshot and self-critique before moving on.
3. Remaining public sections in order (4.3 to 4.9) with static placeholder data.
4. Day-to-night scroll transition and gold dust.
5. Supabase schema, `/i/[code]` personalization, hash redirect, open tracking, RSVP.
6. Admin panel.
7. OG images, `.ics`, Arabic/RTL pass, reduced-motion pass, performance pass.
8. README: setup, env vars, how to create admin, how to add photos/music, how to deploy on Vercel.

---

## 13. Self-review loop (mandatory)

After each major step, use Playwright to take screenshots at **390x844** (primary) and **1440x900**, including mid-animation states where relevant, and review them honestly against:

- Does it look like luxury stationery, or like a generic template? If generic, fix before continuing.
- Is anything from the anti-slop list (3.7) present?
- Only palette colors and approved fonts used?
- Is the date / time / place instantly readable?
- Does the Arabic version look intentional (not just flipped)?
- Is motion smooth, restrained, one signature moment per section?

## 14. Definition of done

- [ ] `/i/<code>` shows the guest's name on the doors and in the invitation card, server-rendered
- [ ] `/#<code>` redirects to `/i/<code>`
- [ ] WhatsApp preview of `/i/<code>` shows a personalized OG image
- [ ] Doors open on tap, audio starts after tap, scroll unlocks
- [ ] All sections from section 4 implemented (gallery hidden while `photos` is empty)
- [ ] Day-to-night transition works smoothly on mobile
- [ ] RSVP saves, respects seats_max, can be edited before deadline
- [ ] Admin: login, create invite, copy / WhatsApp share, list with open + RSVP status, CSV export
- [ ] FR and AR both complete, RTL correct
- [ ] Reduced-motion mode works
- [ ] No banned fonts, no emoji, no palette violations
- [ ] Lighthouse mobile performance 85+ on the invitation page
- [ ] README complete
- [ ] All couple-supplied content marked `TODO` in one list at the top of README
