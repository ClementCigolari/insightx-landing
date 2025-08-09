"use client";
import Link from "next/link";
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

  const handleCreateAccount = () => {
    const recapData = {
      formule: "decouverte", // ✅ corrigé ici
      plan: selectedPlan,
      league: selectedLeague,
      prix: getPriceText(),
    };
  
    setRecapitulatif(recapData); // context (non persistant)
    localStorage.setItem("insightx_recap", JSON.stringify(recapData)); // ✅ mémoire navigateur
  
    setTimeout(() => {
      router.push(`/inscription`);
    }, 0);
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
              onClick={handleCreateAccount}
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Création de votre espace membre
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Vous créerez votre espace client juste après cette étape.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href="/">
            <span className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300">
              Retour à l&apos;accueil
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}