"use client";

export default function MentionsLegales() {
  return (
    <section className="py-20 px-6 sm:px-10 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📄 Mentions légales – Insight-X</h1>

        <p className="mb-4">
          <strong>Éditeur du site</strong><br />
          Insight-X<br />
          Clément Cigolari<br />
          3 Rue Marcelin Berthelot, 92000 Nanterre – France<br />
          SIRET : 944 508 860 00011<br />
          📧 contact@insight-x.fr
        </p>

        <p className="mb-4">
          <strong>Directeur de la publication</strong><br />
          Clément Cigolari
        </p>

        <p className="mb-4">
          <strong>Hébergement</strong><br />
          Vercel Inc.<br />
          440 N Barranca Ave #4133<br />
          Covina, CA 91723 – États-Unis<br />
          🌐 <a href="https://vercel.com" className="text-blue-400 hover:underline">https://vercel.com</a>
        </p>

        <p className="mb-4">
          <strong>Nature de l’activité</strong><br />
          Insight-X est un service d’analyses sportives à visée <strong>purement informative</strong>. 
          Aucun résultat n’est garanti. Les contenus proposés ne constituent <strong>en aucun cas</strong> 
          une incitation à participer à des jeux d’argent ou de hasard. 
          L’accès est réservé aux personnes majeures (+18 ans).
        </p>

        <p className="mb-4">
          <strong>Propriété intellectuelle</strong><br />
          L’ensemble du contenu présent sur ce site (textes, images, illustrations, logos, vidéos, codes sources, structure et charte graphique) 
          est protégé par le droit de la propriété intellectuelle et est la propriété exclusive de Insight-X ou de ses partenaires. 
          Toute reproduction ou représentation totale ou partielle est interdite sans autorisation écrite préalable.
        </p>

        <p className="mb-4">
          <strong>Collecte et traitement des données personnelles</strong><br />
          Les données collectées (email, prénom, options d’abonnement) sont utilisées uniquement pour :
          <ul className="list-disc ml-6 mt-2">
            <li>La gestion des accès aux espaces réservés</li>
            <li>L’information sur les nouveautés et analyses</li>
            <li>La gestion administrative et comptable des abonnements</li>
          </ul>
          Ces données sont traitées conformément au <strong>RGPD</strong> et conservées de manière sécurisée. 
          Vous pouvez exercer vos droits d’accès, de rectification et de suppression en écrivant à 📧 contact@insight-x.fr.
        </p>

        <p className="mb-4">
          <strong>Responsabilité</strong><br />
          Insight-X s’efforce de fournir des informations précises et à jour. 
          Toutefois, l’éditeur ne saurait être tenu responsable :
          <ul className="list-disc ml-6 mt-2">
            <li>Des erreurs ou omissions éventuelles</li>
            <li>Des dommages directs ou indirects liés à l’utilisation du site</li>
            <li>Du contenu des sites externes liés</li>
          </ul>
        </p>

        <p className="mb-4">
          <strong>Prix et devises</strong><br />
          Sauf mention contraire, tous les prix affichés sont en euros (€) TTC.
        </p>

        <p className="mb-4">
          <strong>Liens externes</strong><br />
          Ce site peut contenir des liens vers d’autres sites. 
          Insight-X décline toute responsabilité quant à leur contenu.
        </p>

        <p className="mb-4">
          <strong>Crédits</strong><br />
          Design et développement : Clément Cigolari avec l’assistance de l’IA Insight-X.
        </p>
      </div>
    </section>
  );
}