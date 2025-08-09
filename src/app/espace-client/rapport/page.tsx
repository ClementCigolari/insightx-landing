"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fichiers listés dans le bucket
type ListedFile = {
  name: string;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: { size?: number } | null;
};

// Ce qu’on affiche
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

      // "" si les fichiers sont à la racine du bucket, sinon "charts"
      const dossier = "charts";

      const { data: listed, error: listErr } = await supabase.storage
        .from("rapports")
        .list(dossier, { limit: 100, sortBy: { column: "name", order: "asc" } });

      if (listErr) {
        console.error("Erreur list:", listErr);
        setErr(listErr.message);
        setLoading(false);
        return;
      }

      const fichiers: ListedFile[] = (listed ?? []) as unknown as ListedFile[];
      const imagesSeules = fichiers.filter((f) => /\.(png|jpe?g)$/i.test(f.name));

      const items: ImgItem[] = [];
      for (const f of imagesSeules) {
        const fullPath = dossier ? `${dossier}/${f.name}` : f.name;

        const { data: signed, error: signErr } = await supabase.storage
          .from("rapports")
          .createSignedUrl(fullPath, 60 * 60); // 1h

        if (signErr || !signed?.signedUrl) {
          console.error("Erreur signedUrl:", signErr);
          continue;
        }

        items.push({
          name: f.name,
          url: `${signed.signedUrl}&v=${Date.now()}`,
          last_modified: f.updated_at ?? f.created_at ?? undefined,
          size: f.metadata?.size,
        });
      }

      // ------- Tri (type -> ligue -> nom) -------
      const ordreTypes = ["safe", "fun", "super_fun", "live"] as const;
      const getTypeKey = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("super_fun") || lower.includes("super-fun") || lower.includes("superfun")) return "super_fun";
        if (lower.includes("safe")) return "safe";
        if (lower.includes("fun")) return "fun";
        if (lower.includes("live")) return "live";
        return "zzz";
      };
      const getLeaguePrefix = (name: string) => {
        const m = name.toLowerCase().match(/^(.*?)(?:[_-])?(?:safe|super[_-]?fun|fun|live)/i);
        return m?.[1] ?? name.toLowerCase();
      };

      items.sort((a, b) => {
        const pa = ordreTypes.indexOf(getTypeKey(a.name) as typeof ordreTypes[number]);
        const pb = ordreTypes.indexOf(getTypeKey(b.name) as typeof ordreTypes[number]);
        const priA = pa === -1 ? ordreTypes.length : pa;
        const priB = pb === -1 ? ordreTypes.length : pb;
        if (priA !== priB) return priA - priB;

        const la = getLeaguePrefix(a.name);
        const lb = getLeaguePrefix(b.name);
        if (la !== lb) return la.localeCompare(lb);

        return a.name.localeCompare(b.name);
      });
      // ------- fin tri -------

      setImages(items);
      setLoading(false);
    };

    loadImages();
  }, []);

  if (loading) return <p className="text-white text-center py-10">Chargement des rapports…</p>;
  if (err) return <p className="text-red-400 text-center py-10">Erreur : {err}</p>;
  if (images.length === 0) return <p className="text-white text-center py-10">Aucune image publiée pour l’instant.</p>;

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Rapports saison</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <figure key={img.name} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <Image
              src={img.url}
              alt={img.name}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              unoptimized
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