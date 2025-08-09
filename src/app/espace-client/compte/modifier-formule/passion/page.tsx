"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

export default function FormulePassion() {
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [optionEurope, setOptionEurope] = useState(false);
  const { setRecapitulatif } = useRecapitulatif();
  const router = useRouter();

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");

    const options = optionEurope ? ["europe"] : [];

    const recapData = {
      email: user.email,
      formule: "passion",
      plan: selectedPlan,
      league: selectedLeague,
      options: options,
      prix: getPriceText(optionEurope),
    };

    // On met à jour le localStorage aussi côté user
    const updatedUser = {
      ...user,
      formule: "passion",
      plan: selectedPlan,
      league: selectedLeague,
      options: options,
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
      const confirmed = window.confirm("Votre demande de changement de formule a bien été envoyée à l’équipe Insight-X.\n\nElle prendra effet à la date de renouvellement de votre abonnement mensuel.\n\nVous allez maintenant être déconnecté(e).");
    
      if (confirmed) {
        // 🔐 Déconnexion propre
        localStorage.removeItem("insightx_user");
        localStorage.removeItem("insightx_recap");
        
        // 🔁 Redirection vers la page de connexion
        router.push("/connexion");
      }
    } else {
      alert("Une erreur est survenue. Merci de réessayer ou de nous contacter.");
    }
  };

  const getPriceText = (includeEurope: boolean) => {
    if (selectedPlan === "Sans engagement") {
      const base = 9.99;
      const total = includeEurope ? base + 5 : base;
      const desc = includeEurope ? "formule Passion + Europe" : "formule Passion";
      return `${total.toFixed(2)}€ / mois (${desc})`;
    }
    return "";
  };

  const leaguesList = [
    { country: "France 🇫🇷", leagues: [{ id: "FR-L1", name: "Ligue 1" }, { id: "FR-CDF", name: "Coupe de France" }] },
    { country: "Angleterre 🇬🇧", leagues: [
      { id: "UK-PL", name: "Premier League" },
      { id: "UK-FAC", name: "FA Cup" },
    ]},
    { country: "Espagne 🇪🇸", leagues: [
      { id: "ES-L1", name: "La Liga" },
      { id: "ES-CDR", name: "Copa del Rey" }
    ]},
    { country: "Italie 🇮🇹", leagues: [
      { id: "IT-A", name: "Serie A" },
      { id: "IT-CI", name: "Coppa Italia" }
    ]},
    { country: "Allemagne 🇩🇪", leagues: [{ id: "DE-BUN", name: "Bundesliga" }] },
    { country: "Pays-Bas 🇳🇱", leagues: [{ id: "NL-ERE", name: "Eredivisie" }] },
    { country: "Portugal 🇵🇹", leagues: [{ id: "PT-LP", name: "Liga Portugal" }] },
    { country: "Belgique 🇧🇪", leagues: [{ id: "BE-PL", name: "Pro League" }] },
  ];

  return (
    <section className="py-20 px-6 sm:px-10 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
          Formule Passion : Vivez chaque match de votre championnat comme un insider
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          Avec Insight-X, accédez à un championnat au choix et vivez chaque match à fond grâce à nos analyses immersives, nos scénarios stratégiques et nos contenus exclusifs conçus pour les vrais passionnés.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>🎯 Accès à 1 championnat au choix parmi tous les championnats disponibles sur Insight-X.</li>
            <li>📊 Analyses complètes pour chaque match de votre championnat : immersion, stratégie, stats clés et décryptage minute par minute.</li>
            <li>🔥 Accès au Match Fil Rouge, uniquement si celui-ci concerne votre championnat sélectionné.</li>
            <li>🌍 Option Europe disponible : ajoutez la Ligue des Champions et la Ligue Europa pour 5€/mois en plus.</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Choisissez votre championnat principal
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Ce championnat sera inclus dans votre abonnement de base à <strong>9,99€/mois</strong>.
          </p>

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
              checked={selectedLeague === league.id}
              onChange={() =>
                setSelectedLeague((prev) => (prev === league.id ? "" : league.id))
              }
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

{selectedLeague && (
  <p className="mt-6 text-center text-green-400">
    ✅ Vous avez sélectionné :{" "}
    <strong>
      {
        leaguesList
          .flatMap((group) => group.leagues)
          .find((l) => l.id === selectedLeague)?.name
      }
    </strong>
  </p>
)}
        </div>

        {selectedLeague && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Choisissez votre formule d’abonnement
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: "Sans engagement", title: "🔁 Mensuel sans engagement", description: "9,99€ / mois. Paiement récurrent. Vous pouvez annuler à tout moment." },
              ].map((plan) => (
                <div key={plan.label} className={`p-4 rounded-lg border ${selectedPlan === plan.label ? "bg-white text-black border-white" : "bg-gray-900 border-white"}`}>
                  <h4 className="text-lg font-bold">{plan.title}</h4>
                  <p className={`mb-2 ${selectedPlan === plan.label ? "text-black" : "text-gray-300"}`}>{plan.description}</p>
                  <button
                    onClick={() => handleSelectPlan(plan.label)}
                    className={`px-4 py-2 rounded-full font-semibold w-full ${selectedPlan === plan.label ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"}`}
                  >
                    Choisir cette formule
                  </button>
                </div>
              ))}
            </div>

            {selectedPlan && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-2 text-center text-white">🌍 Envie de vibrer aussi les soirs d’Europe ?</h3>
                <p className="text-gray-300 text-center mb-4">
                  Pour seulement <strong>5€/mois</strong> de plus, ajoutez les soirées <span className="text-white">Ligue des Champions</span>, <span className="text-white">Europa League</span> et <span className="text-white">Conference League</span> à votre formule.<br />
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
          </div>
        )}

        {selectedPlan && selectedLeague && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8 text-center">
            <h3 className="text-xl font-semibold mb-2">✅ Récapitulatif de votre sélection</h3>
            <p className="text-gray-300 mb-4">
              Championnat : <strong>{selectedLeague}</strong><br />
              Formule sélectionnée : <strong>{selectedPlan}</strong><br />
              {optionEurope && (
                <>
                  Option : <span className="text-green-400 font-semibold">Europe activée (+5€/mois)</span><br />
                </>
              )}
              <span className="text-green-400">Prix total : <strong>{getPriceText(optionEurope)}</strong></span>
            </p>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
              onClick={handleUpdateSubscription}
            >
              Modification de votre abonnement
            </button>
          </div>
        )}
      </div>
    </section>
  );
}