"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecapitulatif } from "@/hooks/useRecapitulatif"; // adapte le chemin si besoin

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

  const handleUpdateSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("insightx_user") || "{}");
  
    const recapData = {
      email: user.email,
      formule: "decouverte",
      plan: selectedPlan,
      league: selectedLeague,
      options: [], // 🔥 On force ici à [] pour éviter toute erreur
      prix: getPriceText(),
    };
  
    // 💾 On met à jour manuellement le localStorage (si tu veux le garder clean aussi)
    const updatedUser = {
      ...user,
      formule: "decouverte",
      plan: selectedPlan,
      league: selectedLeague,
      options: [], // 🔥 ici aussi on écrase
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

  const getPriceText = () => {
    switch (selectedPlan) {
      case "Sans engagement":
        return "4,99€ / mois (paiement récurrent, résiliable à tout moment)";
      default:
        return ""; // pour éviter undefined
    }
  };

  return (
    <section className="py-20 px-6 sm:px-10 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
          Formule Découverte : Plongez au cœur des matchs
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          Avec Insight-X, accédez à un championnat au choix et vivez nos analyses immersives,
          nos scénarios uniques et nos contenus exclusifs.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Ce que vous obtenez :</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>🎯 1 championnat au choix (Ligue 1, Premier League, Bundesliga, Serie A, Liga)</li>
            <li>⚽️ 3 analyses immersives par journée (vendredi, samedi, dimanche soir)</li>
            <li>🔥 1 Match Fil Rouge par journée avec scénario immersif & suivi live</li>
            <li>📊 Analyses stratégiques Insight-X</li>
          </ul>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Choisissez votre championnat</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ligue 1", "Premier League", "Bundesliga", "Serie A", "Liga"].map((league) => (
              <button
                key={league}
                onClick={() => handleSelectLeague(league)}
                className={`px-4 py-2 rounded-full font-semibold border ${
                  selectedLeague === league
                    ? "bg-white text-black"
                    : "bg-black text-white border-white hover:bg-white hover:text-black transition"
                }`}
              >
                {league}
              </button>
            ))}
          </div>
          {selectedLeague && (
            <p className="mt-4 text-center text-green-400">
              Vous avez sélectionné : <strong>{selectedLeague}</strong>
            </p>
          )}
        </div>

        {selectedLeague && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Choisissez votre formule d’abonnement</h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Sans engagement",
                  title: "🔁 Mensuel sans engagement",
                  description: "4,99€ / mois. Paiement récurrent. Vous pouvez annuler à tout moment.",
                },
    
              ].map(({ label, title, description }) => (
                <div
                  key={label}
                  className={`p-4 rounded-lg border ${
                    selectedPlan === label ? "bg-white text-black border-white" : "bg-gray-900 border-white"
                  }`}
                >
                  <h4 className="text-lg font-bold">{title}</h4>
                  <p className={`mb-2 whitespace-pre-line ${selectedPlan === label ? "text-black" : "text-gray-300"}`}>
                    {description}
                  </p>
                  <button
                    onClick={() => handleSelectPlan(label)}
                    className={`px-4 py-2 rounded-full font-semibold w-full ${
                      selectedPlan === label
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    Choisir cette formule
                  </button>
                </div>
              ))}
            </div>
            {selectedPlan && (
              <p className="mt-4 text-center text-green-400">
                Vous avez choisi : <strong>{selectedPlan}</strong>
              </p>
            )}
          </div>
        )}

        {selectedPlan && selectedLeague && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8 text-center">
            <h3 className="text-xl font-semibold mb-2">✅ Récapitulatif de votre sélection</h3>
            <p className="text-gray-300 mb-2">
              Championnat choisi : <strong>{selectedLeague}</strong><br />
              Formule sélectionnée : <strong>{selectedPlan}</strong><br />
              <span className="text-green-400">Prix total : <strong>{getPriceText()}</strong></span>
            </p>
            <button
              onClick={handleUpdateSubscription}
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Modification de votre abonnement
            </button>
          </div>
        )}
      </div>
    </section>
  );
}