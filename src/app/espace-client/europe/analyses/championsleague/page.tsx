"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalysesByChampionnat } from "@/lib/supabase";

type Analyse = {
  id: string | number;
  titre: string;
  contenu: string;
  created_at: string;
  decouverte?: boolean;
};

export default function ChampionsLeaguePage() {
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

    const fetchAnalyses = async () => {
      const allAnalyses = await getAnalysesByChampionnat("championsleague");
      const filtered = allAnalyses.filter((a: Analyse) =>
        user.formule === "decouverte" ? a.decouverte === true : true
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
    return <p className="text-white text-center py-10">Aucune analyse disponible pour la Champions League.</p>;
  }

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Champions League – Analyses</h1>

      <div className="space-y-4">
        {analyses.map((a) => (
          <div key={a.id} className="border border-zinc-700 rounded p-4 bg-zinc-900">
            <h2 className="text-xl font-semibold">{a.titre}</h2>
            <p className="text-sm text-zinc-400 mb-2">{new Date(a.created_at).toLocaleDateString()}</p>

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