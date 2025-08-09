import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔐 Connexion sécurisée côté serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const clientData = await req.json();

    const {
      nom,
      prenom,
      email,
      mot_de_passe, // mot de passe brut
      dateNaissance,
      adresse,
      formule,
      ligues_choisies,
      options_supplementaires,
    } = clientData;

    // Étape 1 : Création de l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: mot_de_passe,
      email_confirm: true,
    });

    if (authError || !authUser?.user) {
      console.error("Erreur création Supabase Auth :", authError);
      return NextResponse.json(
        { success: false, message: "Erreur à la création du compte." },
        { status: 500 }
      );
    }

    const userId = authUser.user.id; // UUID de Supabase Auth

    // Nettoyage des données pour insertion dans la table `utilisateurs`
    const ligues = Array.isArray(ligues_choisies)
      ? ligues_choisies
      : typeof ligues_choisies === "string"
      ? ligues_choisies.split(",").map((e: string) => e.trim())
      : [];

    const options = Array.isArray(options_supplementaires)
      ? options_supplementaires
      : typeof options_supplementaires === "string"
      ? options_supplementaires.split(",").map((e: string) => e.trim())
      : [];

    const date_naissance = dateNaissance 
      ? new Date(new Date(dateNaissance).setHours(12, 0, 0, 0)).toISOString().split("T")[0]
      : null;

    const date_inscription = new Date().toISOString();
    const prochain_paiement = new Date();
    prochain_paiement.setMonth(prochain_paiement.getMonth() + 1);

    // Étape 2 : Insertion dans ta table custom `utilisateurs`
    const { data, error } = await supabase
      .from("utilisateurs")
      .insert([
        {
          id: userId, // 👈 uuid lié à Supabase Auth
          nom,
          prenom,
          email,
          adresse,
          date_naissance,
          formule_active: formule || null,
          ligues_choisies: ligues,
          options_supplementaires: options,
          date_inscription,
          prochain_paiement: prochain_paiement.toISOString(),
          cumul_paiements: 0,
          niveau_acces: "utilisateur",
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Erreur insertion Supabase :", error);
      return NextResponse.json(
        { success: false, message: "Erreur à l'enregistrement." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Client enregistré avec succès.",
      id: data.id,
    });

  } catch (error) {
    console.error("Erreur API /enregistrer-client :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}