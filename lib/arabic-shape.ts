/**
 * Minimal Arabic shaper for the OG image renderer (Satori has no Arabic shaping or bidi).
 * Converts letters to their contextual presentation forms (U+FE70–U+FEFF), builds lam-alef
 * ligatures, drops harakat, and returns the string in visual (left-to-right) order.
 * Only used for short strings such as guest names.
 */

// base letter → first presentation form (isolated); `dual` letters have 4 forms, others 2.
const FORMS: Record<string, [number, boolean]> = {
  "ء": [0xfe80, false], "آ": [0xfe81, false], "أ": [0xfe83, false], "ؤ": [0xfe85, false],
  "إ": [0xfe87, false], "ئ": [0xfe89, true], "ا": [0xfe8d, false], "ب": [0xfe8f, true],
  "ة": [0xfe93, false], "ت": [0xfe95, true], "ث": [0xfe99, true], "ج": [0xfe9d, true],
  "ح": [0xfea1, true], "خ": [0xfea5, true], "د": [0xfea9, false], "ذ": [0xfeab, false],
  "ر": [0xfead, false], "ز": [0xfeaf, false], "س": [0xfeb1, true], "ش": [0xfeb5, true],
  "ص": [0xfeb9, true], "ض": [0xfebd, true], "ط": [0xfec1, true], "ظ": [0xfec5, true],
  "ع": [0xfec9, true], "غ": [0xfecd, true], "ف": [0xfed1, true], "ق": [0xfed5, true],
  "ك": [0xfed9, true], "ل": [0xfedd, true], "م": [0xfee1, true], "ن": [0xfee5, true],
  "ه": [0xfee9, true], "و": [0xfeed, false], "ى": [0xfeef, false], "ي": [0xfef1, true],
};
const LAM_ALEF: Record<string, number> = { "آ": 0xfef5, "أ": 0xfef7, "إ": 0xfef9, "ا": 0xfefb };
const HARAKAT = /[ً-ٰٟـ]/g;
const joins = (c?: string) => !!c && c in FORMS && c !== "ء";
const dual = (c?: string) => !!c && FORMS[c]?.[1] === true;

function shapeWord(word: string): string {
  const chars = [...word.replace(HARAKAT, "")];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const prev = chars[i - 1];
    const next = chars[i + 1];
    if (!(c in FORMS)) {
      out += c;
      continue;
    }
    const fromPrev = dual(prev);
    if (c === "ل" && next && next in LAM_ALEF) {
      out += String.fromCharCode(LAM_ALEF[next] + (fromPrev ? 1 : 0));
      i++;
      continue;
    }
    const [iso, isDual] = FORMS[c];
    const toNext = isDual && joins(next);
    let form = iso; // isolated
    if (fromPrev && toNext) form = iso + 3;
    else if (fromPrev) form = iso + 1;
    else if (toNext) form = iso + 2;
    out += String.fromCharCode(form);
  }
  return out;
}

const isArabic = (s: string) => /[؀-ۿ]/.test(s);

/** Returns the visual-order string, ready to draw left-to-right. */
export function shapeArabic(text: string): string {
  if (!isArabic(text)) return text;
  return text
    .split(/(\s+)/)
    .map((w) => (isArabic(w) ? [...shapeWord(w)].reverse().join("") : w))
    .reverse()
    .join("");
}
