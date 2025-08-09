"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ImgItem = {
  name: string;
  url: string;
  last_modified?: string;
  size?: number;
};

export default function RapportPage() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setErr(null);
      setLoading(true);

      // ⚠️ Mets "" si tes fichiers sont à la racine du bucket,
      // ou "charts" si tu les as mis dans ce dossier.
      const dossier = "charts";

      const { data: listed, error: listErr } = await supabase.storage
        .from("rapports")
        .list(dossier, {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (listErr) {
        console.error("Erreur list:", listErr);
        setErr(listErr.message);
        setLoading(false);
        return;
      }

      const fichiers =
        (listed || []).filter((f) => /\.(png|jpe?g)$/i.test(f.name)) ?? [];

      // On génère des URL signées (marche même si le bucket est privé)
      const items: ImgItem[] = [];
      for (const f of fichiers) {
        const fullPath = dossier ? `${dossier}/${f.name}` : f.name;

        const { data: signed, error: signErr } = await supabase.storage
          .from("rapports")
          .createSignedUrl(fullPath, 60 * 60); // URL valable 1h

        if (signErr) {
          console.error("Erreur signedUrl:", signErr);
          continue;
        }

        const url = `${signed.signedUrl}&v=${Date.now()}`;

        items.push({
          name: f.name,
          url,
          last_modified: (f as any).updated_at || (f as any).created_at,
          size: (f as any).metadata?.size,
        });
      }

      // ---------- TRI PERSONNALISÉ ----------
      const ordreTypes = ["safe", "fun", "super_fun", "live"];
      const typeRegex = /(safe|super[_-]?fun|fun|live)/i;

      const getTypeKey = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("super_fun") || lower.includes("super-fun") || lower.includes("superfun")) return "super_fun";
        if (lower.includes("safe")) return "safe";
        if (lower.includes("fun")) return "fun";
        if (lower.includes("live")) return "live";
        return "zzz"; // inconnu → fin
      };

      const getLeaguePrefix = (name: string) => {
        // Récupère ce qu’il y a avant le mot-clé de type
        const m = name.toLowerCase().match(new RegExp(`^(.*?)(?:[_-])?(?:${typeRegex.source})`));
        // m?.[1] = préfixe "ligue_1", "premierleague", etc.
        return m?.[1] ?? name.toLowerCase();
      };

      items.sort((a, b) => {
        const ta = getTypeKey(a.name);
        const tb = getTypeKey(b.name);
        const pa = ordreTypes.indexOf(ta);
        const pb = ordreTypes.indexOf(tb);
        const priA = pa === -1 ? ordreTypes.length : pa;
        const priB = pb === -1 ? ordreTypes.length : pb;

        if (priA !== priB) return priA - priB;

        // même type → sous-tri par "league prefix"
        const la = getLeaguePrefix(a.name);
        const lb = getLeaguePrefix(b.name);
        if (la !== lb) return la.localeCompare(lb);

        // à défaut, tri alphabétique complet
        return a.name.localeCompare(b.name);
      });
      // ---------- FIN TRI ----------

      setImages(items);
      setLoading(false);
    };

    loadImages();
  }, []);

  if (loading) {
    return <p className="text-white text-center py-10">Chargement des rapports…</p>;
  }
  if (err) {
    return <p className="text-red-400 text-center py-10">Erreur: {err}</p>;
  }
  if (images.length === 0) {
    return <p className="text-white text-center py-10">Aucune image publiée pour l’instant.</p>;
  }

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Rapports saison</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <figure key={img.name} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
            <figcaption className="p-3 text-sm text-zinc-400">
              {img.name}
              {img.last_modified && (
                <span className="block text-xs text-zinc-500 mt-1">
                  maj&nbsp;: {new Date(img.last_modified).toLocaleString()}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}