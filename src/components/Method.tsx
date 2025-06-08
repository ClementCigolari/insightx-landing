export default function Method() {
    return (
      <section id="method" className="py-20 px-6 sm:px-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Notre méthode</h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Nous analysons chaque match à travers 5 piliers : contexte, stats, dynamiques, tactique et enjeu.
          Découvrez une lecture stratégique pour mieux anticiper les scénarios du jeu.
        </p>
  
        <ul className="mt-10 space-y-6 text-left max-w-xl mx-auto text-base sm:text-lg text-gray-200">
          <li>🔍 <strong>Enjeu du match</strong> – Motivation, objectifs concrets et contexte émotionnel.</li>
          <li>📊 <strong>Statistiques brutes</strong> – Données terrain : buts, possession, tirs, périodes clés.</li>
          <li>🔥 <strong>Forme & H2H</strong> – Dynamiques récentes + historique des confrontations.</li>
          <li>🧠 <strong>Joueurs clés</strong> – Analyse des titulaires, stats individuelles & rôles décisifs.</li>
          <li>🧮 <strong>Lecture croisée</strong> – Synthèse stratégique & scénarios maîtrisés.</li>
        </ul>
      </section>
    );
  }