"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flag, ArrowRight } from "lucide-react";
import { internationale } from "@/app/data/internationale";
import InternationaleCard from "@/components/InternationaleCard";

// Type dérivé des données
type Cup = typeof internationale[number];

type InsightUser = {
  formule: string; // "decouverte" | "passion" | "premium" | "ultra"
  options?: string[];
};

export default function CoupesInternationales() {
  const router = useRouter();
  const [items, setItems] = useState<Cup[] | null>(null);
  const [formule, setFormule] = useState("");

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

      // Règles d’accès :
      // ULTRA => accès complet
      // PREMIUM => accès complet
      // PASSION => accès complet
      // DECOUVERTE => pas d’internationales
      const hasInternationales = f === "ultra" || f === "premium" || f === "passion";

      setItems(hasInternationales ? internationale : []);
    } catch (e) {
      console.error("Parse insightx_user:", e);
      setItems([]);
    }
  }, [router]);

  if (items === null) {
    // Skeleton
    return (
      <section className="relative p-6 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-yellow-400/15 via-orange-400/10 to-transparent blur-2xl"
        />
        <div className="h-8 w-56 rounded-lg bg-white/10 animate-pulse mb-4" />
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const empty = items.length === 0;

  return (
    <section className="relative p-6 text-white">
      {/* halo top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-yellow-400/15 via-orange-400/10 to-transparent blur-2xl"
      />

      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          <Flag size={14} className="opacity-70" />
          Compétitions Internationales
        </div>
        <h1 className="mt-3 text-2xl font-extrabold">Accès ({items.length})</h1>
        <p className="text-white/70">
          {formule ? `Formule : ${formule.charAt(0).toUpperCase() + formule.slice(1)}` : ""}
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        {!empty ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {items.map((cup) => (
              <InternationaleCard
                key={cup.name}
                name={cup.name}
                logo={cup.logo}
                href={cup.href}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-white/80">
              Aucune compétition internationale disponible avec ta formule actuelle.
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