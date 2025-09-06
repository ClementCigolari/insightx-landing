"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

/* ---------- Types ---------- */
const PLAN_IDS = ["decouverte", "passion", "premium", "ultra"] as const;
type PlanId = typeof PLAN_IDS[number];

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  badge?: "starter" | "popular" | "pro";
  accent: string;
  cta: string;
  ctaClass: string;
};

const LABELS: Record<PlanId, string> = {
  decouverte: "Découverte",
  passion: "Passion",
  premium: "Premium",
  ultra: "Ultra",
};

function labelPlan(id: string): string {
  if ((PLAN_IDS as readonly string[]).includes(id)) {
    return LABELS[id as PlanId];
  }
  return id;
}

/* ---------- Données ---------- */
const PLANS: Plan[] = [
  // ... (inchangé)
];

/* ---------- Composant ---------- */
export default function ModifierFormule() {
  const router = useRouter();
  const [formuleActuelle, setFormuleActuelle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const recap = localStorage.getItem("insightx_user");
      if (recap) {
        const data = JSON.parse(recap);
        setFormuleActuelle(data.formule || null);
      }
    } catch (e) {
      console.error("Erreur parsing localStorage:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = (slug: PlanId) => {
    router.push(`/espace-client/compte/modifier-formule/${slug}`);
  };

  if (loading) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-64 bg-white/10 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!formuleActuelle) {
    return (
      <section className="px-6 py-10 text-white">
        <Header />
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          Impossible de déterminer votre formule actuelle.
        </div>
      </section>
    );
  }

  const visibles = PLANS.filter((p) => p.id !== (formuleActuelle as PlanId));

  return (
    <section className="relative px-6 py-10 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl" />
      <Header />

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          Formule actuelle
        </div>
        <p className="mt-2 text-white/80">{labelPlan(formuleActuelle)}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visibles.map((p) => (
            <div key={p.id} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 flex flex-col shadow-[0_8px_24px_rgba(0,0,0,.35)]">
              {p.badge === "popular" && (
                <div className="absolute -top-3 right-4 rounded-full bg-violet-400 px-3 py-1 text-xs font-bold text-black">
                  Recommandé
                </div>
              )}
              {p.badge === "starter" && (
                <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  Essai facile
                </div>
              )}
              {p.badge === "pro" && (
                <div className="absolute -top-3 right-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                  Puissance
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-1 text-3xl font-extrabold">{p.price}</div>
                <p className="mt-2 text-white/70">{p.tagline}</p>
              </div>

              <div aria-hidden className={`my-4 h-px w-full bg-gradient-to-r ${p.accent}`} />

              <ul className="space-y-2 text-sm text-white/85 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleClick(p.id)}
                className={`mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition ${p.ctaClass}`}
              >
                {p.cta} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Header commun ---------- */
function Header() {
  return (
    <header className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
        <Trophy size={14} className="opacity-70" />
        Mon compte
      </div>
      <h1 className="mt-2 text-3xl font-extrabold">Changer de formule</h1>
      <div aria-hidden className="mt-3 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl" />
    </header>
  );
}