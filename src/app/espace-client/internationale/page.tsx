import { internationale } from "@/app/data/internationale";
import InternationaleCard from "@/components/InternationaleCard";

export default function MesChampionats() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Compétitions Internationales</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {internationale.map((internationale) => (
          <InternationaleCard
            key={internationale.name}
            name={internationale.name}
            logo={internationale.logo}
            href={internationale.href}
          />
        ))}
      </div>
    </div>
  );
}