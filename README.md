# Omar & Saousen — invitation de mariage

Personalized digital wedding invitation: each guest gets a link that opens a pair of Carthage doors addressed to them by name, then scrolls from an ivory day to a gold-dusted night.

---

## TODO: to be supplied by the couple before sending

Everything below is a placeholder. Nothing has been invented; the site degrades gracefully while these are missing. (The `/admin` page also shows this list.)

| # | What | Where | Current placeholder / behaviour |
|---|------|-------|----------------------------------|
| 1 | **Family names** for the invitation text | `site.config.ts` → `families.fr` and `families.ar` | `null` → the card reads *« Nos familles ont l'immense joie… »* |
| 2 | **Start time** of the celebration | `site.config.ts` → `date.time` | `20:00` (placeholder from the brief; drives the countdown, card and calendar) |
| 3 | **Event duration** (calendar end time) | `site.config.ts` → `date.durationHours` | `6` |
| 4 | **Programme times** (arrival, ceremony, dinner, celebration) | `site.config.ts` → `programme[].time` | `null` → shows *« horaire à venir »* / *« الموعد لاحقًا »* |
| 5 | **Arabic spelling of the names** (عمر و سوسن) | `site.config.ts` → `couple.arabic`, then run `scripts/subset-arabic.sh "<new names>"` | placeholder spelling |
| 6 | **Arabic spelling of the venue** (دار بوراوي) and address | `site.config.ts` → `venue.nameAr`, `venue.areaAr`, `venue.addressAr` | best-effort spelling |
| 7 | **Native-speaker review of all Arabic copy** | `content/ar.ts` | written as formal Tunisian-invitation Arabic, not yet reviewed |
| 8 | **Photos** | files in `public/photos/`, listed in `site.config.ts` → `photos` | empty → the gallery section is not rendered |
| 9 | **Music** (soft instrumental, MP3) | `public/audio/theme.mp3` | missing → the music toggle hides itself |
| 10 | **Production URL** | env `NEXT_PUBLIC_SITE_URL` | falls back to the Vercel production domain (OG tags) and the browser origin (`/admin` links) |
| 11 | *(Optional)* calligraphy SVG of the names | replaces the font-rendered names in `components/invitation/Hero.tsx` | Pinyon Script / Aref Ruqaa |
| 12 | *(Optional)* programme descriptions | `content/fr.ts` / `content/ar.ts` → `programme.items[].note` | short neutral lines, edit freely |

---

## How it works

- **No database.** The guest's details (salutation, 1–2 names, the line on the doors, language) are encoded in the link itself: URL-safe base64 (`lib/guest-code.ts`). Nothing is stored anywhere. Consequently there is **no RSVP and no open tracking**; this was a deliberate choice to keep the project minimal.
- **Links:** `https://<domain>/i/<code>` is the primary format. The server decodes it, renders the guest's name into the HTML, and generates a personalized WhatsApp/iMessage preview image (`/api/og/<code>`).
  `https://<domain>/#<code>` also works and redirects to `/i/<code>` (the part after `#` never reaches the server, so hash-only links cannot have a personalized preview).
- **Unknown or broken code:** generic invitation ("À nos invités") with a discreet note inviting the guest to contact the family.
- **`/admin`** is a link generator: type the name(s), pick the salutation and language, then **Copy** the link or **Send on WhatsApp** (a pre-written message in the invite's language). There is also bulk entry (one guest per line), a list of links created on this device (kept in the browser's localStorage), search, a side filter and **CSV export**.

### Tech

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText, DrawSVG) + `@gsap/react` · Lenis · OGL (gold dust) · `next/og` · Playwright for self-review. Hosted on Vercel.

```
app/
  page.tsx                 generic invitation + /#code redirect
  i/[code]/page.tsx        personalized invitation (server-rendered, OG metadata)
  admin/                   link generator (+ optional password login)
  api/og/[code]/route.tsx  personalized OG image (1200×630)
  api/ics/route.ts         calendar file
  doors.svg/route.ts       the studded door pair, prerendered as a static SVG
  fonts.ts                 Google fonts (next/font) + tiny Arabic subsets
components/invitation/     Doors, Hero, InvitationCard, Countdown, Programme, Venue,
                           Gallery, Calendar, Closing, GoldDust, MusicToggle, LangToggle
components/ornaments/      hand-drawn SVG: door pair, wax seal, arch, jasmine, Qallaline vase, chandelier
content/fr.ts, ar.ts       all copy
lib/                       guest codes, motion tokens, GSAP loading, scroll reveals, calendar, Arabic shaper (OG)
site.config.ts             every wedding fact (names, date, venue, programme, photos, music)
proxy.ts                   /admin password gate
scripts/                   Playwright screenshots + end-to-end verification
```

---

## Setup (local)

Requirements: Node 20+.

```bash
npm install
cp .env.example .env.local      # optional; both variables can stay empty locally
npm run dev                     # http://localhost:3000
```

