"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";
import { FaBolt, FaChartLine, FaFutbol, FaFlagCheckered } from "react-icons/fa";

export default function FormuleDecouverte() {
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const router = useRouter();
  const { setRecapitulatif } = useRecapitulatif();

  const handleSelectLeague = (league: string) => {
    setSelectedLeague(league);
    setSelectedPlan("");
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleCreateAccount = () => {
    const recapData = {
      formule: "decouverte",
      plan: selectedPlan,
      league: selectedLeague,
      prix: getPriceText(),
    };
    setRecapitulatif(recapData);
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    router.push(`/inscription`);
  };

  const getPriceText = () =>
    selectedPlan === "Sans engagement"
      ? "4,99€ / mois (paiement récurrent, résiliable à tout moment)"
      : "";

  const LEAGUES = [
    { label: "Ligue 1", flag: "🇫🇷" },
    { label: "Premier League", flag: "🇬🇧" },
    { label: "Bundesliga", flag: "🇩🇪" },
    { label: "Serie A", flag: "🇮🇹" },
    { label: "Liga", flag: "🇪🇸" },
  ];

  return (
    <section className="relative min-h-screen bg-black text-white">
      {/* Backdrop léger */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/hero-stade.jpg')] bg-cover bg-center opacity-10"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            Formule Découverte
            <span className="mx-1">•</span>
            4,99€ / mois
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Ton premier pas dans l’analyse immersive
          </h1>
          <p className="mt-4 text-white/80 max-w-3xl mx-auto">
            Choisis un championnat et profite de nos analyses scénarisées,
            du Match Fil Rouge et d’une méthode claire pour lire chaque match.
          </p>
        </div>

        {/* Ce que vous obtenez */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,.35)] mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-5">Ce que tu obtiens</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <FaFlagCheckered className="mt-1 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold">1 championnat au choix</p>
                <p className="text-white/70 text-sm">
                  Ligue 1, Premier League, Bundesliga, Serie A ou Liga.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <FaFutbol className="mt-1 shrink-0 text-white/90" />
              <div>
                <p className="font-semibold">3 analyses immersives / journée</p>
                <p className="text-white/70 text-sm">ven • sam • dim (soir).</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <FaBolt className="mt-1 shrink-0 text-amber-300" />
              <div>
                <p className="font-semibold">Le Match Fil Rouge</p>
                <p className="text-white/70 text-sm">
                  Scénario immersif + suivi live chaque journée.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
              <FaChartLine className="mt-1 shrink-0 text-sky-300" />
              <div>
                <p className="font-semibold">Analyses stratégiques Insight-X</p>
                <p className="text-white/70 text-sm">Claires. Structurées. Efficaces.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Choix championnat */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
            Choisis ton championnat
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {LEAGUES.map(({ label, flag }) => {
              const active = selectedLeague === label;
              return (
                <button
                  key={label}
                  onClick={() => handleSelectLeague(label)}
                  className={[
                    "w-full rounded-xl px-4 py-3 text-sm sm:text-base font-semibold border transition",
                    active
                      ? "bg-white text-black border-white"
                      : "bg-black/60 text-white border-white/20 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="mr-2">{flag}</span>
                  {label}
                </button>
              );
            })}
          </div>

          {selectedLeague && (
            <p className="mt-4 text-center text-emerald-300">
              Sélection : <strong>{selectedLeague}</strong>
            </p>
          )}
        </div>

        {/* Choix plan */}
        {selectedLeague && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              Choisis ta formule d’abonnement
            </h3>

            <div
              className={[
                "rounded-xl border transition p-5 sm:p-6",
                selectedPlan === "Sans engagement"
                  ? "bg-white text-black border-white"
                  : "bg-black/50 text-white border-white/15 hover:bg-white/5",
              ].join(" ")}
            >
              <h4 className="text-base sm:text-lg font-bold">
                🔁 Mensuel sans engagement
              </h4>
              <p
                className={[
                  "mt-1 mb-3 text-sm sm:text-base",
                  selectedPlan === "Sans engagement" ? "text-black/80" : "text-white/70",
                ].join(" ")}
              >
                4,99€ / mois. Paiement récurrent. Annulable à tout moment.
              </p>
              <button
                onClick={() => handleSelectPlan("Sans engagement")}
                className={[
                  "w-full rounded-xl px-5 py-3 font-semibold transition",
                  selectedPlan === "Sans engagement"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-white/90",
                ].join(" ")}
              >
                Choisir cette formule
              </button>
            </div>

            {selectedPlan && (
              <p className="mt-4 text-center text-emerald-300">
                Choix : <strong>{selectedPlan}</strong>
              </p>
            )}
          </div>
        )}

        {/* Récap + CTA */}
        {selectedPlan && selectedLeague && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-10 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              ✅ Récapitulatif
            </h3>
            <p className="text-white/80 mb-4">
              Championnat : <strong>{selectedLeague}</strong> • Formule :{" "}
              <strong>{selectedPlan}</strong>
              <br />
              <span className="text-emerald-300">
                Prix : <strong>{getPriceText()}</strong>
              </span>
            </p>

            <button
              onClick={handleCreateAccount}
              className="group inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-black shadow hover:shadow-[0_12px_30px_rgba(16,185,129,.35)] transition"
            >
              <span className="animate-[pulse_2s_ease-in-out_infinite]">Créer mon espace membre</span>
              <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
            </button>

            <p className="text-xs text-white/60 mt-3">
              Ton espace client est créé juste après cette étape.
            </p>
          </div>
        )}

        {/* Retour */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-white/20 px-6 py-3 text-white/90 hover:bg-white/10 transition"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </section>
  );
}