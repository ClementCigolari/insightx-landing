"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormulePremium() {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [noExtra, setNoExtra] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [optionEurope, setOptionEurope] = useState(false);
  const router = useRouter();

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleCreateAccount = () => {
    const recapData = {
      formule: "premium",
      plan: "premium",
      options: [
        ...(optionEurope ? ["europe"] : []),
        ...selectedLeagues,
      ],
    };
  
    localStorage.setItem("insightx_recap", JSON.stringify(recapData));
    router.push("/inscription");
  };

  const getPriceText = () => {
    const basePrice = 19.99;
    const europeExtra = optionEurope ? 5 : 0;
    const leaguesExtra = selectedLeagues.length * 5;
  
    switch (selectedPlan) {
      case "Formule Premium":
        const total = basePrice + europeExtra + leaguesExtra;
        return `${total.toFixed(2)}€ / mois (paiement récurrent, résiliable à tout moment)`;
  
      default:
        return "";
    }
  };

  const leaguesList = [
    { country: "France 🇫🇷", leagues: [{ id: "FR-CDF", name: "Coupe de France" }] },
    { country: "Angleterre 🇬🇧", leagues: [
      { id: "UK-FAC", name: "FA Cup" },
    ]},
    { country: "Espagne 🇪🇸", leagues: [
      { id: "ES-CDR", name: "Copa del Rey" }
    ]},
    { country: "Italie 🇮🇹", leagues: [
      { id: "IT-CI", name: "Coppa Italia" }
    ]},
    { country: "Pays-Bas 🇳🇱", leagues: [{ id: "NL-ERE", name: "Eredivisie" }] },
    { country: "Portugal 🇵🇹", leagues: [{ id: "PT-LP", name: "Liga Portugal" }] },
    { country: "Belgique 🇧🇪", leagues: [{ id: "BE-PL", name: "Pro League" }] },
  ];

  return (
    <section className="py-20 px-6 sm:px-10 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
          Formule Premium : Les 5 grands championnats, sans aucune limite
        </h1>
  
        <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          Avec Insight-X, plongez au cœur de chaque match avec des lectures tactiques, des scénarios immersifs et un suivi complet, pensé pour les fans les plus engagés.
        </p>
  
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>⚽️ Accès aux 5 grands championnats européens</li>
            <li>📊 Analyses complètes pour chaque match</li>
            <li>⚡️ Match Fil Rouge inclus à chaque journée</li>
            <li>🌍 Option Europe : ajoutez les Coupes européennes pour 5€/mois</li>
            <li>🏆 Ajoutez des championnats secondaires pour 5€/mois chacun</li>
          </ul>
        </div>
  
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Souhaitez-vous un championnat supplémentaire pour 5€ par mois ?
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {leaguesList.map((item, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{item.country}</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {item.leagues.map((league) => (
                    <li key={league.id} className="flex items-center justify-between">
                      {league.name}
                      <input
                        type="checkbox"
                        disabled={noExtra}
                        checked={selectedLeagues.includes(league.id)}
                        onChange={() => {
                          if (selectedLeagues.includes(league.id)) {
                            setSelectedLeagues((prev) => prev.filter((id) => id !== league.id));
                          } else {
                            setSelectedLeagues((prev) => [...prev, league.id]);
                          }
                        }}
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          <div className="mt-6 flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="noExtra"
              checked={noExtra}
              onChange={(e) => {
                setNoExtra(e.target.checked);
                if (e.target.checked) {
                  setSelectedLeagues([]);
                }
              }}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
            <label htmlFor="noExtra" className="text-sm text-gray-300">
              Je ne souhaite pas de championnats supplémentaires
            </label>
          </div>
  
          {selectedLeagues.length > 0 && !noExtra && (
            <p className="mt-6 text-center text-green-400">
              ✅ Championnats sélectionnés :{" "}
              <strong>
                {selectedLeagues
                  .map((id) =>
                    leaguesList.flatMap((group) => group.leagues).find((l) => l.id === id)?.name
                  )
                  .filter(Boolean)
                  .join(", ")}
              </strong>
            </p>
          )}
        </div>
  
        {(selectedLeagues.length > 0 || noExtra) && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Choisissez votre formule d’abonnement
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Formule Premium",
                  title: "🔁 Mensuel sans engagement",
                  description: "19,99€ / mois. Paiement récurrent. Vous pouvez annuler à tout moment.",
                },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className={`p-4 rounded-lg border ${
                    selectedPlan === plan.label ? "bg-white text-black border-white" : "bg-gray-900 border-white"
                  }`}
                >
                  <h4 className="text-lg font-bold">{plan.title}</h4>
                  <p className={`mb-2 ${selectedPlan === plan.label ? "text-black" : "text-gray-300"}`}>
                    {plan.description}
                  </p>
                  <button
                    onClick={() => handleSelectPlan(plan.label)}
                    className={`px-4 py-2 rounded-full font-semibold w-full ${
                      selectedPlan === plan.label
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    Choisir cette formule
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {selectedPlan && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-2 text-center text-white">
              🌍 Envie de vibrer aussi les soirs d’Europe ?
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Pour seulement <strong>5€/mois</strong> de plus, ajoutez les soirées{" "}
              <span className="text-white">Ligue des Champions</span>,{" "}
              <span className="text-white">Europa League</span> et{" "}
              <span className="text-white">Conference League</span> à votre formule.
              <br />
              Une immersion totale dans le gratin du foot européen.
            </p>
            <div className="flex justify-center items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optionEurope}
                  onChange={() => setOptionEurope(!optionEurope)}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                <span className="text-white font-semibold">
                  Oui, je veux suivre aussi les compétitions européennes (+5€/mois)
                </span>
              </label>
            </div>
          </div>
        )}
  
  {selectedPlan && (selectedLeagues.length > 0 || noExtra) && (
  <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8 text-center">
    <h3 className="text-xl font-semibold mb-4">✅ Récapitulatif de votre sélection</h3>

    <p className="text-gray-300 mb-2">
      Formule sélectionnée : <strong>{selectedPlan}</strong>
    </p>

    {optionEurope && (
      <p className="text-green-400 font-semibold mb-2">
        ➕ Option : Europe activée <span className="text-sm">(5€/mois)</span>
      </p>
    )}

{!noExtra && (
  <div className="text-center mt-6">
    <p className="text-green-400 font-semibold mb-4">
      ➕ Championnats secondaires sélectionnés :
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      {selectedLeagues.map((id) => {
        const league = leaguesList
          .flatMap((g) => g.leagues)
          .find((l) => l.id === id);
        return (
          <span
            key={id}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm"
          >
            {league?.name || id}
            <span className="text-green-400 font-semibold text-xs">+5€</span>
          </span>
        );
      })}
    </div>
  </div>
)}

    <p className="text-green-400 text-lg mt-4">
      Prix total : <strong>{getPriceText()}</strong>
    </p>

    <button
      className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition mt-4"
      onClick={handleCreateAccount}
    >
      Création de votre espace membre
    </button>

    <p className="text-sm text-gray-400 mt-2">
      Vous créerez votre espace client juste après cette étape.
    </p>

                     {/* ✅ Bouton retour à l’intérieur */}
                     <div className="mt-6">
              <Link href="/">
                <span className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300">
                  Retour à l&apos;accueil
                  </span>
            </Link>
          </div>
        </div>
      )}
        </div> {/* ← Ferme .max-w-4xl.mx-auto */}
      </section>
    );
}
