"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

type League = { id: string; name: string };
type Group = { country: string; leagues: League[] };

const LEAGUES: Group[] = [
  { country: "France 🇫🇷", leagues: [{ id: "FR-L1", name: "Ligue 1" }, { id: "FR-CDF", name: "Coupe de France" }] },
  { country: "Angleterre 🇬🇧", leagues: [{ id: "UK-PL", name: "Premier League" }, { id: "UK-FAC", name: "FA Cup" }] },
  { country: "Espagne 🇪🇸", leagues: [{ id: "ES-L1", name: "La Liga" }, { id: "ES-CDR", name: "Copa del Rey" }] },
  { country: "Italie 🇮🇹", leagues: [{ id: "IT-A", name: "Serie A" }, { id: "IT-CI", name: "Coppa Italia" }] },
  { country: "Allemagne 🇩🇪", leagues: [{ id: "DE-BUN", name: "Bundesliga" }] },
  { country: "Pays-Bas 🇳🇱", leagues: [{ id: "NL-ERE", name: "Eredivisie" }] },
  { country: "Portugal 🇵🇹", leagues: [{ id: "PT-LP", name: "Liga Portugal" }] },
  { country: "Belgique 🇧🇪", leagues: [{ id: "BE-PL", name: "Pro League" }] },
];

export default function FormulePassion() {
  const router = useRouter();
  const { setRecapitulatif } = useRecapitulatif();

  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [optionEurope, setOptionEurope] = useState(false);

  const selectedLeagueName = useMemo(() => {
    const all = LEAGUES.flatMap(g => g.leagues);
    return all.find(l => l.id === selectedLeague)?.name ?? "";
  }, [selectedLeague]);

  const handleSelectPlan = (plan: string) => setSelectedPlan(plan);

  const getPriceText = (includeEurope: boolean) => {
    if (selectedPlan === "Sans engagement") {
      const base = 9.99;
      const total = includeEurope ? base + 5 : base;
      const desc = includeEurope ? "formule Passion + Europe" : "formule Passion";
      return `${total.toFixed(2)}€ / mois (${desc})`;
    }
    return "";
  };

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");
    const options = optionEurope ? ["europe"] : [];

    const recapData = {
      email: user.email,
      formule: "passion",
      plan: selectedPlan,
      league: selectedLeague, // code (ex: FR-L1)
      options,
      prix: getPriceText(optionEurope),
    };

    const updatedUser = {
      ...user,
      formule: "passion",
      plan: selectedPlan,
      ligue: selectedLeague, // harmonisé avec le reste de l’app
      options,
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
          ❤️ Formule
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
          Passion — Vis les matchs comme un insider
        </h1>
        <p className="mt-3 text-white/70 max-w-3xl">
          Choisis ton championnat principal, active l’option Europe si tu veux vibrer les soirs de C1/C3/C4, et profite des analyses immersives & du Fil Rouge quand il concerne ta ligue.
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
            <li>🎯 1 championnat au choix parmi tous les championnats Insight-X</li>
            <li>📊 Analyses complètes pour chaque match de ta ligue</li>
            <li>⚡️ Fil Rouge inclus s’il concerne ton championnat</li>
            <li>🌍 Option Europe (+5€/mois) : C1, C3, C4</li>
          </ul>
        </div>

        {/* Choix du championnat principal */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-lg font-semibold text-white">Choisis ton championnat principal</h3>
          <p className="mt-1 text-white/70 text-sm">
            Inclus dans l’abonnement de base à <strong>9,99 €/mois</strong>.
          </p>
          <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-blue-400/25 to-blue-400/0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LEAGUES.map((group, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-base font-semibold mb-2">{group.country}</h4>
                <ul className="space-y-2 text-sm text-white/85">
                  {group.leagues.map((league) => {
                    const active = selectedLeague === league.id;
                    return (
                      <li key={league.id} className="flex items-center justify-between">
                        <span>{league.name}</span>
                        <button
                          onClick={() =>
                            setSelectedLeague((prev) => (prev === league.id ? "" : league.id))
                          }
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold border transition",
                            active
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {active ? "Choisi ✓" : "Choisir"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {selectedLeague && (
            <p className="mt-4 text-emerald-300 text-sm">
              ✅ Sélection : <span className="font-semibold">{selectedLeagueName}</span>
            </p>
          )}
        </div>

        {/* Plan + Option Europe */}
        {selectedLeague && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-white text-center">
              Choisis ta formule d’abonnement
            </h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-violet-400/30 to-violet-400/0" />

            {/* Carte plan */}
            <div
              className={[
                "relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7",
                selectedPlan === "Sans engagement" ? "ring-2 ring-emerald-400/30" : "",
              ].join(" ")}
            >
              <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                Recommandé
              </div>

              <div className="mb-3">
                <h4 className="text-xl font-bold">Mensuel sans engagement</h4>
                <div className="mt-1 text-3xl font-extrabold">9,99 € / mois</div>
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

            {/* Option Europe */}
            {selectedPlan && (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h5 className="font-semibold mb-2 text-center">🌍 Envie des soirées d’Europe ?</h5>
                <p className="text-sm text-white/70 text-center">
                  Ajoute la <span className="text-white">Ligue des Champions</span>, l’<span className="text-white">Europa League</span> et la <span className="text-white">Conference League</span> pour <strong>+5€/mois</strong>.
                </p>
                <div className="mt-3 flex justify-center">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optionEurope}
                      onChange={() => setOptionEurope((v) => !v)}
                      className="h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                    />
                    <span className="text-sm">Activer l’option Europe (+5€/mois)</span>
                  </label>
                </div>
              </div>
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
                Championnat : <span className="font-semibold text-white">{selectedLeagueName}</span>
              </p>
              <p className="text-white/80">
                Formule : <span className="font-semibold text-white">{selectedPlan}</span>
              </p>
              {optionEurope && (
                <p className="text-emerald-300">
                  Option : <strong>Europe activée (+5€/mois)</strong>
                </p>
              )}
              <p className="mt-1 text-emerald-300">
                Prix total : <strong>{getPriceText(optionEurope)}</strong>
              </p>
            </div>

            <button
              className="mt-5 w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black hover:opacity-90 transition"
              onClick={handleUpdateSubscription}
            >
              Confirmer la modification d’abonnement →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}