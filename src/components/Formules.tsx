"use client";

import Link from "next/link";

// util facultative; si tu n'en as pas, remplace cn(...) par des concat de classes
function cn(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type Plan = {
  slug: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  badge?: "popular" | "starter" | "pro";
  accent: string; // gradient/ombre
  cta: string;
};

const PLANS: Plan[] = [
  {
    slug: "decouverte",
    name: "Découverte",
    price: "4,99 €/mois",
    tagline: "Teste Insight-X sur un championnat.",
    features: [
      "1 championnat au choix parmi les 5 grands",
      "1 analyse immersive / jour clé (ven/sam/dim)",
      "Fil Rouge si dans le championnat choisi",
    ],
    badge: "starter",
    accent:
      "from-emerald-400/25 to-emerald-400/0 shadow-[0_8px_30px_rgba(16,185,129,.25)]",
    cta: "Commencer l’essai",
  },
  {
    slug: "passion",
    name: "Passion",
    price: "9,99 €/mois",
    tagline: "Toutes les analyses sur TON championnat.",
    features: [
      "1 championnat au choix (tous les championnats Insight-X)",
      "Analyses complètes pour chaque match",
      "Fil Rouge inclus si concerné",
      "Option Europe (+5 €/mois)",
    ],
    accent:
      "from-blue-400/25 to-blue-400/0 shadow-[0_8px_30px_rgba(59,130,246,.25)]",
    cta: "Choisir Passion",
  },
  {
    slug: "premium",
    name: "Premium",
    price: "19,99 €/mois",
    tagline: "Le pack complet pour ne rien rater.",
    features: [
      "Accès aux 5 grands championnats",
      "Toutes les analyses Insight-X pour chaque match",
      "Fil Rouge chaque journée",
      "Option Europe (+5 €/mois) • +1 championnat secondaire (+5 €/mois)",
    ],
    badge: "popular",
    accent:
      "from-violet-400/30 to-violet-400/0 shadow-[0_12px_40px_rgba(139,92,246,.35)]",
    cta: "Choisir Premium",
  },
  {
    slug: "ultra",
    name: "Ultra",
    price: "49,99 €/mois",
    tagline: "Europe + Internationaux + lives & Fil Rouge.",
    features: [
      "5 grands championnats + Coupes d’Europe",
      "Compétitions internationales (Euro, CDM, CAN, etc.)",
      "Toutes les analyses, lives Insight-X & Fil Rouge chaque journée",
      "+1 championnat secondaire (+5 €/mois)",
    ],
    badge: "pro",
    accent:
      "from-amber-400/25 to-amber-400/0 shadow-[0_12px_40px_rgba(245,158,11,.30)]",
    cta: "Choisir Ultra",
  },
];

export default function Formules() {
  return (
    <section id="pricing" className="relative py-24 px-6 sm:px-10 bg-black text-white">
      {/* halo doux derrière le titre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/5 to-transparent"
      />
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
        Choisis ton terrain de jeu
      </h2>
      <p className="text-center text-white/70 max-w-2xl mx-auto mb-12">
        Paiement sécurisé via Stripe • Sans engagement • Annulable à tout moment
      </p>

      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {PLANS.map((p) => {
          const isPopular = p.badge === "popular";
          const isStarter = p.badge === "starter";
          const isPro = p.badge === "pro";

          return (
            <div
              key={p.slug}
              className={cn(
                "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm",
                "p-6 sm:p-8 flex flex-col shadow-[0_8px_24px_rgba(0,0,0,.35)]",
                isPopular && "ring-2 ring-violet-400/30"
              )}
            >
              {/* Rubans */}
              {isPopular && (
                <div className="absolute -top-3 right-4 rounded-full bg-violet-500 px-3 py-1 text-xs font-bold text-black">
                  Recommandé
                </div>
              )}
              {isStarter && (
                <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                  Essai facile
                </div>
              )}
              {isPro && (
                <div className="absolute -top-3 right-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                  Puissance
                </div>
              )}

              {/* Titre + prix */}
              <div className="mb-4">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-1 text-3xl font-extrabold">{p.price}</div>
                <p className="mt-2 text-white/70">{p.tagline}</p>
              </div>

              {/* séparateur gradient */}
              <div aria-hidden className={cn("my-4 h-px w-full bg-gradient-to-r", p.accent)} />

              {/* Features */}
              <ul className="space-y-2 text-sm text-white/85 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA — dimensions uniformes */}
              <Link
                href={`/abonnement/${p.slug}`}
                className={cn(
                  // 👇 tailles uniformes
                  "mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl px-5 font-semibold transition whitespace-nowrap",
                  // 👇 style de base + variantes
                  "bg-white text-black hover:opacity-90",
                  isPopular &&
                    "bg-violet-400 text-black hover:shadow-[0_12px_30px_rgba(139,92,246,.35)]",
                  isStarter &&
                    "bg-emerald-400 text-black hover:shadow-[0_12px_30px_rgba(16,185,129,.35)]",
                  isPro &&
                    "bg-amber-400 text-black hover:shadow-[0_12px_30px_rgba(245,158,11,.35)]"
                )}
              >
                {p.cta} →
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}