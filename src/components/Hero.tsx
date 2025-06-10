import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 sm:px-10">
      <Image
        className="mb-10"
        src="/logo-insight-x.png"
        alt="Insight-X Logo"
        width={400}
        height={400}
        priority
      />

      <h1 className="text-3xl sm:text-5xl font-bold mt-6">
        Insight-X : Analyse stratégique et immersive du football européen et mondial
      </h1>

      <p className="text-lg sm:text-xl text-gray-400 mt-4 max-w-xl">
        Plongez au cœur des matchs avec Insight-X, votre allié incontournable pour des analyses 
        détaillées, des scénarios immersifs et des statistiques exclusives. Vivez chaque compétition 
        avec passion et expertise.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a
          href="#method"
          className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300"
        >
          Découvrir la méthode
        </a>
        <a
          href="#team"
          className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300"
        >
          Découvrir l’équipe
        </a>
        <a
          href="#pricing"
          className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300"
        >
          Découvrir les formules
        </a>
        <a
          href="#competitions"
          className="inline-block rounded-full border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition duration-300"
        >
          Découvrir les championnats
        </a>
      </div>
    </section>
  );
}