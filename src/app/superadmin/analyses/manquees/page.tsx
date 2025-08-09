// app/superadmin/analyses/manquee/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AnalyseManqueePage() {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("insightx_user");

    if (!storedUser) {
      router.push("/connexion");
      return;
    }

    const userData = JSON.parse(storedUser);

    if (!userData || userData.niveau_acces !== "superadmin") {
      router.push("/connexion");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("echecs").insert({
      titre,
      contenu,
      date_publication: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      console.error("Erreur insertion :", error);
      alert("Erreur lors de la publication du compte-rendu.");
    } else {
      alert("Compte-rendu d'analyse manquée publié !");
      router.push("/superadmin");
    }
  };

  if (loading) {
    return <p className="text-white text-center py-10">Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧠 Poster un compte-rendu d&apos;analyse manquée
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="titre" className="block mb-1 font-medium">
            Titre du match
          </label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            placeholder="Ex: PSG – OM (L1)"
            required
          />
        </div>

        <div>
          <label htmlFor="contenu" className="block mb-1 font-medium">
            Contenu du compte-rendu (markdown)
          </label>
          <textarea
            id="contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            placeholder="Explique ce qui n'a pas fonctionné, l'intuition de départ, et ce qui a basculé."
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
          >
            Publier le compte-rendu
          </button>
        </div>
      </form>
    </div>
  );
}