"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalysesByChampionnat } from "@/lib/supabase";

type Analyse = {
  id: string;
  titre: string;
  contenu: string;
  decouverte: boolean;
  created_at: string;
};

export default function LeagueAnalysesPage({
  slug,
  title,
  emoji = "⚽️",
}: {
  slug: string;
  title: string;
  emoji?: string;
}) {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analyse[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const isVisible = (a: Analyse, formule: string) =>
    formule === "decouverte" ? a.decouverte === true : true;

  useEffect(() => {
    const storedUser = localStorage.getItem("insightx_user");
    if (!storedUser) {
      router.push("/connexion");
      return;
    }
    const user = JSON.parse(storedUser);
    const userFormule: string = user?.formule || "decouverte";

    (async () => {
      const all = await getAnalysesByChampionnat(slug);
      setAnalyses(all.filter((a) => isVisible(a, userFormule)));
      setLoading(false);
    })();
  }, [router, slug]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return analyses;
    return analyses.filter(
      (a) =>
        a.titre.toLowerCase().includes(s) ||
        a.contenu.toLowerCase().includes(s)
    );
  }, [analyses, q]);

  if (loading) {
    return <p className="text-white text-center py-10">Chargement des analyses...</p>;
  }

  return (
    <div className="px-6 py-10 text-white">
      <Header emoji={emoji} title={title} />
      <SearchBar value={q} onChange={setQ} />

      {filtered.length === 0 ? (
        <p className="text-white/70 text-center py-10">
          Aucune analyse disponible pour {title.replace(" — Analyses", "")}.
        </p>
      ) : (
        <div className="space-y-5">
          {filtered.map((a) => (
            <ArticleCard key={a.id} analyse={a} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- UI bits ---------- */

function Header({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
        {emoji} {title.split(" — ")[0].toLowerCase()}
      </div>
      <h1 className="mt-2 text-3xl font-extrabold">{title}</h1>
      <div
        aria-hidden
        className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl"
      />
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-6">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un match, une équipe, un mot-clé…"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}

/* ---------- Carte d’analyse (aperçu multi-ligne + détails) ---------- */

function ArticleCard({ analyse }: { analyse: Analyse }) {
  const lines = useMemo(
    () =>
      analyse.contenu
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean),
    [analyse.contenu]
  );

  const preview = lines.slice(0, 4);

  const hasSAFE = /SAFE/i.test(analyse.contenu);
  const indiceMatch = analyse.contenu.match(/Indice\s*:\s*([+\-]?\d+)/i);
  const indice = indiceMatch ? parseInt(indiceMatch[1], 10) : null;

  // Fonction pour déterminer style visuel de l’indice
  const getIndiceBadge = (val: number) => {
    if (val >= 5)
      return (
        <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold">
          🟢 Indice +5 : Très fort
        </span>
      );
    if (val === 4)
      return (
        <span className="rounded-md bg-green-700/20 text-green-300 border border-green-600/30 px-2 py-0.5 text-xs font-semibold">
          🟩 Indice +4 : Fort
        </span>
      );
    if (val === 3)
      return (
        <span className="rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 text-xs font-semibold">
          ⚠️ Indice +3 : Limite
        </span>
      );
    if (val <= 2)
      return (
        <span className="rounded-md bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 text-xs font-semibold">
          ❌ Indice {val} : Non conseillé
        </span>
      );
    return null;
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_30px_rgba(0,0,0,.35)]">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold">{analyse.titre}</h2>
        <div className="flex items-center gap-2">
          {analyse.decouverte && (
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5">
              Découverte
            </span>
          )}
          <span className="text-xs text-white/60">
            {new Date(analyse.created_at).toLocaleDateString()}
          </span>
        </div>
      </header>

      {/* Badges rapides */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {hasSAFE && (
          <span className="rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5">
            SAFE
          </span>
        )}
        {indice !== null && getIndiceBadge(indice)}
      </div>

      {/* Aperçu MULTI-LIGNE */}
      <div className="mt-3 space-y-1 text-sm leading-relaxed">
        {preview.map((line, i) => (
          <p key={i} className="text-white/85">
            <FormattedLine text={line} />
          </p>
        ))}
        {lines.length > preview.length && (
          <p className="text-white/50 text-xs">…</p>
        )}
      </div>

      {/* Détails */}
      <details className="mt-3 group">
        <summary className="cursor-pointer inline-flex items-center gap-2 text-sm text-emerald-300 group-hover:text-emerald-200">
          ▶ Lire l’analyse
        </summary>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-white/90 bg-black/30 rounded-lg p-4 border border-white/10">
          {analyse.contenu}
        </pre>
      </details>
    </article>
  );
}

/* ---------- Formatter simple (met en gras les titres style ###, met SAFE en badge dans l’aperçu) ---------- */

function FormattedLine({ text }: { text: string }) {
  // Titres façon markdown light
  const heading = text.match(/^#{2,6}\s*(.+)$/);
  if (heading) {
    return <span className="font-semibold text-white">{heading[1]}</span>;
  }

  // Remplace "SAFE" isolé par un mini badge (sans casser la ligne)
  const parts = text.split(/(SAFE)/i);
  return (
    <>
      {parts.map((p, i) =>
        /SAFE/i.test(p) ? (
          <span
            key={i}
            className="mx-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 text-[11px]"
          >
            SAFE
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}