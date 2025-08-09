"use client";
import Link from "next/link"

export default function FormuleUltraPremium() {

  return (
    <div className="relative min-h-screen pb-28 bg-black text-white px-6 sm:px-10 pt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Formule Ultra Premium</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          Le pack ultime avec tout inclus : Europe, championnats secondaires, compétitions internationales, dashboards, lives, scénarios immersifs.
        </p>
      </div>

      {/* Bloc d’avantages */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">🔥 Ce que vous obtenez :</h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-300 text-base">
          <li>🎯 Accès à toutes les analyses Insight-X, tous les championnats, toutes les coupes</li>
          <li>📺 Accès intégral aux lives, Matchs Fil Rouge et alertes personnalisées</li>
          <li>📊 Dashboard exclusif pour suivre vos lectures et performances</li>
          <li>🔐 Offre strictement limitée à 5 membres</li>
          <li>📝 Sélection sur candidature, avec signature d’un engagement de confidentialité et conditions spéciales</li>
        </ul>
      </div>

      {/* Bloc formule unique */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-10">
        <h3 className="text-white text-2xl font-semibold text-center mb-6">Choisissez votre formule d’abonnement</h3>

        <div className="p-4 rounded-lg border bg-gray-600 border-gray-400 opacity-60">
          <h4 className="text-lg font-bold text-white">🔁 Mensuel sans engagement</h4>
          <p className="mb-4 text-gray-300">
            199,99€/mois — Offre ultra complète sans durée minimum.
            <br />
            ⚠️ Candidature obligatoire. L’équipe Insight-X vous contactera après validation.
          </p>
          <button
            disabled
            className="w-full px-4 py-2 rounded-full font-semibold bg-gray-500 text-gray-300 cursor-not-allowed"
          >
            🚧 Lancement prochainement
          </button>
        </div>
      </div>

      {/* ✅ Bouton Retour à l'accueil — TOUJOURS affiché en bas */}
      <div className="text-center pb-20">
        <Link href="/">
          <span className="inline-block mt-4 rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300">
            Retour à l&apos;accueil
          </span>
        </Link>
      </div>
    </div>
  );
}