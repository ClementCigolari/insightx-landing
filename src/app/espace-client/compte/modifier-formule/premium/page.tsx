"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

type League = { id: string; name: string };
type Group = { country: string; leagues: League[] };

const LEAGUES: Group[] = [
  { country: "France 🇫🇷", leagues: [{ id: "FR-CDF", name: "Coupe de France" }] },
  { country: "Angleterre 🇬🇧", leagues: [{ id: "UK-FAC", name: "FA Cup" }] },
  { country: "Espagne 🇪🇸", leagues: [{ id: "ES-CDR", name: "Copa del Rey" }] },
  { country: "Italie 🇮🇹", leagues: [{ id: "IT-CI", name: "Coppa Italia" }] },
  { country: "Pays-Bas 🇳🇱", leagues: [{ id: "NL-ERE", name: "Eredivisie" }] },
  { country: "Portugal 🇵🇹", leagues: [{ id: "PT-LP", name: "Liga Portugal" }] },
  { country: "Belgique 🇧🇪", leagues: [{ id: "BE-PL", name: "Pro League" }] },
];

export default function FormulePremium() {
  const router = useRouter();
  const { setRecapitulatif } = useRecapitulatif();

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [noExtra, setNoExtra] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [optionEurope, setOptionEurope] = useState(false);

  const toggleLeague = (id: string) => {
    if (noExtra) return;
    setSelectedLeagues((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectPlan = (plan: string) => setSelectedPlan(plan);

  const getPriceText = () => {
    const base = 19.99;
    const plusEurope = optionEurope ? 5 : 0;
    const plusLeagues = selectedLeagues.length * 5;
    if (selectedPlan === "Formule Premium") {
      const total = base + plusEurope + plusLeagues;
      return `${total.toFixed(2)}€ / mois (paiement récurrent, résiliable à tout moment)`;
    }
    return "";
  };

  const selectedLeagueNames = useMemo(() => {
    const all = LEAGUES.flatMap((g) => g.leagues);
    return selectedLeagues
      .map((id) => all.find((l) => l.id === id)?.name ?? id)
      .filter(Boolean);
  }, [selectedLeagues]);

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");
    const options = [...(optionEurope ? ["europe"] : []), ...selectedLeagues];

    const recapData = {
      email: user.email,
      formule: "premium",
      plan: selectedPlan,
      league: "multi",
      options,
      prix: getPriceText(),
    };

    const updatedUser = {
      ...user,
      formule: "premium",
      plan: selectedPlan,
      ligue: "multi",
      options,
    };

    localStorage.setItem("insightx_user", JSON.stringify(updatedUser));
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    setRecapitulatif(recapData);

    const res = await fetch("/api/modification-formule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recapData),
    });

    if (res.ok) {
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
          🚀 Formule
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
          Premium — Les 5 grands championnats, sans limite
        </h1>
        <p className="mt-3 text-white/70 max-w-3xl">
          Accès aux 5 grands championnats, analyses complètes, Fil Rouge chaque journée. Ajoute l’Europe et/ou des championnats secondaires si tu veux pousser l’immersion.
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
            <li>⚽️ Accès aux 5 grands championnats européens</li>
            <li>📊 Analyses complètes pour chaque match</li>
            <li>⚡️ Fil Rouge inclus chaque journée</li>
            <li>🌍 Option Europe (+5€/mois)</li>
            <li>🏆 Championnats secondaires (+5€/mois chacun)</li>
          </ul>
        </div>

        {/* Choix championnats secondaires */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-lg font-semibold">Souhaites-tu ajouter des championnats secondaires ?</h3>
          <p className="mt-1 text-white/70 text-sm">
            Chaque ajout est facturé <strong>+5€ / mois</strong>. Tu peux aussi ne rien ajouter.
          </p>
          <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-blue-400/25 to-blue-400/0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LEAGUES.map((group, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-base font-semibold mb-2">{group.country}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.leagues.map((l) => {
                    const active = selectedLeagues.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        disabled={noExtra}
                        onClick={() => toggleLeague(l.id)}
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold border transition",
                          noExtra
                            ? "opacity-40 cursor-not-allowed"
                            : active
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {l.name} {active && <span className="ml-1 text-emerald-300">+5€</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* switch noExtra */}
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={noExtra}
                onChange={(e) => {
                  const v = e.target.checked;
                  setNoExtra(v);
                  if (v) setSelectedLeagues([]);
                }}
                className="h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
              />
              <span className="text-white/80">Je ne souhaite pas de championnats supplémentaires</span>
            </label>
          </div>

          {/* liste sélection */}
          {selectedLeagues.length > 0 && !noExtra && (
            <div className="mt-5">
              <p className="text-emerald-300 text-sm font-semibold mb-2">
                ✅ Championnats secondaires sélectionnés :
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedLeagueNames.map((n, i) => (
                  <span
                    key={`${n}-${i}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs"
                  >
                    {n} <span className="text-emerald-300 font-semibold">+5€</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Plan + option Europe */}
        {(selectedLeagues.length > 0 || noExtra) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-center">Choisis ta formule d’abonnement</h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-violet-400/30 to-violet-400/0" />

            <div
              className={[
                "relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7",
                selectedPlan === "Formule Premium" ? "ring-2 ring-emerald-400/30" : "",
              ].join(" ")}
            >
              <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                Recommandé
              </div>
              <div className="mb-3">
                <h4 className="text-xl font-bold">Mensuel sans engagement</h4>
                <div className="mt-1 text-3xl font-extrabold">19,99 € / mois</div>
                <p className="mt-2 text-white/70 text-sm">Paiement récurrent. Annulable à tout moment.</p>
              </div>
              <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />

              <button
                onClick={() => handleSelectPlan("Formule Premium")}
                className={[
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition",
                  selectedPlan === "Formule Premium"
                    ? "bg-emerald-400 text-black hover:opacity-90"
                    : "bg-white text-black hover:opacity-90",
                ].join(" ")}
              >
                {selectedPlan === "Formule Premium" ? "Sélectionné ✓" : "Choisir cette formule"}
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
        {selectedPlan && (selectedLeagues.length > 0 || noExtra) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-center">Récapitulatif</h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />

            <div className="text-center text-sm">
              <p className="text-white/80">
                Formule : <span className="font-semibold text-white">{selectedPlan}</span>
              </p>
              {optionEurope && (
                <p className="text-emerald-300">
                  Option : <strong>Europe activée (+5€/mois)</strong>
                </p>
              )}
              {!noExtra && selectedLeagueNames.length > 0 && (
                <div className="mt-3">
                  <p className="text-emerald-300 font-semibold">Championats secondaires :</p>
                  <div className="mt-1 flex flex-wrap gap-2 justify-center">
                    {selectedLeagueNames.map((n, i) => (
                      <span
                        key={`${n}-${i}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs"
                      >
                        {n} <span className="text-emerald-300 font-semibold">+5€</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-2 text-emerald-300">
                Prix total : <strong>{getPriceText()}</strong>
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