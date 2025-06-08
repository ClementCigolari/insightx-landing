"use client";

export default function Formules() {
  return (
    <section id="pricing" className="py-20 px-6 sm:px-10 bg-black text-white">
      <h2 className="text-4xl font-bold mb-10 text-center">
        Choisissez votre formule Insight-X
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Formule Découverte */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Découverte</h3>
          <p className="text-2xl font-semibold mb-4">4,99 €/mois</p>
          <p className="mb-4">
            🔓 Un seul championnat parmi les 5 grands (Ligue 1, Premier League, Bundesliga, Serie A, Liga).
            <br />👉 1 à 2 analyses par journée.
          </p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Bientôt disponible
          </button>
        </div>

        {/* Formule Passion */}
        <div className="bg-yellow-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Passion</h3>
          <p className="text-2xl font-semibold mb-4">9,99 €/mois</p>
          <p className="mb-4">
            🔓 Un seul championnat au choix parmi tous les championnats Insight-X.
            <br />👉 Analyses complètes pour chaque match.
            <br />👉 Option Europe (+5 €/mois).
          </p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Bientôt disponible
          </button>
        </div>

        {/* Formule Premium */}
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Premium</h3>
          <p className="text-2xl font-semibold mb-4">19,99 €/mois</p>
          <p className="mb-4">
            🔓 Accès aux 5 grands championnats.
            <br />👉 Toutes les analyses Insight-X.
            <br />👉 Option Europe (+5 €/mois).
            <br />👉 Autre championnat = Formule Passion (9,99 €/mois).
          </p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Bientôt disponible
          </button>
        </div>

        {/* Formule Ultra */}
        <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Ultra</h3>
          <p className="text-2xl font-semibold mb-4">49,99 €/mois</p>
          <p className="mb-4">
            🔓 Accès aux 5 grands championnats + Europe inclus.
            <br />🔓 Lives Insight-X, matchs Fil Rouge.
            <br />🔓 Dashboard personnalisé (bientôt).
          </p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Bientôt disponible
          </button>
        </div>

        {/* Formule Ultra Premium */}
        <div className="bg-red-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Ultra Premium</h3>
          <p className="text-2xl font-semibold mb-4">199,99 €/mois</p>
          <p className="mb-4">
            🔓 Tous les championnats Insight-X.
            <br />🔓 Toutes les analyses, lives et matchs Fil Rouge.
            <br />🔓 Dashboard personnalisé (bientôt).
          </p>
          <p className="italic mb-4">
            👉 Offre exceptionnelle réservée aux plus passionnés. Service limité
            pour garantir la qualité.
          </p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Bientôt disponible
          </button>
        </div>

      </div>
    </section>
  );
}