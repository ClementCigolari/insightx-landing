"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase";
import { AlertTriangle, TrendingDown, RefreshCw } from "lucide-react";

type Echec = {
  id: string | number;
  titre: string;
  contenu: string;
  date_publication: string; // ISO string
};

export default function MatchsEchouesPage() {
  const [items, setItems] = useState<Echec[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [q, setQ] = useState("");
  const [rangeDays, setRangeDays] = useState<7 | 30>(7);

  // fetch selon plage 7/30 jours
  useEffect(() => {
    let cancelled = false;

    const fetchEchecs = async () => {
      setLoading(true);
      setErr("");

      try {
        const since = new Date();
        since.setDate(since.getDate() - rangeDays);

        const { data, error } = await supabase
          .from("echecs")
          .select("*")
          .lte("date_publication", new Date().toISOString())
          .gte("date_publication", since.toISOString())
          .order("date_publication", { ascending: false })
          .returns<Echec[]>();

        if (error) throw error;
        if (!cancelled) setItems(data ?? []);
      } catch {
        if (!cancelled) setErr("Impossible de charger les comptes-rendus.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEchecs();
    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (e) =>
        e.titre.toLowerCase().includes(s) ||
        e.contenu.toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <section className="px-6 py-10 text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          <TrendingDown size={14} className="text-red-400" />
          Analyses non confirmées
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">
          📉 Comptes-rendus d’échecs
        </h1>
        <p className="text-white/70">
          Transparence totale sur les analyses qui n’ont pas validé. Apprendre → Ajuster → Progresser.
        </p>
        <div
          aria-hidden
          className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-red-400/15 via-white/5 to-red-400/15 blur-xl"
        />
      </div>

      {/* Barre d’outils */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un match, une équipe, un mot-clé…"
          className="w-full sm:flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex items-center gap-2">
          <RangePill
            active={rangeDays === 7}
            onClick={() => setRangeDays(7)}
            label="7 jours"
          />
          <RangePill
            active={rangeDays === 30}
            onClick={() => setRangeDays(30)}
            label="30 jours"
          />
          <button
            onClick={() => {
              // petit refresh “hard”
              setRangeDays((d) => (d === 7 ? 7 : 30));
            }}
            title="Actualiser"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Rafraîchir</span>
          </button>
        </div>
      </div>

      {/* États */}
      {loading && <SkeletonList />}
      {!loading && err && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
          {err}
        </div>
      )}
      {!loading && !err && filtered.length === 0 && (
        <EmptyState />
      )}

      {/* Liste */}
      {!loading && !err && filtered.length > 0 && (
        <div className="space-y-5">
          {filtered.map((e) => (
            <FailureCard key={String(e.id)} echec={e} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- UI bits ---------- */

function RangePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition
        ${active ? "bg-red-400 text-black" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
    >
      {label}
    </button>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse"
        >
          <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
          <div className="h-4 w-40 bg-white/10 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-5/6 bg-white/10 rounded" />
            <div className="h-3 w-4/6 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-14 rounded-2xl border border-white/10 bg-white/5">
      <AlertTriangle className="mx-auto mb-3 text-yellow-300" />
      <p className="text-white/80">
        Aucun compte-rendu sur la période sélectionnée.
      </p>
      <p className="text-white/50 text-sm mt-1">
        Essaie d’élargir à 30 jours ou de modifier ta recherche.
      </p>
    </div>
  );
}

/* ---------- Carte d’un échec ---------- */

function FailureCard({ echec }: { echec: Echec }) {
  // multi-ligne propre
  const lines = useMemo(
    () =>
      echec.contenu
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean),
    [echec.contenu]
  );
  const preview = lines.slice(0, 4);

  // on essaie de retrouver un indice éventuel
  const indiceMatch = echec.contenu.match(/Indice\s*:\s*([+\-]?\d+)/i);
  const indice = indiceMatch ? parseInt(indiceMatch[1], 10) : null;

  const indiceBadge = (val: number) => {
    if (val >= 5)
      return (
        <span className="rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-xs">
          Indice +{val}
        </span>
      );
    if (val === 4)
      return (
        <span className="rounded-md bg-green-700/20 text-green-300 border border-green-600/20 px-2 py-0.5 text-xs">
          Indice +4
        </span>
      );
    if (val === 3)
      return (
        <span className="rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 px-2 py-0.5 text-xs">
          Indice +3
        </span>
      );
    return (
      <span className="rounded-md bg-red-500/15 text-red-300 border border-red-500/20 px-2 py-0.5 text-xs">
        Indice faible
      </span>
    );
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_30px_rgba(0,0,0,.35)]">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-red-200">
          {echec.titre}
        </h2>
        <div className="flex items-center gap-2">
          {indice !== null && indiceBadge(indice)}
          <span className="text-xs text-white/60">
            {new Date(echec.date_publication).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </header>

      {/* mini badges */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-red-500/15 text-red-300 border border-red-500/20 px-2 py-0.5">
          Non confirmé
        </span>
        <span className="rounded-md bg-white/10 text-white/70 border border-white/10 px-2 py-0.5">
          Post-mortem
        </span>
      </div>

      {/* Aperçu multi-ligne */}
      <div className="mt-3 space-y-1 text-sm leading-relaxed">
        {preview.map((line, i) => (
          <p key={i} className="text-white/85">
            {line}
          </p>
        ))}
        {lines.length > preview.length && (
          <p className="text-white/50 text-xs">…</p>
        )}
      </div>

      {/* Détails */}
      <details className="mt-3 group">
        <summary className="cursor-pointer inline-flex items-center gap-2 text-sm text-red-300 group-hover:text-red-200">
          ▶ Lire le compte-rendu
        </summary>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-white/90 bg-black/30 rounded-lg p-4 border border-white/10">
          {echec.contenu}
        </pre>
      </details>
    </article>
  );
}