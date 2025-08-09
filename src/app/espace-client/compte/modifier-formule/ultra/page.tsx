"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif";

export default function FormuleUltra() {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [noExtra, setNoExtra] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const router = useRouter();
  const { setRecapitulatif } = useRecapitulatif();

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");

    const recapData = {
      email: user.email,
      formule: "ultra",
      plan: selectedPlan,
      league: "multi", // logique identique à premium
      options: selectedLeagues,
      prix: getPriceText(),
    };

    const updatedUser = {
      ...user,
      formule: "ultra",
      plan: selectedPlan,
      league: "multi",
      options: selectedLeagues,
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
    }else {
      alert("Une erreur est survenue. Merci de réessayer ou de nous contacter.");
    }
  };

  const getPriceText = () => {
    const basePrice = 49.99;
    const leaguesExtra = selectedLeagues.length * 5;

    if (selectedPlan === "Formule Ultra") {
      const total = basePrice + leaguesExtra;
      return `${total.toFixed(2)}€ / mois (paiement récurrent, résiliable à tout moment)`;
    }
    return "";
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
          Formule Ultra : le pack total pour vivre chaque match à fond.
        </h1>
  
        <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center max-w-3xl mx-auto">
        Avec Insight-X, vivez le football comme jamais : lectures tactiques affûtées, scénarios immersifs, et suivi total pour ceux qui veulent tout comprendre… et tout ressentir.
        </p>
  
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="list-disc pl-6 space-y-3">
              <li>⚽️ Accès aux 5 grands championnats européens (Ligue 1, Premier League, Bundesliga, Liga, Serie A) + Coupes d’Europe (Ligue des Champions, Europa League, Conférence)</li>
              <li>🏆 Compétitions internationales incluses : Coupe du Monde, Euro, CAN, Copa América, Ligue des Nations, Coupe du Monde des Clubs</li>
              <li>📊 Analyses complètes pour chaque match</li>
              <li>⚡️ Match Fil Rouge inclus à chaque journée</li>
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
                  label: "Formule Ultra",
                  title: "🔁 Mensuel sans engagement",
                  description: "49,99€ / mois. Paiement récurrent. Vous pouvez annuler à tout moment.",
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
  
  {selectedPlan && (selectedLeagues.length > 0 || noExtra) && (
  <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8 text-center">
    <h3 className="text-xl font-semibold mb-4">✅ Récapitulatif de votre sélection</h3>

    <p className="text-gray-300 mb-2">
      Formule sélectionnée : <strong>{selectedPlan}</strong>
    </p>

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
