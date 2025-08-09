import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function getAnalysesByChampionnat(championnat: string) {
  const { data, error } = await supabase
    .from("analyse")
    .select("*")
    .eq("championnat", championnat)
    .eq("publier", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur récupération analyses:", error);
    return [];
  }

  return data;
}