"use client";

import { useEffect,  useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import { championnats, type Championnat } from "@/app/data/championnats";
import ChampionnatCard from "@/components/ChampionnatCard";

type InsightUser = {
  formule: string;       // "decouverte" | "passion" | "premium" | "ultra"
  ligue?: string | string[]; // parfois un code, parfois un nom => on gère les deux
  options?: string[];    // ex: ["europe","FR-CDF","NL-ERE"]
};

const GRANDS_CODES = ["FR-L1", "UK-PL", "DE-BUN", "IT-A", "ES-L1"];

/** Permet de matcher un championnat soit par code, soit par nom. */
function matchChamp(keys: string[], champ: Championnat) {
  const lowerKeys = keys.map((k) => k?.toLowerCase?.());
  return (
    lowerKeys.includes(champ.code.toLowerCase()) ||
    lowerKeys.includes(champ.nom.toLowerCase()) ||
    (champ.name && lowerKeys.includes(champ.name.toLowerCase()))
  );
}

export default function MesChampionats() {
  const router = useRouter();
  const [items, setItems] = useState<Championnat[] | null>(null);
  const [formule, setFormule] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("insightx_user");
    if (!raw) {
      router.push("/connexion");
      return;
    }
    try {
      const u: Partial<InsightUser> = JSON.parse(raw);
      const f = (u.formule || "").toString().toLowerCase();
      setFormule(f);

      const ligueRaw = u.ligue;
      const options = Array.isArray(u.options) ? u.options : [];

      // Normalise la/les ligues en tableau de strings
      const ligues: string[] = Array.isArray(ligueRaw)
        ? ligueRaw.map(String)
        : ligueRaw
        ? [String(ligueRaw)]
        : [];

      let visibles: Championnat[] = [];

      if (f === "decouverte") {
        // Découverte : 1 ligue au choix — parfois stockée par nom ("Ligue 1") ou code ("FR-L1")
        visibles = championnats.filter((c) => matchChamp(ligues, c));
      } else if (f === "passion") {
        // Passion : ligue principale (par code la plupart du temps)
        visibles = championnats.filter((c) => matchChamp(ligues, c));
        // + Europe si option "europe" ? (la page Europe a sa propre section, on n’ajoute pas ici)
      } else if (f === "premium" || f === "ultra") {
        // 5 grands championnats + options (codes supplémentaires)
        const allCodes = new Set<string>([...GRANDS_CODES, ...options]);
        visibles = championnats.filter((c) => allCodes.has(c.code));
      }

      // Uniq + tri : 5 grands d’abord, puis alphabétique
      const uniq = Array.from(
        new Map(visibles.map((v) => [v.code, v])).values()
      );
      uniq.sort((a, b) => {
        const aTop = GRANDS_CODES.includes(a.code) ? 0 : 1;
        const bTop = GRANDS_CODES.includes(b.code) ? 0 : 1;
        if (aTop !== bTop) return aTop - bTop;
        return a.nom.localeCompare(b.nom, "fr");
      });

      setItems(uniq);
    } catch (e) {
      console.error("Parse insightx_user:", e);
      setItems([]);
    }
  }, [router]);

  if (items === null) {
    // skeleton
    return (
      <div className="px-4 py-8">
        <div className="h-8 w-56 rounded-lg bg-white/10 animate-pulse mb-4" />
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const empty = items.length === 0;

  return (
    <section className="relative p-6 text-white">
      {/* halo top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl"
      />

      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          <Trophy size={14} className="opacity-70" />
          Mes championnats
        </div>
        <h1 className="mt-3 text-2xl font-extrabold">
          Accès ({items.length})
        </h1>
        <p className="text-white/70">
          {formule ? `Formule : ${formule.charAt(0).toUpperCase() + formule.slice(1)}` : ""}
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        {!empty ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {items.map((champ) => (
              <ChampionnatCard
                key={champ.code}
                nom={champ.nom}
                code={champ.code}
                name={champ.name}
                logo={champ.logo}
                href={champ.href}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-white/80">
              Aucun championnat disponible avec ta formule actuelle.
            </p>
            <div className="mt-4">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-3 font-semibold hover:opacity-90"
              >
                Voir les formules <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}