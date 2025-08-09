"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Echec = {
  id: string | number;
  titre: string;
  contenu: string;
  date_publication: string; // ISO string en BDD
};

export default function MatchsEchouesPage() {
  const [echecs, setEchecs] = useState<Echec[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const fetchEchecs = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await supabase
         .from("echecs")
         .select("*")
         .lte("date_publication", new Date().toISOString()) // sécurité anti futur
         .gte("date_publication", sevenDaysAgo.toISOString()) // 7 derniers jours
         .order("date_publication", { ascending: false })
         .returns<Echec[]>(); // ✅ typage du résultat

        if (error) {
          setErr("Impossible de charger les comptes‑rendus.");
          return;
        }

        setEchecs(data ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchEchecs();
  }, []);

  if (loading) {
    return (
      <p className="text-white text-center py-10">
        Chargement des comptes‑rendus…
      </p>
    );
  }

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📉 Analyses non confirmées – Comptes‑rendus
      </h1>

      {err && (
        <div className="mb-6 rounded border border-red-800 bg-red-900/30 p-3 text-red-300">
          {err}
        </div>
      )}

      <div className="space-y-4">
        {echecs.map((e) => (
          <div
            key={String(e.id)}
            className="border border-red-800 rounded p-4 bg-zinc-900"
          >
            <h2 className="text-xl font-semibold text-red-400">{e.titre}</h2>
            <p className="mb-2 text-sm text-zinc-500">
              {new Date(e.date_publication).toLocaleDateString("fr-FR")}
            </p>

            <details className="mt-2">
              <summary className="cursor-pointer text-blue-400">
                Voir le compte‑rendu
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{e.contenu}</pre>
            </details>
          </div>
        ))}

        {echecs.length === 0 && !err && (
          <p className="text-center text-zinc-400">
            Aucun compte‑rendu sur les 7 derniers jours.
          </p>
        )}
      </div>
    </div>
  );
}