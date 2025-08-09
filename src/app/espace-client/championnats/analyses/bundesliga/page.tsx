"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalysesByChampionnat } from "@/lib/supabase";

type Analyse = {
  id: string;
  titre: string;
  contenu: string;
  decouverte: boolean;
  created_at: string; // ou Date si tu la convertis
};

export default function BundesligaPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analyse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("insightx_user");
    if (!storedUser) {
      router.push("/connexion");
      return;
    }

    const user = JSON.parse(storedUser);
    const userFormule: string = user?.formule || "decouverte";

    const fetchAnalyses = async () => {
      const allAnalyses: Analyse[] = await getAnalysesByChampionnat("bundesliga");
      const filtered = allAnalyses.filter((a: Analyse) =>
        userFormule === "decouverte" ? a.decouverte === true : true
      );
      setAnalyses(filtered);
      setLoading(false);
    };

    fetchAnalyses();
  }, [router]);

  if (loading) {
    return <p className="text-white text-center py-10">Chargement des analyses...</p>;
  }

  if (!analyses || analyses.length === 0) {
    return <p className="text-white text-center py-10">Aucune analyse disponible pour la Bundesliga.</p>;
  }

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Bundesliga – Analyses</h1>

      <div className="space-y-4">
        {analyses.map((a: Analyse) => (
          <div key={a.id} className="border border-zinc-700 rounded p-4 bg-zinc-900">
            <h2 className="text-xl font-semibold">{a.titre}</h2>
            <p className="text-sm text-zinc-400 mb-2">
              {new Date(a.created_at).toLocaleDateString()}
            </p>

            <details className="mt-2">
              <summary className="cursor-pointer text-blue-400">Voir l’analyse</summary>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{a.contenu}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}