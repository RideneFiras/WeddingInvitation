// Print a guest code (same format as lib/guest-code.ts). Usage: node scripts/code.mjs "Chers" "Karim" "Amira" "Mme & M. Ben Salah" fr
const [, , salutation, n1, n2 = "", env = "", lang = "fr"] = process.argv;
const payload = "1" + [salutation, [n1, n2].filter(Boolean).join("\u001e"), env, lang].join("\u001f");
console.log(Buffer.from(payload, "utf8").toString("base64url"));
