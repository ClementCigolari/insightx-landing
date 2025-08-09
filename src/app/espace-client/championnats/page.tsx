"use client";

import { useEffect, useState } from "react";
import { championnats, type Championnat } from "@/app/data/championnats";
import ChampionnatCard from "@/components/ChampionnatCard";

export default function MesChampionats() {
  const [championnatsVisibles, setChampionnatsVisibles] = useState<Championnat[]>([]);

  useEffect(() => {
    const userRaw = localStorage.getItem("insightx_user");
    if (!userRaw) return;
  
    const user = JSON.parse(userRaw);
    const formule = user.formule;
    const ligue = user.ligue || [];
    const options = user.options || [];
  
    let filtres: Championnat[] = [];
  
    if (formule === "decouverte") {
      const ligueArray = Array.isArray(ligue) ? ligue : [ligue];
      filtres = championnats.filter((champ) => ligueArray.includes(champ.nom));
    } else if (formule === "passion") {
      // 🎯 Ici ligue est un tableau de codes (ex: ["FR-L1", "UK-PL"])
      const codes = Array.isArray(ligue) ? ligue : [];
      filtres = championnats.filter((champ) => codes.includes(champ.code));
    } else if (formule === "premium" || formule === "ultra") {
      // 🎯 5 grands + options supplémentaires (tous en `code`)
      const grandsCodes = ["FR-L1", "UK-PL", "DE-BUN", "IT-A", "ES-L1"];
      const optionCodes = Array.isArray(options) ? options : [];
      const allCodes = new Set([...grandsCodes, ...optionCodes]);
  
      filtres = championnats.filter((champ) => allCodes.has(champ.code));
    }
  
    setChampionnatsVisibles(filtres);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-6">Mes championnats</h1>
      {championnatsVisibles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {championnatsVisibles.map((championnat) => (
            <ChampionnatCard
              key={championnat.name}
              nom={championnat.nom}
              code={championnat.code}
              name={championnat.name}
              logo={championnat.logo}
              href={championnat.href}
            />
          ))}
        </div>
      ) : (
        <p className="text-white">
          Aucun championnat accessible avec votre formule actuelle.
        </p>
      )}
    </div>
  );
}