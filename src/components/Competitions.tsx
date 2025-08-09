"use client";
import { FaTrophy, FaStar } from "react-icons/fa";

export default function Competitions() {
  return (
    <section id="competitions" className="py-20 px-6 sm:px-10 bg-black text-white">
      <h2 className="text-4xl font-bold mb-10 text-center">
        🏟️ Les Championnats et Compétitions Insight-X
      </h2>

      <p className="text-gray-300 max-w-3xl mx-auto text-center mb-8">
        Découvrez tous les championnats et compétitions couverts par Insight-X. 
        Une offre complète pour vibrer au rythme des plus grands matchs de la
        saison, selon la formule choisie.
      </p>

      {/* Les 5 grands championnats */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <FaStar className="text-yellow-400 mr-2" />
          Les 5 grands championnats européens :
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg">
          <li>🇫🇷 Ligue 1 (France)</li>
          <li>🇬🇧 Premier League (Angleterre)</li>
          <li>🇩🇪 Bundesliga (Allemagne)</li>
          <li>🇮🇹 Serie A (Italie)</li>
          <li>🇪🇸 La Liga (Espagne)</li>
        </ul>
      </div>

      {/* Les compétitions européennes */}
      <div className="bg-purple-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <FaTrophy className="text-yellow-400 mr-2" />
          Les compétitions européennes :
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg">
          <li>Ligue des Champions</li>
          <li>Europa League</li>
          <li>Conférence League</li>
        </ul>
      </div>

      {/* Les autres championnats et coupes */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Les autres championnats et coupes :</h3>
        <p className="text-gray-300 mb-4">
          🇳🇱 Eredivisie, 🇵🇹 Liga Portugal, 🇧🇪 Pro League,
          Et bientôt d'autre c'est entre vos mains.
        </p>
      </div>
    </section>
  );
}