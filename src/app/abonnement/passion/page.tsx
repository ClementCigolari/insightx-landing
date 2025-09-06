"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

type League = { id: string; name: string };
type Group = { country: string; leagues: League[] };

const LEAGUE_GROUPS: Group[] = [
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
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [optionEurope, setOptionEurope] = useState<boolean>(false);

  const { setRecapitulatif } = useRecapitulatif();
  const router = useRouter();

  const selectedLeagueName = useMemo(() => {
    const all = LEAGUE_GROUPS.flatMap((g) => g.leagues);
    return all.find((l) => l.id === selectedLeague)?.name ?? "";
  }, [selectedLeague]);

  const handleCreateAccount = () => {
    const recapData = {
      formule: "passion",
      plan: selectedPlan,
      league: selectedLeague,
      options: optionEurope ? ["europe"] : [],
      prix: getPriceText(),
    };

    setRecapitulatif(recapData);
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    router.push("/inscription");
  };

  const getPriceText = () => {
    if (selectedPlan === "Sans engagement") {
      const base = 9.99;
      const total = optionEurope ? base + 5 : base;
      const desc = optionEurope ? "formule Passion + Europe" : "formule Passion";
      return `${total.toFixed(2)}€ / mois (${desc})`;
    }
    return "";
  };

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Titre + pitch */}
        <h1 className="text-center text-4xl sm:text-5xl font-bold mb-4">
          Formule Passion : Vivez chaque match comme un insider
        </h1>
        <p className="text-center text-lg sm:text-xl text-white/80 mb-10 max-w-3xl mx-auto">
          Choisis ton championnat principal et reçois des analyses complètes pour chaque match :
          immersion, stratégie, stats clés et décryptage minute par minute.
        </p>

        {/* Ce que tu obtiens */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="space-y-3 text-white/90">
            <li>🎯 1 championnat au choix parmi tous les championnats Insight-X.</li>
            <li>📊 Analyses complètes pour chaque match : immersion, stratégie, stats clés, minute par minute.</li>
            <li>⚡️ Match Fil Rouge si la rencontre concerne ton championnat sélectionné.</li>
            <li>🌍 Option Europe (+5€/mois) : Ligue des Champions, Europa League, Conference.</li>
          </ul>
        </div>

        {/* Choix championnat */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-center text-2xl font-semibold mb-2">Choisissez votre championnat principal</h3>
          <p className="text-center text-white/70 mb-6">
            Inclus dans la formule à <strong>9,99€/mois</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LEAGUE_GROUPS.map((group) => (
              <div key={group.country} className="rounded-xl border border-white/10 bg-black/40 p-4">
                <h4 className="mb-3 text-lg font-semibold">{group.country}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.leagues.map((lg) => {
                    const active = selectedLeague === lg.id;
                    return (
                      <button
                        key={lg.id}
                        onClick={() => setSelectedLeague(active ? "" : lg.id)}
                        className={[
                          "rounded-full px-4 py-2 text-sm font-semibold border transition",
                          active
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/40 hover:bg-white hover:text-black",
                        ].join(" ")}
                      >
                        {lg.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedLeague && (
            <p className="mt-4 text-center text-emerald-400">
              ✅ Vous avez sélectionné : <strong>{selectedLeagueName}</strong>
            </p>
          )}
        </div>

        {/* Choix plan + option Europe */}
        {selectedLeague && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-center text-xl font-semibold mb-4">Choisissez votre formule d’abonnement</h3>

            <div className="flex flex-col gap-4">
              <div
                className={[
                  "rounded-xl border p-4 transition",
                  selectedPlan === "Sans engagement"
                    ? "bg-white text-black border-white"
                    : "bg-black/60 border-white/30",
                ].join(" ")}
              >
                <h4 className="text-lg font-bold">🔁 Mensuel sans engagement</h4>
                <p className={["mb-3", selectedPlan === "Sans engagement" ? "text-black/80" : "text-white/70"].join(" ")}>
                  9,99€ / mois. Paiement récurrent. Annulable à tout moment.
                </p>
                <button
                  onClick={() => setSelectedPlan("Sans engagement")}
                  className={[
                    "w-full rounded-full px-4 py-2 font-semibold",
                    selectedPlan === "Sans engagement"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-white/90",
                  ].join(" ")}
                >
                  Choisir cette formule
                </button>
              </div>
            </div>

            {selectedPlan && (
              <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-5">
                <h4 className="text-center text-white font-semibold mb-2">
                  🌍 Envie de vibrer aussi les soirs d’Europe ?
                </h4>
                <p className="text-center text-white/80 mb-4">
                  Pour <strong>+5€/mois</strong> : Ligue des Champions, Europa League, Conference League.
                </p>

                <label className="mx-auto flex w-max cursor-pointer items-center gap-3">
                  {/* switch */}
                  <span
                    onClick={() => setOptionEurope((v) => !v)}
                    className={[
                      "inline-flex h-7 w-12 items-center rounded-full p-1 transition",
                      optionEurope ? "bg-emerald-500" : "bg-white/20",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-5 w-5 rounded-full bg-white transition",
                        optionEurope ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </span>
                  <span className="text-white/90 select-none">
                    Activer l’option Europe <span className="text-white/60">( +5€/mois )</span>
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Récap + CTA */}
        {selectedPlan && selectedLeague && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-xl font-semibold mb-2">✅ Récapitulatif</h3>
            <p className="text-white/80 mb-3">
              Championnat : <strong>{selectedLeagueName}</strong>
              <br />
              Formule : <strong>{selectedPlan}</strong>
              {optionEurope && (
                <>
                  <br />Option : <span className="text-emerald-400 font-semibold">Europe activée (+5€/mois)</span>
                </>
              )}
            </p>
            <p className="mb-5 text-emerald-400">
              Prix total : <strong>{getPriceText()}</strong>
            </p>

            <button
              onClick={handleCreateAccount}
              className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:brightness-95"
            >
              Création de votre espace membre
            </button>
            <p className="mt-2 text-sm text-white/60">
              Vous créerez votre espace client juste après cette étape.
            </p>
          </div>
        )}

        {/* Retour */}
        <div className="text-center">
          <Link href="/">
            <span className="inline-block rounded-full border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black">
              Retour à l’accueil
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}