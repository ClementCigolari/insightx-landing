"use client";

export default function Team() {
  return (
    <section id="team" className="text-center mb-24">
      <h2 className="text-3xl font-bold mb-4">👥 Découvre l’équipe Insight-X</h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-6">
        Une équipe soudée, née de parcours différents, mais animée par une même passion pour l’analyse du jeu.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Sylvia */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Sylvia – La stratège</h3>
          <p className="text-gray-400 mb-4">
            Ancienne analyste financière, Sylvia est passionnée de sport depuis toujours. Pragmatique et rassurante,
            elle veille à ce que chaque scénario d’analyse soit solide et crédible. C’est un peu la “maman” du groupe,
            celle qui apaise les tensions et garde la tête froide, même quand la passion du jeu fait battre les cœurs plus fort.
            Sa rencontre avec le fondateur a été un déclic : elle a trouvé dans Insight-X un terrain de jeu où mêler rigueur et passion.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Club préféré :</strong> Juventus <br />
            <strong>Match préféré :</strong> Juventus vs Atlético Madrid (2019) — le soir où Ronaldo a renversé la situation à Turin.
          </p>
        </div>

        {/* Reno */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Reno – L’analyste créatif</h3>
          <p className="text-gray-400 mb-4">
            Issu du monde de la vente, Reno a toujours eu le flair pour raconter des histoires, même là où personne ne les voyait.
            C’est le créatif, l’underdog qu’on n’attendait pas mais qui fait mouche à chaque fois. Toujours à l’affût du petit détail
            qui change tout, il bouscule les certitudes et apporte la dose d’adrénaline à l’équipe. Sa rencontre avec le fondateur,
            un soir de match au stade, a marqué le début d’une belle aventure collective.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Club préféré :</strong> Marseille <br />
            <strong>Match préféré :</strong> Marseille vs Leipzig (2018) — l’Europa League, un match fou, 5-2, où le Vélodrome a vibré comme jamais.
          </p>
        </div>

        {/* Le Fondateur */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Le Fondateur – Le chef d’orchestre</h3>
          <p className="text-gray-400 mb-4">
            Passionné de foot depuis toujours, le fondateur est le ciment de l’équipe. Celui qui fédère les talents, qui laisse les autres briller
            et qui veille à ce que chaque pièce du puzzle soit à sa place. Il préfère rester dans l’ombre, convaincu que ce sont les idées et l’esprit
            d’équipe qui doivent primer. Insight-X, c’est son rêve d’enfant devenu réalité : une façon de vivre le foot autrement, ensemble.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Club préféré :</strong> PSG <br />
            <strong>Match préféré :</strong> La Remontada Barcelone - PSG — le match qui a fait mentir toutes les statistiques.
          </p>
        </div>
      </div>
    </section>
  );
}