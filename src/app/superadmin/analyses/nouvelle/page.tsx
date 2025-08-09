"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NouvelleAnalyse() {
  const [titre, setTitre] = useState("");
  const [championnat, setChampionnat] = useState("");
  const [contenu, setContenu] = useState("");
  const [resume, setResume] = useState("");
  const [competitionType, setCompetitionType] = useState("");
  const [isDecouverte, setIsDecouverte] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return <p className="text-white text-center py-10">Chargement en cours...</p>;
  }

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = generateSlug(titre);
    const { error } = await supabase.from("analyse").insert({
      titre,
      championnat,
      contenu,
      resume,
      slug,
      competition_type: competitionType,
      decouverte: isDecouverte,
      publier: isPublished,
    });

    setLoading(false);

    if (error) {
      console.error("Erreur insertion :", error);
      alert("Erreur à la publication.");
    } else {
      alert("Analyse publiée avec succès !");
      router.push("/superadmin");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">📝 Poster une nouvelle analyse</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="titre" className="block mb-1 font-medium">
            Titre de l’analyse
          </label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            placeholder="Ex: PSG – Marseille (L1)"
          />
        </div>

        <div>
          <label htmlFor="resume" className="block mb-1 font-medium">
            Résumé court de l’analyse
          </label>
          <input
            type="text"
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            placeholder="Ex: Duel tactique tendu entre deux rivaux."
          />
        </div>

        <div>
          <label htmlFor="championnat" className="block mb-1 font-medium">
            Championnat concerné
          </label>
          <select
            id="championnat"
            value={championnat}
            onChange={(e) => setChampionnat(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
          >
            <option value="">-- Sélectionner --</option>
            <option value="ligue1">Ligue 1</option>
            <option value="premier-league">Premier League</option>
            <option value="bundesliga">Bundesliga</option>
            <option value="serie-a">Serie A</option>
            <option value="laliga">La Liga</option>
            <option value="coupe-de-france">Coupe de France</option>
            <option value="fa-cup">FA Cup</option>
            <option value="copa-del-rey">Coupe du Roi</option>
            <option value="coppa-italia">Coupe d&apos;Italie</option>
            <option value="eredivisie">Eredivisie</option>
            <option value="liga-portugal">Liga Portugal</option>
            <option value="pro-league">Jupiler Pro League</option>
            <option value="championsleague">Ligue des Champions</option>
            <option value="europaleague">Europa League</option>
            <option value="conferenceleague">Conférence League</option>
            <option value="liguedesnations">Ligue des Nations</option>
          </select>
        </div>

        <div>
          <label htmlFor="competitionType" className="block mb-1 font-medium">
            Type de compétition
          </label>
          <select
            id="competitionType"
            value={competitionType}
            onChange={(e) => setCompetitionType(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="championnats">Championnat</option>
            <option value="europe">Europe</option>
            <option value="internationale">Internationale</option>
          </select>
       </div>

        <div>
          <label htmlFor="contenu" className="block mb-1 font-medium">
            Contenu de l’analyse (markdown)
          </label>
          <textarea
            id="contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            placeholder="Colle ici ton fichier .md ou son contenu brut"
          ></textarea>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDecouverte}
              onChange={(e) => setIsDecouverte(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Visible pour les utilisateurs Découverte</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <span className="ml-2">Publier maintenant</span>
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            Publier l’analyse
          </button>
        </div>
      </form>
    </div>
  );
}