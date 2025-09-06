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

export default function FormuleUltra() {
  const router = useRouter();
  const { setRecapitulatif } = useRecapitulatif();

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [noExtra, setNoExtra] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const toggleLeague = (id: string) => {
    if (noExtra) return;
    setSelectedLeagues((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectPlan = (plan: string) => setSelectedPlan(plan);

  const getPriceText = () => {
    const base = 49.99;
    const plusLeagues = selectedLeagues.length * 5;
    if (selectedPlan === "Formule Ultra") {
      const total = base + plusLeagues;
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

    const recapData = {
      email: user.email,
      formule: "ultra",
      plan: selectedPlan,
      league: "multi",
      options: selectedLeagues,
      prix: getPriceText(),
    };

    const updatedUser = {
      ...user,
      formule: "ultra",
      plan: selectedPlan,
      ligue: "multi",
      options: selectedLeagues,
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
          🏆 Formule
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
          Ultra — le pack total pour vivre chaque match à fond
        </h1>
        <p className="mt-3 text-white/70 max-w-3xl">
          5 grands championnats + Coupes d’Europe + compétitions internationales incluses.
          Ajoute des championnats secondaires si tu veux absolument tout suivre.
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
            <li>⚽️ Accès aux 5 grands championnats (L1, PL, Bundesliga, Liga, Serie A)</li>
            <li>🌍 Coupes d’Europe incluses (UCL, UEL, UECL – phases de groupes et +)</li>
            <li>🏆 Compétitions internationales incluses (CM, Euro, CAN, Copa América, Nations League, CM des clubs)</li>
            <li>📊 Analyses complètes pour chaque match</li>
            <li>⚡️ Fil Rouge chaque journée</li>
            <li>➕ Championnats secondaires au choix (+5€/mois chacun)</li>
          </ul>
        </div>

        {/* Choix championnats secondaires */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
          <h3 className="text-lg font-semibold">Ajouter des championnats secondaires ?</h3>
          <p className="mt-1 text-white/70 text-sm">
            Chaque ajout est facturé <strong>+5€ / mois</strong>. Tu peux bien sûr ne rien ajouter.
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

        {/* Plan */}
        {(selectedLeagues.length > 0 || noExtra) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <h3 className="text-lg font-semibold text-center">Choisis ta formule d’abonnement</h3>
            <div aria-hidden className="mx-auto my-4 h-px w-full bg-gradient-to-r from-violet-400/30 to-violet-400/0" />

            <div
              className={[
                "relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7",
                selectedPlan === "Formule Ultra" ? "ring-2 ring-emerald-400/30" : "",
              ].join(" ")}
            >
              <div className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                Tout inclus
              </div>
              <div className="mb-3">
                <h4 className="text-xl font-bold">Mensuel sans engagement</h4>
                <div className="mt-1 text-3xl font-extrabold">49,99 € / mois</div>
                <p className="mt-2 text-white/70 text-sm">Paiement récurrent. Annulable à tout moment.</p>
              </div>
              <div aria-hidden className="my-4 h-px w-full bg-gradient-to-r from-emerald-400/25 to-emerald-400/0" />

              <button
                onClick={() => handleSelectPlan("Formule Ultra")}
                className={[
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition",
                  selectedPlan === "Formule Ultra"
                    ? "bg-emerald-400 text-black hover:opacity-90"
                    : "bg-white text-black hover:opacity-90",
                ].join(" ")}
              >
                {selectedPlan === "Formule Ultra" ? "Sélectionné ✓" : "Choisir cette formule"}
              </button>
            </div>
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