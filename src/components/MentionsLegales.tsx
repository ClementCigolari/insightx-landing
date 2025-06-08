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
          3 Rue Marcelin Berthelot 92000 Nanterre<br />
          SIRET : 94450886000011<br />
          contact@insight-x.fr
        </p>
        <p className="mb-4">
          <strong>Directeur de la publication</strong><br />
          Clément Cigolari
        </p>
        <p className="mb-4">
          <strong>Hébergement</strong><br />
          Vercel Inc.<br />
          440 N Barranca Ave #4133<br />
          Covina, CA 91723<br />
          <a href="https://vercel.com" className="text-blue-400 hover:underline">https://vercel.com</a>
        </p>
        <p className="mb-4">
          <strong>Propriété intellectuelle</strong><br />
          Le contenu de ce site (textes, images, illustrations, logos, etc.) est protégé par le droit de la propriété intellectuelle et est la propriété exclusive de Insight-X ou de ses partenaires. Toute reproduction ou représentation totale ou partielle est interdite sans autorisation écrite préalable.
        </p>
        <p className="mb-4">
          <strong>Collecte de données personnelles</strong><br />
          Le site Insight-X collecte des données personnelles uniquement dans le cadre de la mise en place d’une liste d’attente pour informer des nouveautés et du lancement prochain. Ces données sont conservées de manière confidentielle et sécurisée. Vous disposez d’un droit d’accès, de modification et de suppression de vos données personnelles en écrivant à contact@insight-x.fr.
        </p>
        <p className="mb-4">
          <strong>Responsabilité</strong><br />
          Le site Insight-X s’efforce de fournir des informations précises et à jour. Toutefois, il ne saurait être tenu responsable des éventuelles erreurs ou omissions.
        </p>
        <p className="mb-4">
          <strong>Liens externes</strong><br />
          Le site Insight-X peut contenir des liens vers d’autres sites. Insight-X décline toute responsabilité quant au contenu de ces sites externes.
        </p>
        <p className="mb-4">
          <strong>Crédits</strong><br />
          Design et développement : Clément Cigolari avec l’aide de l’IA Insight-X.
        </p>
      </div>
    </section>
  );
}