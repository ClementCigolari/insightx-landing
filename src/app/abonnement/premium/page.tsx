"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type League = { id: string; name: string };
type Group = { country: string; leagues: League[] };

const EXTRA_GROUPS: Group[] = [
  { country: "France 🇫🇷",    leagues: [{ id: "FR-CDF", name: "Coupe de France" }] },
  { country: "Angleterre 🇬🇧", leagues: [{ id: "UK-FAC", name: "FA Cup" }] },
  { country: "Espagne 🇪🇸",   leagues: [{ id: "ES-CDR", name: "Copa del Rey" }] },
  { country: "Italie 🇮🇹",    leagues: [{ id: "IT-CI",  name: "Coppa Italia" }] },
  { country: "Pays-Bas 🇳🇱",  leagues: [{ id: "NL-ERE", name: "Eredivisie" }] },
  { country: "Portugal 🇵🇹",  leagues: [{ id: "PT-LP",  name: "Liga Portugal" }] },
  { country: "Belgique 🇧🇪",  leagues: [{ id: "BE-PL",  name: "Pro League" }] },
];

export default function FormulePremium() {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [noExtra, setNoExtra] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"Sans engagement" | "">("");
  const [optionEurope, setOptionEurope] = useState(false);

  const router = useRouter();

  const allExtras = useMemo(
    () => EXTRA_GROUPS.flatMap((g) => g.leagues),
    []
  );

  const toggleExtra = (id: string) => {
    if (noExtra) return; // désactivé si "pas de championnats sup."
    setSelectedLeagues((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateAccount = () => {
    const recapData = {
      formule: "premium",
      plan: "premium",
      options: [
        ...(optionEurope ? ["europe"] : []),
        ...selectedLeagues,
      ],
      prix: getPriceText(),
    };
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    router.push("/inscription");
  };

  const getPriceText = () => {
    const base = 19.99;
    const europe = optionEurope ? 5 : 0;
    const extras = selectedLeagues.length * 5;
    if (selectedPlan === "Sans engagement") {
      const total = base + europe + extras;
      return `${total.toFixed(2)}€ / mois (paiement récurrent, résiliable à tout moment)`;
    }
    return "";
  };

  const selectedLeaguesLabels = selectedLeagues
    .map((id) => allExtras.find((l) => l.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-400/15 ring-1 ring-violet-400/30 px-3 py-1 text-xs font-semibold text-violet-300">
            Formule Premium
            <span className="mx-1">•</span>
            19,99€ / mois
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
            Les 5 grands championnats, sans aucune limite
          </h1>
          <p className="mt-4 text-white/80 max-w-3xl mx-auto">
            Accède à toutes nos analyses pour chaque match, avec le Match Fil Rouge
            à chaque journée. Ajoute l’Europe et des championnats secondaires si tu veux aller plus loin.
          </p>
        </div>

        {/* Ce que vous obtenez */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="space-y-3 text-white/90">
            <li>⚽️ Accès aux <strong>5 grands championnats européens</strong></li>
            <li>📊 Analyses complètes pour <strong>chaque match</strong></li>
            <li>⚡️ <strong>Match Fil Rouge</strong> à chaque journée</li>
            <li>🌍 Option Europe (+5€/mois) : Coupes européennes</li>
            <li>🏆 Ajoute des <strong>championnats secondaires</strong> (+5€/mois chacun)</li>
          </ul>
        </div>

        {/* Extras: championnats secondaires */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-center text-2xl font-semibold mb-2">
            Ajouter des championnats secondaires ? (+5€ / mois chacun)
          </h3>
          <p className="text-center text-white/70 mb-6">
            Tu peux en prendre <strong>0, 1 ou plusieurs</strong> — au choix.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EXTRA_GROUPS.map((group) => (
              <div key={group.country} className="rounded-xl border border-white/10 bg-black/40 p-4">
                <h4 className="mb-3 text-lg font-semibold">{group.country}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.leagues.map((lg) => {
                    const active = selectedLeagues.includes(lg.id);
                    return (
                      <button
                        key={lg.id}
                        onClick={() => toggleExtra(lg.id)}
                        disabled={noExtra}
                        className={[
                          "rounded-full px-4 py-2 text-sm font-semibold border transition",
                          noExtra
                            ? "cursor-not-allowed opacity-40 border-white/20"
                            : active
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/40 hover:bg-white hover:text-black",
                        ].join(" ")}
                      >
                        {lg.name} <span className="opacity-60">+5€</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No extra switch */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setNoExtra((v) => {
                  const next = !v;
                  if (next) setSelectedLeagues([]);
                  return next;
                });
              }}
              className={[
                "inline-flex h-7 w-12 items-center rounded-full p-1 transition",
                noExtra ? "bg-emerald-500" : "bg-white/20",
              ].join(" ")}
              aria-pressed={noExtra}
            >
              <span
                className={[
                  "h-5 w-5 rounded-full bg-white transition",
                  noExtra ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </button>
            <span className="text-sm text-white/80 select-none">
              Je ne souhaite pas de championnats supplémentaires
            </span>
          </div>

          {/* Résumé des extras */}
          {!noExtra && selectedLeagues.length > 0 && (
            <p className="mt-6 text-center text-emerald-400">
              ✅ Sélection : <strong>{selectedLeaguesLabels.join(", ")}</strong>
            </p>
          )}
        </div>

        {/* Plan + Option Europe */}
        {(selectedLeagues.length > 0 || noExtra) && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-center text-xl font-semibold mb-4">
              Choisissez votre formule d’abonnement
            </h3>

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
                19,99€ / mois. Paiement récurrent. Annulable à tout moment.
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

            {selectedPlan && (
              <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-5">
                <h4 className="text-center font-semibold mb-2">
                  🌍 Envie de vibrer aussi les soirs d’Europe ?
                </h4>
                <p className="text-center text-white/80 mb-4">
                  Pour <strong>+5€/mois</strong> : Ligue des Champions, Europa League, Conference.
                </p>

                <label className="mx-auto flex w-max cursor-pointer items-center gap-3">
                  <span
                    onClick={() => setOptionEurope((v) => !v)}
                    className={[
                      "inline-flex h-7 w-12 items-center rounded-full p-1 transition",
                      optionEurope ? "bg-emerald-500" : "bg-white/20",
                    ].join(" ")}
                    aria-pressed={optionEurope}
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
        {selectedPlan && (selectedLeagues.length > 0 || noExtra) && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-xl font-semibold mb-3">✅ Récapitulatif</h3>

            <p className="text-white/80">
              Formule : <strong>Premium</strong>
              <br />
              Abonnement : <strong>{selectedPlan}</strong>
            </p>

            {optionEurope && (
              <p className="mt-2 text-emerald-400 font-semibold">
                ➕ Europe activée <span className="text-sm">( +5€/mois )</span>
              </p>
            )}

            {!noExtra && selectedLeagues.length > 0 && (
              <div className="mt-4">
                <p className="text-emerald-400 font-semibold mb-2">
                  ➕ Championnats secondaires :
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedLeagues.map((id) => {
                    const label = allExtras.find((l) => l.id === id)?.name ?? id;
                    return (
                      <span
                        key={id}
                        className="flex items-center gap-2 rounded-full bg-black/50 border border-white/15 px-4 py-2 text-sm"
                      >
                        {label}
                        <span className="text-emerald-300 font-semibold text-xs">+5€</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mt-4 text-emerald-400 text-lg">
              Prix total : <strong>{getPriceText()}</strong>
            </p>

            <button
              onClick={handleCreateAccount}
              className="mt-4 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:brightness-95"
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
          <Link
            href="/"
            className="inline-block rounded-full border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </section>
  );
}