- Generic invitation: `http://localhost:3000/`
- Link generator: `http://localhost:3000/admin`
- A test invitation: `npm run code -- "Chers" "Karim" "Amira" "Mme & M. Ben Salah" fr`, then open `/i/<printed code>`

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | recommended in production | Absolute URL used for OG image URLs and the links built by `/admin` (e.g. `https://omar-saousen.com`). Without it, `/admin` uses the current browser origin. |
| `ADMIN_PASSWORD` | recommended in production | When set, `/admin` redirects to `/admin/login` and requires this password. The session is an httpOnly cookie holding an HMAC of the password (never the password), valid 60 days. When empty, `/admin` is open. |

### How to "create an admin"

There are no accounts: set `ADMIN_PASSWORD` (locally in `.env.local`, on Vercel in *Project → Settings → Environment Variables*) and share it with the 1–3 people who send invitations. To revoke access, change the password and redeploy; every existing session is invalidated.

---

## Editing content

- **Wedding facts** (names, date/time, venue, map links, programme times, photos, music path): `site.config.ts` only.
- **Copy** (every sentence on the page, both languages): `content/fr.ts` and `content/ar.ts`.
- **Adding photos:** put optimized JPG/PNG files in `public/photos/` and list them in `site.config.ts`:
  ```ts
  photos: [
    { src: "/photos/01.jpg", width: 1600, height: 2000, alt: { fr: "Omar et Saousen à Sidi Bou Saïd", ar: "عمر و سوسن في سيدي بوسعيد" } },
  ],
  ```
  `next/image` serves them as AVIF/WebP at the right size. The gallery appears automatically once the array is non-empty (every third photo is shown large).
- **Adding music:** drop a soft instrumental MP3 at `public/audio/theme.mp3` (ideally 128 kbps or less, loopable). It starts on the tap that opens the doors, fades in over 2s to volume 0.4, and can be toggled.
- **Changing the Arabic names:** after editing `couple.arabic`, run `scripts/subset-arabic.sh "<new names>"` (requires `pip install fonttools brotli`). French visitors load only a tiny font subset for those names, and it must contain the new letters.

---

## Deploying on Vercel

1. Push this folder to a Git repository (GitHub / GitLab / Bitbucket).
2. On vercel.com: **Add New → Project**, import the repository. The framework (Next.js) is detected; keep the default build settings.
3. In **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your final domain) and `ADMIN_PASSWORD`.
4. Deploy. Then add your custom domain in **Settings → Domains**, update `NEXT_PUBLIC_SITE_URL` to it, and redeploy.
5. Check a preview: paste a `/i/<code>` link into WhatsApp (or https://www.opengraph.xyz) and you should see the gold card *« Pour Mme & M. Ben Salah »*.

Or from the CLI: `npx vercel` (preview) / `npx vercel --prod`.

Note: WhatsApp caches link previews per URL. If you change the design after sending links, old chats keep the old preview.

---

## Quality checks

```bash
npm run lint && npm run typecheck && npm run build

# with the production server running (npm start, or: npx next start -p 3200)
BASE_URL=http://localhost:3200 ADMIN_PASSWORD=<same as the server> npm run verify   # 42 end-to-end checks
BASE_URL=http://localhost:3200 npm run shots -- /i/<code> review --mid              # screenshots at 390×844 and 1440×900
```

`verify` covers: server-rendered names on the doors and the card, the `/#code` redirect, OG images (FR/AR/generic), the `.ics` file, scroll locked until the doors open, audio starting on the tap, the day→night transition, the gallery hidden while empty, the language switch to RTL, reduced motion, the returning-visitor short doors, and the admin flow (login, create, copy, WhatsApp, list, CSV). The two audio checks need a file at `public/audio/theme.mp3` present *before* the server starts (`next start` only serves public files that existed at startup); without music they fail by design, and the site simply hides the music toggle.

Last measured (production build, Lighthouse 12 mobile, simulated slow 4G, several runs each):

| Page | Performance | Accessibility | Best practices |
|---|---|---|---|
| French invitation `/i/<code>` | 85–92 (typically ~90) | 100 | 100 |
| Generic `/` | 89–91 | 100 | 100 |
| Arabic invitation `/i/<code>` | 78–88 (median ~83) | 100 | 100 |

Observed (not simulated) LCP with 4× CPU throttling and slow-4G emulation is about 1.9s. Arabic invitations score a little lower because the full Arabic face (Amiri, ~58KB) is needed on the doors themselves.

### Design and motion notes

- Palette and fonts follow the brief strictly (tokens in `app/globals.css`); the only non-palette colour is the red of the wax seal. Small gold labels use `--gold-deep` darkened by 12% ink so they pass WCAG AA on ivory.
- Motion tokens live in `lib/motion.ts`. Scroll animations are built only after the doors open, in idle time (`lib/scroll-motion.ts`); the scroll plugins and Lenis load in a separate chunk after first paint.
- `prefers-reduced-motion`: doors fade instead of swinging, no parallax, no particles, no text splitting; the day→night colour change stays (it is colour, not movement).
- Gold dust (OGL) is skipped with reduced motion, and replaced by a few CSS dots when `navigator.deviceMemory < 4` or WebGL is unavailable.
- Returning visitors (localStorage flag) get a 0.6s door opening.
