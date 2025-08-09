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
            ⚽️ Accès à 1 championnat au choix parmi les 5 grands (Ligue 1, Premier League, Bundesliga, Serie A, Liga).
            <br />📊 1 analyse immersive pour chaque jour de match principal (Vendredi, Samedi et Dimanche).
            <br />⚡️ Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.
          </p>
          <a
            href="/abonnement/decouverte"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center"
          >
            Choisir cette formule
          </a>
        </div>

        {/* Formule Passion */}
        <div className="bg-yellow-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Passion</h3>
          <p className="text-2xl font-semibold mb-4">9,99 €/mois</p>
          <p className="mb-4">
            ⚽️ Accès à 1 championnat au choix parmi tous les championnats Insight-X.
            <br />📊 Analyses complètes pour chaque match de la journée.
            <br />⚡️ Accès au match Fil Rouge uniquement si celui-ci est dans le championnat choisi.
            <br />🌍 Option Europe (+5 €/mois).
          </p>
          <a
            href="/abonnement/passion"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center"
          >
            Choisir cette formule
          </a>
        </div>

        {/* Formule Premium */}
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Premium</h3>
          <p className="text-2xl font-semibold mb-4">19,99 €/mois</p>
          <p className="mb-4">
            ⚽️ Accès aux 5 grands championnats.
            <br />📊 Toutes les analyses Insight-X pour chaque match.
            <br />⚡️ Accès complet au match Fil Rouge chaque journée.
            <br />🌍 Option Europe (+5 €/mois).
            <br />🏆 Ajoutez un championnat secondaire pour 5€/mois.
          </p>
          <a
            href="/abonnement/premium"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center"
          >
            Choisir cette formule
          </a>
        </div>

        {/* Formule Ultra */}
        <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Ultra</h3>
          <p className="text-2xl font-semibold mb-4">49,99 €/mois</p>
          <p className="mb-4">
          ⚽️ Accès aux 5 grands championnats européens (Ligue 1, Premier League, Bundesliga, Liga, Serie A) + Coupes d’Europe (Ligue des Champions, Europa League, Conférence)
            <br />🏆 Compétitions internationales incluses : Coupe du Monde, Euro, CAN, Copa América, Ligue des Nations, Coupe du Monde des Clubs
            <br />⚡️ Toutes les analyses, lives Insight-X et matchs Fil Rouge chaque journée.
            <br />🎯 Possibilité d’ajouter un championnat secondaire pour 5€/mois
          </p>
          <a
            href="/abonnement/ultra"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center"
          >
            Choisir cette formule
          </a>
        </div>

        {/* Formule Ultra Premium */}
        <div className="bg-red-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">✅ Formule Ultra Premium</h3>
          <p className="text-2xl font-semibold mb-4">199,99 €/mois</p>
          <p className="mb-4">
          🔥 La formule ultime : toutes les offres Insight-X réunies en une seule.
            <br />⚡️ Accès intégral à toutes les analyses, lives et matchs Fil Rouge
            <br />📊 Dashboard personnalisé exclusif
            <br />🔐 Offre limitée, réservée aux plus passionnés. Sélection sur candidature.
          </p>
          <a
            href="/abonnement/ultrapremium"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition block text-center"
          >
            Choisir cette formule
          </a>
        </div>

      </div>
    </section>
  );
}