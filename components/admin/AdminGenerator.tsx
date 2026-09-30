"use client";

import { useEffect, useMemo, useState } from "react";
import { dictionaries, type Lang } from "@/content";
import { encodeGuest, type Guest } from "@/lib/guest-code";
import { siteConfig } from "@/site.config";
import { slug } from "@/lib/wedding";

const { first: FIRST, second: SECOND } = siteConfig.couple.latin;

type Saved = Guest & { code: string; createdAt: string; side: "" | "first" | "second"; notes: string };
const STORE = "os-admin-links-v1";

function load(): Saved[] {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "[]") as Saved[];
  } catch {
    return [];
  }
}
function persist(list: Saved[]) {
  try {
    localStorage.setItem(STORE, JSON.stringify(list));
  } catch {
    /* storage unavailable: the list just won't persist */
  }
}

function suggestSalutation(lang: Lang, count: number): string {
  const s = dictionaries[lang].salutations;
  return count > 1 ? s.pl : s.m;
}

function csvEscape(v: string) {
  return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export default function AdminGenerator({ missing }: { missing: string[] }) {
  const [origin, setOrigin] = useState(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [lang, setLang] = useState<Lang>("fr");
  const [salutation, setSalutation] = useState("");
  const [salutationTouched, setSalutationTouched] = useState(false);
  const [envelope, setEnvelope] = useState("");
  const [side, setSide] = useState<Saved["side"]>("");
  const [notes, setNotes] = useState("");
  const [list, setList] = useState<Saved[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<"" | "first" | "second">("");
  const [bulk, setBulk] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values
    if (!process.env.NEXT_PUBLIC_SITE_URL) setOrigin(window.location.origin);
    setList(load());
  }, []);

  const names = [name1, name2].map((n) => n.trim()).filter(Boolean);
  const effectiveSalutation = salutationTouched ? salutation : suggestSalutation(lang, names.length);
  const dict = dictionaries[lang];

  const current = useMemo(() => {
    if (!names.length) return null;
    const guest: Guest = { salutation: effectiveSalutation, names, envelopeLine: envelope, lang };
    return { guest, code: encodeGuest(guest) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name1, name2, effectiveSalutation, envelope, lang]);

  const linkFor = (code: string) => `${origin}/i/${code}`;
  const waFor = (g: Guest, code: string) => {
    const d = dictionaries[g.lang];
    const text = d.share.message(g.salutation, d.joinNames(g.names), linkFor(code));
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(code));
    } catch {
      const t = document.createElement("textarea");
      t.value = linkFor(code);
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
  };

  const save = () => {
    if (!current) return;
    const entry: Saved = { ...current.guest, code: current.code, createdAt: new Date().toISOString(), side, notes };
    const next = [entry, ...list.filter((s) => s.code !== entry.code)];
    setList(next);
    persist(next);
    setName1("");
    setName2("");
    setEnvelope("");
    setNotes("");
    setSalutationTouched(false);
  };

  const addBulk = () => {
    // one invite per line:  Prénom 1 & Prénom 2 ; ligne d'enveloppe (optionnelle)
    const entries: Saved[] = bulk
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [namesPart, env = ""] = line.split(";").map((s) => s.trim());
        const ns = namesPart.split(/\s*(?:&|\+|\bet\b| و)\s*/).filter(Boolean).slice(0, 2);
        const guest: Guest = { salutation: suggestSalutation(lang, ns.length), names: ns, envelopeLine: env, lang };
        return { ...guest, code: encodeGuest(guest), createdAt: new Date().toISOString(), side, notes: "" };
      })
      .filter((e) => e.names.length > 0);
    const codes = new Set(entries.map((e) => e.code));
    const next = [...entries, ...list.filter((s) => !codes.has(s.code))];
    setList(next);
    persist(next);
    setBulk("");
  };

  const remove = (code: string) => {
    const next = list.filter((s) => s.code !== code);
    setList(next);
    persist(next);
  };

  const exportCsv = () => {
    const header = ["salutation", "noms", "enveloppe", "langue", "côté", "notes", "lien", "créé le"];
    const rows = list.map((s) =>
      [s.salutation, s.names.join(" & "), s.envelopeLine, s.lang, s.side === "first" ? FIRST : s.side === "second" ? SECOND : "", s.notes, linkFor(s.code), s.createdAt].map(csvEscape).join(","),
    );
    const blob = new Blob(["﻿" + [header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invitations-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filtered = list.filter(
    (s) =>
      (!sideFilter || s.side === sideFilter) &&
      (!query || `${s.names.join(" ")} ${s.envelopeLine} ${s.notes}`.toLowerCase().includes(query.toLowerCase())),
  );

  const input = "mt-1 w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-base outline-none focus:border-gold-deep";
  const btn = "inline-flex items-center justify-center px-4 py-2.5 text-sm tracking-wide transition-colors";

  return (
    <main className="min-h-svh bg-ivory px-5 py-10 font-body text-ink sm:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl italic">Invitations</h1>
            <p className="mt-1 text-sm text-ink/70">{dictionaries.fr.meta.title} — créer un lien personnalisé</p>
          </div>
          <a href="/" target="_blank" className="text-sm underline decoration-gold underline-offset-4">
            Voir l&apos;invitation
          </a>
        </header>

        {missing.length > 0 && (
          <details className="mt-6 border border-gold/50 bg-paper/60 px-4 py-3 text-sm">
            <summary className="cursor-pointer">À compléter avant l&apos;envoi ({missing.length})</summary>
            <ul className="mt-2 list-disc ps-5 text-ink/80">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </details>
        )}

        {/* ── Create ── */}
        <section className="mt-8 border border-ink/10 bg-white/40 p-5 sm:p-6">
          <h2 className="font-display text-2xl">Nouvelle invitation</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Prénom / nom 1
              <input className={input} value={name1} onChange={(e) => setName1(e.target.value)} placeholder="Karim  ·  ou  Famille Ben Salah" />
            </label>
            <label className="text-sm">
              Prénom 2 <span className="text-ink/50">(optionnel)</span>
              <input className={input} value={name2} onChange={(e) => setName2(e.target.value)} placeholder="Amira" />
            </label>
            <label className="text-sm">
              Formule d&apos;appel
              <input
                className={input}
                value={effectiveSalutation}
                onChange={(e) => {
                  setSalutationTouched(true);
                  setSalutation(e.target.value);
                }}
              />
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {Object.values(dict.salutations).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSalutationTouched(true);
                      setSalutation(s);
                    }}
                    className={`border px-2 py-0.5 text-xs ${effectiveSalutation === s ? "border-ink bg-ink text-ivory" : "border-ink/25"}`}
                  >
                    {s}
                  </button>
                ))}
              </span>
            </label>
            <label className="text-sm">
              Ligne sur les portes <span className="text-ink/50">(optionnel)</span>
              <input className={input} value={envelope} onChange={(e) => setEnvelope(e.target.value)} placeholder="Mme & M. Ben Salah" />
            </label>
            <fieldset className="text-sm">
              <legend>Langue</legend>
              <div className="mt-1 flex gap-2">
                {(["fr", "ar"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setSalutationTouched(false);
                    }}
                    className={`${btn} border ${lang === l ? "border-ink bg-ink text-ivory" : "border-ink/25"}`}
                  >
                    {l === "fr" ? "Français" : "العربية"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="text-sm">
              <legend>Côté</legend>
              <div className="mt-1 flex gap-2">
                {(
                  [
                    ["", "—"],
                    ["first", FIRST],
                    ["second", SECOND],
                  ] as const
                ).map(([v, label]) => (
                  <button key={v} type="button" onClick={() => setSide(v)} className={`${btn} border ${side === v ? "border-ink bg-ink text-ivory" : "border-ink/25"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="text-sm sm:col-span-2">
              Notes <span className="text-ink/50">(pour vous, pas dans le lien)</span>
              <input className={input} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </div>

          {current && (
            <div className="mt-6 border-t border-ink/10 pt-5" aria-live="polite">
              <p className="text-sm text-ink/70">
                Aperçu : <em className="font-display text-lg not-italic">{envelope || dict.joinNames(names)}</em> —{" "}
                <span className="font-display text-lg italic">
                  {effectiveSalutation} {dict.joinNames(names)},
                </span>
              </p>
              <p className="mt-2 break-all border border-ink/10 bg-white/70 px-3 py-2 font-mono text-[13px]" data-testid="generated-link">
                {linkFor(current.code)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => copy(current.code)} className={`${btn} bg-ink text-ivory`}>
                  {copied === current.code ? "Copié" : "Copier le lien"}
                </button>
                <a href={waFor(current.guest, current.code)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-ink/30`}>
                  Envoyer sur WhatsApp
                </a>
                <a href={linkFor(current.code)} target="_blank" className={`${btn} border border-ink/30`}>
                  Ouvrir
                </a>
                <button type="button" onClick={save} className={`${btn} border border-gold-deep text-gold-deep`}>
                  Ajouter à ma liste
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Bulk ── */}
        <details className="mt-6 border border-ink/10 bg-white/40 p-5 text-sm">
          <summary className="cursor-pointer font-display text-xl">Ajout en masse</summary>
          <p className="mt-2 text-ink/70">
            Une invitation par ligne : <code>Karim &amp; Amira ; Mme &amp; M. Ben Salah</code> (la partie après « ; » est optionnelle). La langue et le côté
            choisis ci-dessus s&apos;appliquent.
          </p>
          <textarea className={`${input} h-32 font-mono text-sm`} value={bulk} onChange={(e) => setBulk(e.target.value)} />
          <button type="button" onClick={addBulk} className={`${btn} mt-2 bg-ink text-ivory`}>
            Générer les liens
          </button>
        </details>

        {/* ── List ── */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl">Liens créés sur cet appareil ({list.length})</h2>
              <p className="text-xs text-ink/60">Sans base de données : la liste est gardée dans ce navigateur. Exportez-la pour la conserver.</p>
            </div>
            <button type="button" onClick={exportCsv} disabled={!list.length} className={`${btn} border border-ink/30 disabled:opacity-40`}>
              Exporter en CSV
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <input className={`${input} mt-0 max-w-xs`} placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className={`${input} mt-0 w-auto`} value={sideFilter} onChange={(e) => setSideFilter(e.target.value as typeof sideFilter)}>
              <option value="">Tous les côtés</option>
              <option value="first">{FIRST}</option>
              <option value="second">{SECOND}</option>
            </select>
          </div>
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {filtered.map((s) => (
              <li key={s.code} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-display text-lg" dir="auto">
                    {s.salutation} {dictionaries[s.lang].joinNames(s.names)}
                    <span className="ms-2 text-xs uppercase tracking-wider text-ink/50">
                      {s.lang}
                      {s.side ? ` · ${s.side === "first" ? FIRST : SECOND}` : ""}
                    </span>
                  </p>
                  {(s.envelopeLine || s.notes) && (
                    <p className="text-xs text-ink/60" dir="auto">
                      {s.envelopeLine}
                      {s.envelopeLine && s.notes ? " — " : ""}
                      {s.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 text-sm">
                  <button type="button" onClick={() => copy(s.code)} className="underline decoration-gold underline-offset-4">
                    {copied === s.code ? "Copié" : "Copier"}
                  </button>
                  <a href={waFor(s, s.code)} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4">
                    WhatsApp
                  </a>
                  <button type="button" onClick={() => remove(s.code)} className="text-ink/50 hover:text-ink" aria-label="Supprimer">
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
            {!filtered.length && <li className="py-6 text-center text-sm text-ink/50">Aucun lien pour l&apos;instant.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}
