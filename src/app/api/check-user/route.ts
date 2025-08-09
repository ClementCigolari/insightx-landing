// pages/api/check-user/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // bien serveur uniquement
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Étape 1 : Connexion via Supabase Auth (plus besoin de bcrypt)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ success: false, message: "Identifiants incorrects." });
    }

    const userId = authData.user.id;

    // Étape 2 : On récupère les infos liées dans ta table personnalisée
    const { data: userInfos, error: infosError } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", userId)
      .single();

    if (infosError || !userInfos) {
      return NextResponse.json({ success: false, message: "Utilisateur non trouvé dans la table." });
    }

    // Étape 3 : On vérifie juste qu’il a bien une formule active
    if (!userInfos.formule_active || userInfos.formule_active.trim() === "") {
      return NextResponse.json({ success: false, message: "Aucune formule active." });
    }

    // Étape 4 : On retourne ses infos utiles
    return NextResponse.json({
      success: true,
      user: {
        id: userInfos.id,
        prenom: userInfos.prenom,
        email: userInfos.email,
        formule: userInfos.formule_active,
        ligue: userInfos.ligues_choisies,
        options: userInfos.options_supplementaires,
        niveau_acces: userInfos.niveau_acces,
      },
    });
  } catch (error) {
    console.error("Erreur API check-user :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." });
  }
}