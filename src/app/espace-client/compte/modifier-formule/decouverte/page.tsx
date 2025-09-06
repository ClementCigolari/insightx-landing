"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

const LIGUES = ["Ligue 1", "Premier League", "Bundesliga", "Serie A", "Liga"];

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

  const getPriceText = () => {
    switch (selectedPlan) {
      case "Sans engagement":
        return "4,99€ / mois (paiement récurrent, résiliable à tout moment)";
      default:
        return "";
    }
  };

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");

    const recapData = {
      email: user.email,
      formule: "decouverte",
      plan: selectedPlan,
      league: selectedLeague,
      options: [],
      prix: getPriceText(),
    };

    // Nettoyage/maj côté front
    const updatedUser = {
      ...user,
      formule: "decouverte",
      plan: selectedPlan,
      ligue: selectedLeague,
      options: [],
    };

    localStorage.setItem("insightx_user", JSON.stringify(updatedUser));
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    setRecapitulatif(recapData);

    const response = await fetch("/api/modification-formule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recapData),
    });

    if (response.ok) {
      const confirmed = window.confirm(
        "Votre demande de changement de formule a bien été envoyée à l’équipe Insight-X.\n\nElle prendra effet à la date de renouvellement de votre abonnement mensuel.\n\nVous allez maintenant être déconnecté(e)."
      );
      if (confirmed) {
        localStorage.removeItem("insightx_user");
        localStorage.removeItem("insightx_recap");
        router.push("/connexion");
      }
    } else {
      alert("Une erreur est survenue. Merci de réessayer ou de nous contacter.");
    }
  };

  return (
    <section className="relative px-6 py-10 text-white min-h-screen">
      {/* halo top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-emerald-400/10 via-white/10 to-transparent blur-2xl"
      />

      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
          🎯 Formule
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
          Découverte — Plonge au cœur des matchs
        </h1>
        <p className="mt-3 text-white/70 max-w-3xl">
          Choisis ton championnat, active le mensuel sans engagement, et profite
          des analyses immersives, scénarios et fil rouge quand il concerne ta ligue.
        </p>
        <div
          aria-hidden
          className="mt-4 h-10 w-full rounded-full bg-gradient-to-r from-emerald-400/10 via-white/5 to-emerald-400/10 blur-xl"
        />
      </header>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Ce que tu obtiens */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h2 className="text-xl font-bold">Ce que tu obtiens</h2>
          <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />
          <ul className="grid sm:grid-cols-2 gap-3 text-white/85 text-sm">
            <li>🎯 1 championnat au choix (Ligue 1, Premier League, Bundesliga, Serie A, Liga)</li>
            <li>📊 3 analyses immersives par journée (ven / sam / dim)</li>
            <li>🔥 1 Match Fil Rouge par journée si dans ta ligue</li>
            <li>🧠 Analyses stratégiques Insight-X</li>
          </ul>
        </div>

        {/* Choix du championnat */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-lg font-semibold text-white">Choisis ton championnat</h3>
          <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-blue-400/25 to-blue-400/0" />
          <div className="flex flex-wrap gap-3">
            {LIGUES.map((league) => {
              const active = selectedLeague === league;
              return (
                <button
                  key={league}
                  onClick={() => handleSelectLeague(league)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold border transition",
                    active
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                  ].join(" ")}
                >
                  {league}
                </button>
              );
            })}
          </div>

          {selectedLeague && (
            <p className="mt-4 text-emerald-300 text-sm">
              ✅ Sélection : <span className="font-semibold">{selectedLeague}</span>
            </p>
          )}
        </div>

        {/* Plan (unique) */}
        {selectedLeague && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-white text-center">
              Choisis ta formule d’abonnement
            </h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-violet-400/30 to-violet-400/0" />

            <div
              className={[
                "relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7",
                selectedPlan === "Sans engagement" ? "ring-2 ring-emerald-400/30" : "",
              ].join(" ")}
            >
              {/* ruban essai */}
              <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                Essai facile
              </div>

              <div className="mb-3">
                <h4 className="text-xl font-bold">Mensuel sans engagement</h4>
                <div className="mt-1 text-3xl font-extrabold">4,99 € / mois</div>
                <p className="mt-2 text-white/70 text-sm">
                  Paiement récurrent. Annulable à tout moment.
                </p>
              </div>

              <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />

              <button
                onClick={() => handleSelectPlan("Sans engagement")}
                className={[
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition",
                  selectedPlan === "Sans engagement"
                    ? "bg-emerald-400 text-black hover:opacity-90"
                    : "bg-white text-black hover:opacity-90",
                ].join(" ")}
              >
                {selectedPlan === "Sans engagement" ? "Sélectionné ✓" : "Choisir cette formule"}
              </button>
            </div>

            {selectedPlan && (
              <p className="mt-4 text-center text-emerald-300 text-sm">
                ✅ Choix : <strong>{selectedPlan}</strong>
              </p>
            )}
          </div>
        )}

        {/* Récap + CTA */}
        {selectedPlan && selectedLeague && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-white text-center">Récapitulatif</h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />

            <div className="text-center text-sm">
              <p className="text-white/80">
                Championnat : <span className="font-semibold text-white">{selectedLeague}</span>
              </p>
              <p className="text-white/80">
                Formule : <span className="font-semibold text-white">{selectedPlan}</span>
              </p>
              <p className="mt-1 text-emerald-300">
                Prix total : <strong>{getPriceText()}</strong>
              </p>
            </div>

            <button
              onClick={handleUpdateSubscription}
              className="mt-5 w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black hover:opacity-90 transition"
            >
              Confirmer la modification d’abonnement →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}