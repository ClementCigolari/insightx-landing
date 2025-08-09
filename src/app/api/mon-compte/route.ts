import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email requis." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("utilisateurs")
    .select(`
      nom,
      prenom,
      email,
      date_naissance,
      adresse,
      formule_active,
      ligues_choisies,
      options_supplementaires,
      date_inscription,
      prochain_paiement
    `)
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: "Utilisateur non trouvé ou erreur Supabase." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}