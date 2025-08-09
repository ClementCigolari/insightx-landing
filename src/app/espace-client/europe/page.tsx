import { europe } from "@/app/data/europe";
import EuropeCard from "@/components/EuropeCard";

export default function MesChampionats() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Coupes d&apos;Europe</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {europe.map((europe) => (
          <EuropeCard
            key={europe.name}
            name={europe.name}
            logo={europe.logo}
            href={europe.href}
          />
        ))}
      </div>
    </div>
  );
}