"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModifierFormule() {
  const router = useRouter();
  const [formuleActuelle, setFormuleActuelle] = useState<string | null>(null);

  useEffect(() => {
    const recap = localStorage.getItem("insightx_user");
    if (recap) {
      try {
        const data = JSON.parse(recap);
        setFormuleActuelle(data.formule); // ex: "passion", "ultra", etc.
      } catch (error) {
        console.error("Erreur de parsing du localStorage :", error);
      }
    }
  }, []);

  const formules = [
    {
      id: "decouverte",
      titre: "✅ Formule Découverte",
      prix: "4,99 €/mois",
      color: "bg-gray-800",
      description: (
        <>
          ⚽️ Accès à 1 championnat au choix parmi les 5 grands (Ligue 1, Premier League, Bundesliga, Serie A, Liga).
          <br />📊 1 analyse immersive pour chaque jour de match principal (Vendredi, Samedi et Dimanche).
          <br />⚡️ Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.
        </>
      ),
    },
    {
      id: "passion",
      titre: "✅ Formule Passion",
      prix: "9,99 €/mois",
      color: "bg-yellow-800",
      description: (
        <>
          ⚽️ Accès à 1 championnat au choix parmi tous les championnats Insight-X.
          <br />📊 Analyses complètes pour chaque match de la journée.
          <br />⚡️ Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.
          <br />🌍 Option Europe (+5 €/mois).
        </>
      ),
    },
    {
      id: "premium",
      titre: "✅ Formule Premium",
      prix: "19,99 €/mois",
      color: "bg-blue-800",
      description: (
        <>
          ⚽️ Accès aux 5 grands championnats.
          <br />📊 Toutes les analyses Insight-X pour chaque match.
          <br />⚡️ Accès complet au match Fil Rouge chaque journée.
          <br />🌍 Option Europe (+5 €/mois).
          <br />🏆 Ajoutez un championnat secondaire pour 5€/mois.
        </>
      ),
    },
    {
      id: "ultra",
      titre: "✅ Formule Ultra",
      prix: "49,99 €/mois",
      color: "bg-purple-800",
      description: (
        <>
          ⚽️ Accès aux 5 grands championnats européens + Coupes d’Europe.
          <br />🏆 Compétitions internationales incluses : Coupe du Monde, Euro, CAN, Copa América, etc.
          <br />⚡️ Toutes les analyses, lives Insight-X et matchs Fil Rouge chaque journée.
          <br />🎯 Possibilité d’ajouter un championnat secondaire pour 5€/mois.
        </>
      ),
    },
    
  ];

  const handleClick = (slug: string) => {
    router.push(`/espace-client/compte/modifier-formule/${slug}`);
  };

  const getFormattedPlanName = (id: string) => {
    switch (id) {
      case "decouverte": return "Formule Découverte";
      case "passion": return "Formule Passion";
      case "premium": return "Formule Premium";
      case "ultra": return "Formule Ultra";
      default: return "Inconnue";
    }
  };

  if (!formuleActuelle) return null;

  return (
    <section className="py-20 px-6 sm:px-10 bg-black text-white min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center">Changer de formule</h2>
      <p className="text-center text-lg mb-12">
        Formule actuelle : <strong>{getFormattedPlanName(formuleActuelle)}</strong>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {formules
          .filter((formule) => formule.id !== formuleActuelle)
          .map((formule) => (
            <div
              key={formule.id}
              className={`${formule.color} p-6 rounded-lg shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-2">{formule.titre}</h3>
              <p className="text-2xl font-semibold mb-4">{formule.prix}</p>
              <p className="mb-4 text-sm leading-relaxed">{formule.description}</p>
              <button
                onClick={() => handleClick(formule.id)}
                className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center w-full"
              >
                Choisir cette formule
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}