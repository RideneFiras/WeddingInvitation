import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminPassword, adminToken, safeEqual } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Connexion · Invitations", robots: { index: false } };

async function login(formData: FormData) {
  "use server";
  const password = adminPassword();
  if (!password) redirect("/admin");
  const given = String(formData.get("password") ?? "");
  if (!safeEqual(given, password)) redirect("/admin/login?e=1");
  (await cookies()).set(ADMIN_COOKIE, await adminToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 60,
  });
  redirect("/admin");
}

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { e } = await searchParams;
  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-5 font-body text-ink">
      <form action={login} className="w-full max-w-xs">
        <h1 className="font-display text-3xl italic">Invitations</h1>
        <p className="mt-1 text-sm text-ink/70">Omar &amp; Saousen · espace famille</p>
        <label className="mt-8 block text-sm" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 w-full border border-ink/25 bg-white/60 px-3 py-2.5 text-base outline-none focus:border-gold-deep"
        />
        {e && <p className="mt-2 text-sm text-[#9E2B2B]">Mot de passe incorrect.</p>}
        <button className="mt-5 w-full bg-ink px-4 py-3 text-sm tracking-wide text-ivory">Entrer</button>
      </form>
    </main>
  );
}
