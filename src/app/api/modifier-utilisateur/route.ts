import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { ancienEmail, nouvelEmail, nouvelleAdresse } = await req.json();

    if (!ancienEmail) {
      return NextResponse.json(
        { success: false, message: "L'ancien email est requis." },
        { status: 400 }
      );
    }

    // Prépare l'objet à modifier de manière dynamique
    const updates: Record<string, string> = {};
    if (nouvelEmail) updates.email = nouvelEmail;
    if (nouvelleAdresse) updates.adresse = nouvelleAdresse;

    // Vérifie si au moins une mise à jour est présente
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "Aucune donnée à mettre à jour." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("utilisateurs")
      .update(updates)
      .eq("email", ancienEmail)
      .select("id, prenom")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé ou erreur Supabase." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Modification réussie.",
      user: {
        email: nouvelEmail || ancienEmail, // renvoie l'email mis à jour ou ancien s'il n'a pas changé
        prenom: data.prenom,
      },
    });
  } catch (error) {
    console.error("Erreur modification utilisateur :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}