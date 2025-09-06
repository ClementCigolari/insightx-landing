"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
  typeKey: "safe" | "fun" | "super_fun" | "live" | "other";
  leagueKey: string;
  label: string;
};

const TYPE_ORDER: ImgItem["typeKey"][] = ["safe", "fun", "super_fun", "live", "other"];

const detectType = (name: string): ImgItem["typeKey"] => {
  const n = name.toLowerCase();
  if (/(super[_-]?fun|superfun)/i.test(n)) return "super_fun";
  if (/safe/i.test(n)) return "safe";
  if (/live/i.test(n)) return "live";
  if (/fun/i.test(n)) return "fun";
  return "other";
};

// “prefix-league_safe.png” → leagueKey = "prefix-league"
const detectLeague = (name: string): string => {
  const n = name.toLowerCase();
  const m = n.match(/^(.*?)(?:[_-])?(?:safe|super[_-]?fun|fun|live)/i);
  return (m?.[1] ?? n).replace(/\.(png|jpe?g)$/i, "").trim();
};

const prettyLeague = (key: string) =>
  key
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const prettyType = (t: ImgItem["typeKey"]) =>
  t === "safe" ? "SAFE"
  : t === "fun" ? "FUN"
  : t === "super_fun" ? "SUPER FUN"
  : t === "live" ? "LIVE"
  : "AUTRE";

export default function RapportPage() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activeType, setActiveType] = useState<ImgItem["typeKey"] | "all">("all");
  const [lightbox, setLightbox] = useState<ImgItem | null>(null);

  const loadImages = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const folder = "charts"; // change si besoin
      const { data: listed, error: listErr } = await supabase.storage
        .from("rapports")
        .list(folder, { limit: 200, sortBy: { column: "name", order: "asc" } });

      if (listErr) throw listErr;

      const files: ListedFile[] = (listed ?? []) as unknown as ListedFile[];
      const onlyImages = files.filter((f) => /\.(png|jpe?g)$/i.test(f.name));

      // génère les URLs signées en parallèle
      const items = await Promise.all(
        onlyImages.map(async (f): Promise<ImgItem | null> => {
          const fullPath = folder ? `${folder}/${f.name}` : f.name;
          const { data: signed, error: signErr } = await supabase.storage
            .from("rapports")
            .createSignedUrl(fullPath, 60 * 60); // 1h
          if (signErr || !signed?.signedUrl) return null;

          const tk = detectType(f.name);
          const lk = detectLeague(f.name);

          return {
            name: f.name,
            url: `${signed.signedUrl}&v=${Date.now()}`,
            last_modified: f.updated_at ?? f.created_at ?? undefined,
            size: f.metadata?.size,
            typeKey: tk,
            leagueKey: lk,
            label: `${prettyLeague(lk)} — ${prettyType(tk)}`,
          };
        })
      );

      const valid = (items.filter(Boolean) as ImgItem[]);

      // tri (type -> ligue -> nom)
      valid.sort((a, b) => {
        const pa = TYPE_ORDER.indexOf(a.typeKey);
        const pb = TYPE_ORDER.indexOf(b.typeKey);
        if (pa !== pb) return pa - pb;
        const la = a.leagueKey.localeCompare(b.leagueKey);
        if (la !== 0) return la;
        return a.name.localeCompare(b.name);
      });

      setImages(valid);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return images.filter((img) => {
      const matchesType = activeType === "all" ? true : img.typeKey === activeType;
      const matchesQuery =
        !s ||
        img.name.toLowerCase().includes(s) ||
        img.leagueKey.toLowerCase().includes(s) ||
        img.label.toLowerCase().includes(s);
      return matchesType && matchesQuery;
    });
  }, [images, q, activeType]);

  const facets = useMemo(() => {
    const byType: Record<string, number> = {};
    images.forEach((i) => { byType[i.typeKey] = (byType[i.typeKey] ?? 0) + 1; });
    return byType as Partial<Record<ImgItem["typeKey"], number>>;
  }, [images]);

  /* ---------------- UI ---------------- */

  const typeChip = (type: ImgItem["typeKey"] | "all", label: string, count?: number) => {
    const active = activeType === type;
    return (
      <button
        key={String(type)}
        onClick={() => setActiveType(type)}
        className={[
          "rounded-full px-3 py-1 text-xs font-semibold border transition",
          active
            ? "bg-emerald-400 text-black border-emerald-400"
            : "bg-white/5 text-white border-white/15 hover:bg-white/10"
        ].join(" ")}
      >
        {label}{typeof count === "number" ? ` (${count})` : ""}
      </button>
    );
  };

  if (loading) {
    return (
      <section className="relative px-6 py-10 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl" />
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
            📊 Rapports
          </div>
          <h1 className="mt-2 text-3xl font-extrabold">Rapports saison</h1>
          <div aria-hidden className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl" />
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <div className="px-6 py-10 text-center">
        <div className="inline-block rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Erreur : {err}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="px-6 py-10 text-white text-center">
        Aucune image publiée pour l’instant.
      </div>
    );
  }

  return (
    <section className="relative px-6 py-10 text-white">
      {/* halo top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl"
      />

      {/* Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          📊 Rapports
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">Rapports saison</h1>
        <p className="text-white/70 mt-1">SAFE / FUN / SUPER FUN / LIVE — triés par type et ligue.</p>
        <div
          aria-hidden
          className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl"
        />
      </header>

      {/* Barre d’outils */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {typeChip("all", "Tout", images.length)}
          {typeChip("safe", "SAFE", facets.safe)}
          {typeChip("fun", "FUN", facets.fun)}
          {typeChip("super_fun", "SUPER FUN", facets.super_fun)}
          {typeChip("live", "LIVE", facets.live)}
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par nom, ligue, type…"
            className="min-w-[220px] rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={loadImages}
            className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <p className="text-white/70 text-center py-10">Aucun rapport ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((img) => (
            <figure
              key={img.name}
              className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,.35)]"
            >
              <button
                type="button"
                onClick={() => setLightbox(img)}
                className="block w-full"
                title="Agrandir"
              >
                <Image
                  src={img.url}
                  alt={img.name}
                  width={1400}
                  height={900}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  unoptimized
                />
              </button>

              <figcaption className="p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{img.label}</span>
                  <span
                    className={[
                      "rounded-md px-2 py-0.5 text-xs border",
                      img.typeKey === "safe" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" :
                      img.typeKey === "fun" ? "bg-blue-500/15 text-blue-300 border-blue-500/20" :
                      img.typeKey === "super_fun" ? "bg-purple-500/15 text-purple-300 border-purple-500/20" :
                      img.typeKey === "live" ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/20" :
                      "bg-white/10 text-white/70 border-white/15"
                    ].join(" ")}
                  >
                    {prettyType(img.typeKey)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  {img.last_modified ? `maj : ${new Date(img.last_modified).toLocaleString()}` : ""}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl w-full">
              <button
                className="absolute -top-4 right-0 rounded-full bg-white text-black px-3 py-1 text-sm font-semibold shadow"
                onClick={() => setLightbox(null)}
              >
                Fermer
              </button>
              <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
                <Image
                  src={lightbox.url}
                  alt={lightbox.name}
                  width={2400}
                  height={1600}
                  className="w-full h-auto object-contain"
                  unoptimized
                />
                <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                  <span>{lightbox.label}</span>
                  <span className="text-white/60">{lightbox.name}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}