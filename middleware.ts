import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/espace-client", "/superadmin"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  if (!user) return res;

  // 🔒 Lecture des cookies
  const cookie = req.cookies.get("ix_userdata")?.value;
  if (!cookie) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  let localData;
  try {
    localData = JSON.parse(decodeURIComponent(cookie));
  } catch (e) {
    console.error("Cookie illisible !");
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  // 🔍 Comparaison avec BDD
  const { data: profil, error } = await supabase
    .from("utilisateurs")
    .select("formule, niveau_acces, options, ligue")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profil ||
    profil.formule !== localData.formule ||
    profil.niveau_acces !== localData.niveau_acces ||
    JSON.stringify(profil.options || []) !== JSON.stringify(localData.options || []) ||
    JSON.stringify(profil.ligue || []) !== JSON.stringify(localData.ligue || [])
  ) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/espace-client/:path*", "/superadmin/:path*"],
};