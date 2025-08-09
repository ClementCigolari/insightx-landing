"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function MatchsEchouesPage() {
  const [echecs, setEchecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEchecs = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("echecs")
        .select("*")
        .lte("date_publication", new Date().toISOString()) // sécurité anti futur
        .gte("date_publication", sevenDaysAgo.toISOString()) // seulement les 7 derniers jours
        .order("date_publication", { ascending: false });

      if (!error) {
        setEchecs(data);
      }

      setLoading(false);
    };

    fetchEchecs();
  }, []);

  if (loading) {
    return <p className="text-white text-center py-10">Chargement des comptes-rendus...</p>;
  }

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📉 Analyses non confirmées – Comptes-rendus</h1>

      <div className="space-y-4">
        {echecs.map((e) => (
          <div key={e.id} className="border border-red-800 rounded p-4 bg-zinc-900">
            <h2 className="text-xl font-semibold text-red-400">{e.titre}</h2>
            <p className="text-sm text-zinc-500 mb-2">
              {new Date(e.date_publication).toLocaleDateString()}
            </p>

            <details className="mt-2">
              <summary className="cursor-pointer text-blue-400">Voir le compte-rendu</summary>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{e.contenu}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}